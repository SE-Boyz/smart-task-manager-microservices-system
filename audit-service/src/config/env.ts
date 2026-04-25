const DEFAULT_PORT = 5005
const DEFAULT_DB_NAME = 'audit_service_db'

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
  return key.replace(/\\n/g, '\n').replace(/\r/g, '').trim()
}

export interface AuditServiceEnv {
  port: number
  jwtPublicKey: string
  rabbitMqUrl: string
  userEventsExchange: string
  userEventsQueue: string
  userEventsDeadLetterExchange: string
  userEventsDeadLetterQueue: string
  mongoUri: string
  mongoDbName: string
}

export function getEnv(): AuditServiceEnv {
  return {
    port: Number(process.env.PORT || DEFAULT_PORT),
    jwtPublicKey: getNormalizedKey('JWT_PUBLIC_KEY'),
    rabbitMqUrl: getRequiredEnvVar('RABBITMQ_URL'),
    userEventsExchange: process.env.USER_EVENTS_EXCHANGE || 'user.events',
    userEventsQueue: process.env.USER_EVENTS_QUEUE || 'audit-service.user-events',
    userEventsDeadLetterExchange:
      process.env.USER_EVENTS_DEAD_LETTER_EXCHANGE || 'user.events.dlx',
    userEventsDeadLetterQueue:
      process.env.USER_EVENTS_DEAD_LETTER_QUEUE || 'audit-service.user-events.dlq',
    mongoUri: getMongoUri(),
    mongoDbName: process.env.MONGODB_DB_NAME || DEFAULT_DB_NAME,
  }
}
