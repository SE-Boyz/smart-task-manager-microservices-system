const { connectToDatabase } = require("../config/database");

const COLLECTION_NAME = "users";

async function getCollection() {
  const database = await connectToDatabase();
  return database.collection(COLLECTION_NAME);
}

async function createUser(user) {
  const collection = await getCollection();
  await collection.insertOne(user);
  return user;
}

async function findUserByEmail(email) {
  const collection = await getCollection();
  return collection.findOne({ email }, { projection: { _id: 0 } });
}

async function findUserById(id) {
  const collection = await getCollection();
  return collection.findOne({ id }, { projection: { _id: 0, password: 0 } });
}

module.exports = {
  createUser,
  findUserByEmail,
  findUserById
};
