const DEFAULT_PORT = 5003
const DEFAULT_DB_NAME = 'notification_service_db'

function getRequiredEnvVar(name: string): string {
  const value = process.env[name]

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`)
  }

  return value
}

function getMongoUri(): string {
  const uri = getRequiredEnvVar('MONGODB_URI')

  if (uri.includes('<db_password>')) {
    throw new Error('Replace <db_password> in MONGODB_URI before starting the service.')
  }

  return uri
}

function getNormalizedKey(name: string): string {
  const key = getRequiredEnvVar(name)
  const normalized = key.replace(/\\n/g, '\n').replace(/\r/g, '').trim()
  console.log(`[Debug] Key '${name}' length: ${normalized.length}`)
  console.log(`[Debug] Key '${name}' starts with: ${normalized.substring(0, 20)}...`)
  console.log(`[Debug] Key '${name}' ends with: ...${normalized.substring(normalized.length - 20)}`)
  return normalized
}

export interface NotificationServiceEnv {
  port: number
  jwtPublicKey: string
  rabbitMqUrl: string
  taskEventsExchange: string
  taskEventsQueue: string
  taskEventsDeadLetterExchange: string
  taskEventsDeadLetterQueue: string
  mongoUri: string
  mongoDbName: string
}

export function getEnv(): NotificationServiceEnv {
  return {
    port: Number(process.env.PORT || DEFAULT_PORT),
    jwtPublicKey: getNormalizedKey('JWT_PUBLIC_KEY'),
    rabbitMqUrl: getRequiredEnvVar('RABBITMQ_URL'),
    taskEventsExchange: process.env.TASK_EVENTS_EXCHANGE || 'task.events',
    taskEventsQueue: process.env.TASK_EVENTS_QUEUE || 'notification-service.task-events',
    taskEventsDeadLetterExchange:
      process.env.TASK_EVENTS_DEAD_LETTER_EXCHANGE || 'task.events.dlx',
    taskEventsDeadLetterQueue:
      process.env.TASK_EVENTS_DEAD_LETTER_QUEUE || 'notification-service.task-events.dlq',
    mongoUri: getMongoUri(),
    mongoDbName: process.env.MONGODB_DB_NAME || DEFAULT_DB_NAME,
  }
}
