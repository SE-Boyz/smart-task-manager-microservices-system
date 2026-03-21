import 'dotenv/config'
import app from './app.js'
import { closeBrokerConnection, connectToBroker } from './config/broker.js'
import { closeDatabaseConnection, connectToDatabase } from './config/database.js'
import { getEnv } from './config/env.js'

async function startServer() {
  const { port, mongoDbName } = getEnv()

  console.log(`Checking MongoDB connection for Task Service (${mongoDbName})...`)

  await connectToDatabase()
  console.log(`MongoDB connection established for Task Service (${mongoDbName}).`)
  console.log('Checking RabbitMQ connection for Task Service...')
  await connectToBroker()
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
