const { MongoClient } = require("mongodb");
const { getEnv } = require("./env");

let client;
let databasePromise;
let databaseStatus = "disconnected";

async function createIndexes(database) {
  await database.collection("tasks").createIndex({ id: 1 }, { unique: true });
  await database.collection("tasks").createIndex({ userId: 1, createdAt: -1 });
}

async function connectToDatabase() {
  if (databasePromise) {
    return databasePromise;
  }

  const { mongoUri, mongoDbName } = getEnv();

  databaseStatus = "connecting";
  client = new MongoClient(mongoUri);

  databasePromise = client
    .connect()
    .then(async (connectedClient) => {
      const database = connectedClient.db(mongoDbName);
      await createIndexes(database);
      await database.command({ ping: 1 });
      databaseStatus = "connected";
      return database;
    })
    .catch((error) => {
      databaseStatus = "error";
      databasePromise = undefined;
      throw error;
    });

  return databasePromise;
}

async function closeDatabaseConnection() {
  if (!client) {
    return;
  }

  await client.close();
  client = undefined;
  databasePromise = undefined;
  databaseStatus = "disconnected";
}

function getDatabaseStatus() {
  return databaseStatus;
}

module.exports = {
  connectToDatabase,
  closeDatabaseConnection,
  getDatabaseStatus
};
