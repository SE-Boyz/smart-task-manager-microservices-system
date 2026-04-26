import amqp, { type Channel, type ChannelModel, type ConsumeMessage } from 'amqplib'
import { createAuditLog } from '../models/auditLogModel.js'
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
        const payload = JSON.parse(message.content.toString('utf-8')) as any;
        const source = payload.eventType.startsWith('task.') ? 'Task Service' : 'Auth Service';
        
        console.log(`[Audit Service] 📥 SOURCE: ${source} (via RabbitMQ) | ACTION: Persistence | EVENT: ${payload.eventType}`);

        // Save ANY event to the database
        await createAuditLog({
          id: payload.eventId || payload.id || new Date().getTime().toString(),
          userId: payload.userId,
          eventType: payload.eventType,
          metadata: payload, 
          createdAt: payload.occurredAt || new Date().toISOString(),
        });

        console.log(`[Audit Service] ✅ ACTION: Audit Log Stored | DATA: { type: "${payload.eventType}", id: "${payload.eventId || payload.id}" }`);
        consumerChannel.ack(message)
      } catch (error) {
        console.error('[Audit Service] ❌ ACTION: Failed to persist audit log', error)
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
