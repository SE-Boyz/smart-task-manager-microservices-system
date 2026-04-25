const DEFAULT_PORT = 5001
const DEFAULT_DB_NAME = 'auth_service_db'

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

export interface AuthServiceEnv {
  port: number
  jwtPrivateKey: string
  jwtPublicKey: string
  rabbitMqUrl: string
  userEventsExchange: string
  mongoUri: string
  mongoDbName: string
}

export function getEnv(): AuthServiceEnv {
  return {
    port: Number(process.env.PORT || DEFAULT_PORT),
    jwtPrivateKey: getNormalizedKey('JWT_PRIVATE_KEY'),
    jwtPublicKey: getNormalizedKey('JWT_PUBLIC_KEY'),
    rabbitMqUrl: getRequiredEnvVar('RABBITMQ_URL'),
    userEventsExchange: process.env.USER_EVENTS_EXCHANGE || 'user.events',
    mongoUri: getMongoUri(),
    mongoDbName: process.env.MONGODB_DB_NAME || DEFAULT_DB_NAME,
  }
}
