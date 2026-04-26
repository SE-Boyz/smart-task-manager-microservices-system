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
  
  // Master Integration: Listen to Task, Notification, and Report events
  const TASK_EXCHANGE = process.env.TASK_EVENTS_EXCHANGE || 'task.events';
  await channel.assertExchange(TASK_EXCHANGE, 'topic', { durable: true });
  await channel.bindQueue(userEventsQueue, TASK_EXCHANGE, 'task.*');
  await channel.bindQueue(userEventsQueue, TASK_EXCHANGE, 'notification.*');
  await channel.bindQueue(userEventsQueue, TASK_EXCHANGE, 'report.*');
  console.log(`[Audit Service] 🔗 Master Connection established for Task, Notification, and Report events.`);

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
        
        // Smarter source detection
        let source = 'System';
        if (payload.eventType.startsWith('task.')) source = 'Task Service';
        else if (payload.eventType.startsWith('user.')) source = 'Auth Service';
        else if (payload.eventType.startsWith('notification.')) source = 'Notification Service';
        else if (payload.eventType.startsWith('report.')) source = 'Report Service';
        
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
