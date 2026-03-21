import 'dotenv/config'
import app from './app.js'
import { closeBrokerConnection, connectToBroker } from './config/broker.js'
import { closeDatabaseConnection, connectToDatabase } from './config/database.js'
import { getEnv } from './config/env.js'

const BROKER_CONNECT_RETRIES = 12
const BROKER_RETRY_DELAY_MS = 5000

function wait(delayMs: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, delayMs)
  })
}

async function connectToBrokerWithRetry() {
  for (let attempt = 1; attempt <= BROKER_CONNECT_RETRIES; attempt += 1) {
    try {
      await connectToBroker()
      return
    } catch (error) {
      if (attempt === BROKER_CONNECT_RETRIES) {
        throw error
      }

      console.warn(
        `RabbitMQ connection attempt ${attempt} failed. Retrying in ${BROKER_RETRY_DELAY_MS / 1000}s...`,
      )
      await wait(BROKER_RETRY_DELAY_MS)
    }
  }
}

async function startServer() {
  const { port, mongoDbName } = getEnv()

  console.log(`Checking MongoDB connection for Task Service (${mongoDbName})...`)

  await connectToDatabase()
  console.log(`MongoDB connection established for Task Service (${mongoDbName}).`)
  console.log('Checking RabbitMQ connection for Task Service...')
  await connectToBrokerWithRetry()
  console.log('RabbitMQ connection established for Task Service.')

  const server = app.listen(port, () => {
    console.log(`Task Service running on http://localhost:${port}`)
  })

  async function shutdown(signal: string) {
    console.log(`Received ${signal}. Shutting down Task Service...`)
    server.close(async () => {
      await closeBrokerConnection()
      await closeDatabaseConnection()
      process.exit(0)
    })
  }

  process.on('SIGINT', () => {
    void shutdown('SIGINT')
  })
  process.on('SIGTERM', () => {
    void shutdown('SIGTERM')
  })
}

startServer().catch((error) => {
  console.error('Failed to start Task Service:', error)
  process.exit(1)
})
