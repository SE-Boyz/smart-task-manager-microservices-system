import amqp, { type Channel, type ChannelModel } from 'amqplib'
import { getEnv } from './env.js'
import type { UserEvent } from '../types/userEvent.js'

let brokerConnection: ChannelModel | undefined
let brokerChannel: Channel | undefined
let brokerStatus = 'disconnected'

function registerBrokerListeners(connection: ChannelModel) {
  connection.on('error', () => {
    brokerStatus = 'error'
  })

  connection.on('close', () => {
    brokerStatus = 'disconnected'
    brokerConnection = undefined
    brokerChannel = undefined
  })
}

export async function connectToBroker() {
  if (brokerConnection && brokerChannel) {
    return brokerChannel
  }

  const { rabbitMqUrl, userEventsExchange } = getEnv()

  brokerStatus = 'connecting'

  const connection = await amqp.connect(rabbitMqUrl)
  const channel = await connection.createChannel()

  await channel.assertExchange(userEventsExchange, 'topic', {
    durable: true,
  })

  brokerConnection = connection
  brokerChannel = channel
  brokerStatus = 'connected'

  registerBrokerListeners(connection)

  return channel
}

export async function publishUserEvent(userEvent: UserEvent) {
  if (!brokerChannel) {
    throw new Error('RabbitMQ channel is not initialized.')
  }

  const { userEventsExchange } = getEnv()

  brokerChannel.publish(
    userEventsExchange,
    userEvent.eventType,
    Buffer.from(JSON.stringify(userEvent)),
    {
      persistent: true,
      contentType: 'application/json',
      contentEncoding: 'utf-8',
      messageId: userEvent.eventId,
      timestamp: Date.parse(userEvent.occurredAt),
      type: userEvent.eventType,
    },
  )
}

export async function closeBrokerConnection() {
  if (brokerChannel) {
    await brokerChannel.close()
    brokerChannel = undefined
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
