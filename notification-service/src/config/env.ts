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

export interface NotificationServiceEnv {
  port: number
  mongoUri: string
  mongoDbName: string
}

export function getEnv(): NotificationServiceEnv {
  return {
    port: Number(process.env.PORT || DEFAULT_PORT),
    mongoUri: getMongoUri(),
    mongoDbName: process.env.MONGODB_DB_NAME || DEFAULT_DB_NAME,
  }
}
