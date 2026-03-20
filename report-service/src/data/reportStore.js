const { connectToDatabase } = require("../config/database");

const COLLECTION_NAME = "report_summaries";

async function getCollection() {
  const database = await connectToDatabase();
  return database.collection(COLLECTION_NAME);
}

async function saveSummarySnapshot(summary) {
  const collection = await getCollection();
  await collection.insertOne(summary);
  return summary;
}

module.exports = {
  saveSummarySnapshot
};
