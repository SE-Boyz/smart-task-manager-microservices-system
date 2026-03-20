import 'dotenv/config'
import app from './app.js'
import { closeDatabaseConnection, connectToDatabase } from './config/database.js'
import { getEnv } from './config/env.js'

async function startServer() {
  const { port, mongoDbName } = getEnv()

  console.log(`Checking MongoDB connection for Notification Service (${mongoDbName})...`)

  await connectToDatabase()
  console.log(`MongoDB connection established for Notification Service (${mongoDbName}).`)

  const server = app.listen(port, () => {
    console.log(`Notification Service running on http://localhost:${port}`)
  })

  async function shutdown(signal: string) {
    console.log(`Received ${signal}. Shutting down Notification Service...`)
    server.close(async () => {
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
  console.error('Failed to start Notification Service:', error)
  process.exit(1)
})
