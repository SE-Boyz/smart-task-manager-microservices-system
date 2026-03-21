import amqp, { type Channel, type ChannelModel, type ConsumeMessage } from 'amqplib'
import { createAuditLog } from '../models/auditLogModel.js'
import type { UserEvent } from '../types/userEvent.js'
import { getEnv } from './env.js'

const FAILED_ROUTING_KEY = 'user.failed'

let brokerConnection: ChannelModel | undefined
let consumerChannel: Channel | undefined
let brokerStatus = 'disconnected'

function registerBrokerListeners(connection: ChannelModel) {
  connection.on('error', () => {
    brokerStatus = 'error'
  })

  connection.on('close', () => {
    brokerStatus = 'disconnected'
    brokerConnection = undefined
    consumerChannel = undefined
  })
}

function isUserEvent(payload: unknown): payload is UserEvent {
  if (typeof payload !== 'object' || payload === null) {
    return false
  }

  const event = payload as Record<string, unknown>

  return (
    typeof event.eventId === 'string' &&
    (event.eventType === 'user.registered' || event.eventType === 'user.logged_in') &&
    typeof event.occurredAt === 'string' &&
    typeof event.userId === 'string' &&
    typeof event.name === 'string' &&
    typeof event.email === 'string'
  )
}

function parseUserEvent(message: ConsumeMessage) {
  const payload = JSON.parse(message.content.toString('utf-8')) as unknown

  if (!isUserEvent(payload)) {
    throw new Error('Received invalid user event payload.')
  }

  return payload
}

async function persistUserAuditLog(userEvent: UserEvent) {
  try {
    await createAuditLog({
      id: userEvent.eventId,
      userId: userEvent.userId,
      email: userEvent.email,
      name: userEvent.name,
      eventType: userEvent.eventType,
      createdAt: userEvent.occurredAt,
    })
  } catch (error: unknown) {
    if (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      error.code === 11000
    ) {
      return
    }

    throw error
  }
}

export async function connectToBroker() {
  if (brokerConnection && consumerChannel) {
    return consumerChannel
  }

  const {
    rabbitMqUrl,
    userEventsExchange,
    userEventsQueue,
    userEventsDeadLetterExchange,
    userEventsDeadLetterQueue,
  } = getEnv()

  brokerStatus = 'connecting'

  const connection = await amqp.connect(rabbitMqUrl)
  const channel = await connection.createChannel()

  await channel.assertExchange(userEventsExchange, 'topic', {
    durable: true,
  })
  await channel.assertExchange(userEventsDeadLetterExchange, 'topic', {
    durable: true,
  })
  await channel.assertQueue(userEventsQueue, {
    durable: true,
    deadLetterExchange: userEventsDeadLetterExchange,
    deadLetterRoutingKey: FAILED_ROUTING_KEY,
  })
  await channel.assertQueue(userEventsDeadLetterQueue, {
    durable: true,
  })
  await channel.bindQueue(userEventsQueue, userEventsExchange, 'user.*')
  await channel.bindQueue(
    userEventsDeadLetterQueue,
    userEventsDeadLetterExchange,
    FAILED_ROUTING_KEY,
  )
  await channel.prefetch(10)

  brokerConnection = connection
  consumerChannel = channel
  brokerStatus = 'connected'

  registerBrokerListeners(connection)

  return channel
}

export async function startUserEventConsumer() {
  if (!consumerChannel) {
    throw new Error('RabbitMQ channel is not initialized.')
  }

  const { userEventsQueue } = getEnv()

  await consumerChannel.consume(
    userEventsQueue,
    async (message) => {
      if (!message || !consumerChannel) {
        return
      }

      try {
        const userEvent = parseUserEvent(message)
        await persistUserAuditLog(userEvent)
        consumerChannel.ack(message)
      } catch (error) {
        console.error('Failed to process user event:', error)
        consumerChannel.nack(message, false, false)
      }
    },
    {
      noAck: false,
    },
  )
}

export async function closeBrokerConnection() {
  if (consumerChannel) {
    await consumerChannel.close()
    consumerChannel = undefined
  }

  if (brokerConnection) {
    await brokerConnection.close()
    brokerConnection = undefined
  }

  brokerStatus = 'disconnected'
}

export function getBrokerStatus() {
  return brokerStatus
}
