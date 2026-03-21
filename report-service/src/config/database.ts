import mongoose from 'mongoose'
import { getEnv } from './env.js'

let databasePromise: Promise<mongoose.Connection> | undefined
let databaseStatus = 'disconnected'

export async function connectToDatabase() {
  if (databasePromise) {
    return databasePromise
  }

  const { mongoUri, mongoDbName } = getEnv()

  databaseStatus = 'connecting'

  databasePromise = mongoose
    .connect(mongoUri, {
      dbName: mongoDbName,
    })
    .then((connection) => {
      databaseStatus = 'connected'
      return connection.connection
    })
    .catch((error) => {
      databaseStatus = 'error'
      databasePromise = undefined
      throw error
    })

  return databasePromise
}

export async function closeDatabaseConnection() {
  if (mongoose.connection.readyState === 0) {
    databasePromise = undefined
    databaseStatus = 'disconnected'
    return
  }

  await mongoose.disconnect()
  databasePromise = undefined
  databaseStatus = 'disconnected'
}

export function getDatabaseStatus() {
  return databaseStatus
}
