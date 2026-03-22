const DEFAULT_PORT = 5002
const DEFAULT_DB_NAME = 'task_service_db'

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
  return getRequiredEnvVar(name).replace(/\\n/g, '\n')
}

export interface TaskServiceEnv {
  port: number
  jwtPublicKey: string
  rabbitMqUrl: string
  taskEventsExchange: string
  mongoUri: string
  mongoDbName: string
}

export function getEnv(): TaskServiceEnv {
  return {
    port: Number(process.env.PORT || DEFAULT_PORT),
    jwtPublicKey: getNormalizedKey('JWT_PUBLIC_KEY'),
    rabbitMqUrl: getRequiredEnvVar('RABBITMQ_URL'),
    taskEventsExchange: process.env.TASK_EVENTS_EXCHANGE || 'task.events',
    mongoUri: getMongoUri(),
    mongoDbName: process.env.MONGODB_DB_NAME || DEFAULT_DB_NAME,
  }
}
