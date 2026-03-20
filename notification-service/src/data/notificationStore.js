const { connectToDatabase } = require("../config/database");

const COLLECTION_NAME = "notifications";

async function getCollection() {
  const database = await connectToDatabase();
  return database.collection(COLLECTION_NAME);
}

async function createNotification(notification) {
  const collection = await getCollection();
  await collection.insertOne(notification);
  return notification;
}

async function getNotifications() {
  const collection = await getCollection();
  return collection.find({}, { projection: { _id: 0 } }).sort({ createdAt: -1 }).toArray();
}

module.exports = {
  createNotification,
  getNotifications
};
