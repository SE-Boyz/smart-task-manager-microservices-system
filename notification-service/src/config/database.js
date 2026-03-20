const mongoose = require("mongoose");
const { getEnv } = require("./env");

let databasePromise;
let databaseStatus = "disconnected";

async function connectToDatabase() {
  if (databasePromise) {
    return databasePromise;
  }

  const { mongoUri, mongoDbName } = getEnv();

  databaseStatus = "connecting";

  databasePromise = mongoose
    .connect(mongoUri, {
      dbName: mongoDbName
    })
    .then((connection) => {
      databaseStatus = "connected";
      return connection.connection;
    })
    .catch((error) => {
      databaseStatus = "error";
      databasePromise = undefined;
      throw error;
    });

  return databasePromise;
}

async function closeDatabaseConnection() {
  if (mongoose.connection.readyState === 0) {
    databasePromise = undefined;
    databaseStatus = "disconnected";
    return;
  }

  await mongoose.disconnect();
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
