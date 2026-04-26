import amqp, { type Channel, type ChannelModel, type ConsumeMessage } from 'amqplib'
import { applyTaskEventToProjection } from '../models/reportModel.js'
import type { TaskEvent } from '../types/taskEvent.js'
import { getEnv } from './env.js'

const FAILED_ROUTING_KEY = 'task.failed'

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

function isTaskEvent(payload: unknown): payload is TaskEvent {
  if (typeof payload !== 'object' || payload === null) {
    return false
  }

  const event = payload as Record<string, unknown>

  return (
    typeof event.eventId === 'string' &&
    typeof event.eventType === 'string' &&
    typeof event.occurredAt === 'string' &&
    typeof event.taskId === 'string' &&
    typeof event.userId === 'string' &&
    typeof event.title === 'string' &&
    (event.status === 'pending' || event.status === 'completed')
  )
}

function parseTaskEvent(message: ConsumeMessage) {
  const payload = JSON.parse(message.content.toString('utf-8')) as unknown

  if (!isTaskEvent(payload)) {
    throw new Error('Received invalid task event payload.')
  }

  return payload
}

export async function connectToBroker() {
  if (brokerConnection && consumerChannel) {
    return consumerChannel
  }

  const {
    rabbitMqUrl,
    taskEventsExchange,
    taskEventsQueue,
    taskEventsDeadLetterExchange,
    taskEventsDeadLetterQueue,
  } = getEnv()

  brokerStatus = 'connecting'

  const connection = await amqp.connect(rabbitMqUrl)
  const channel = await connection.createChannel()

  await channel.assertExchange(taskEventsExchange, 'topic', {
    durable: true,
  })
  await channel.assertExchange(taskEventsDeadLetterExchange, 'topic', {
    durable: true,
  })
  await channel.assertQueue(taskEventsQueue, {
    durable: true,
    deadLetterExchange: taskEventsDeadLetterExchange,
    deadLetterRoutingKey: FAILED_ROUTING_KEY,
  })
  await channel.assertQueue(taskEventsDeadLetterQueue, {
    durable: true,
  })
  await channel.bindQueue(taskEventsQueue, taskEventsExchange, 'task.*')
  await channel.bindQueue(
    taskEventsDeadLetterQueue,
    taskEventsDeadLetterExchange,
    FAILED_ROUTING_KEY,
  )
  await channel.prefetch(10)

  brokerConnection = connection
  consumerChannel = channel
  brokerStatus = 'connected'

  registerBrokerListeners(connection)

  return channel
}

export async function startTaskEventConsumer() {
  if (!consumerChannel) {
    throw new Error('RabbitMQ channel is not initialized.')
  }

  const { taskEventsQueue } = getEnv()

  await consumerChannel.consume(
    taskEventsQueue,
    async (message) => {
      if (!message || !consumerChannel) {
        return
      }

      try {
        const taskEvent = parseTaskEvent(message)
        console.log(`[Report Service] 📥 SOURCE: Task Service (via RabbitMQ) | ACTION: Updating Projection | EVENT: ${taskEvent.eventType}`);
        await applyTaskEventToProjection(taskEvent)
        console.log(`[Report Service] ✅ ACTION: Projection Updated | DATA: { taskId: "${taskEvent.taskId}", status: "${taskEvent.status}" }`);
        consumerChannel.ack(message)
      } catch (error) {
        console.error('[Report Service] ❌ ACTION: Failed to update projection', error)
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
