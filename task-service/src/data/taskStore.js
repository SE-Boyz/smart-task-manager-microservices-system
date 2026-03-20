const { connectToDatabase } = require("../config/database");

const COLLECTION_NAME = "tasks";

async function getCollection() {
  const database = await connectToDatabase();
  return database.collection(COLLECTION_NAME);
}

async function getAllTasks() {
  const collection = await getCollection();
  return collection.find({}, { projection: { _id: 0 } }).toArray();
}

async function findTasksByUser(userId) {
  const collection = await getCollection();
  return collection.find({ userId }, { projection: { _id: 0 } }).toArray();
}

async function findTaskById(id) {
  const collection = await getCollection();
  return collection.findOne({ id }, { projection: { _id: 0 } });
}

async function createTask(task) {
  const collection = await getCollection();
  await collection.insertOne(task);
  return task;
}

async function updateTaskById(id, task) {
  const collection = await getCollection();
  await collection.replaceOne({ id }, task);
  return task;
}

async function deleteTaskById(id) {
  const collection = await getCollection();
  await collection.deleteOne({ id });
}

module.exports = {
  createTask,
  deleteTaskById,
  findTaskById,
  findTasksByUser,
  getAllTasks,
  updateTaskById
};
