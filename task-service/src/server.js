require("dotenv").config();
const app = require("./app");
const { connectToDatabase, closeDatabaseConnection } = require("./config/database");
const { getEnv } = require("./config/env");

async function startServer() {
  const { port, mongoDbName } = getEnv();

  console.log(`Checking MongoDB connection for Task Service (${mongoDbName})...`);

  await connectToDatabase();
  console.log(`MongoDB connection established for Task Service (${mongoDbName}).`);

  const server = app.listen(port, () => {
    console.log(`Task Service running on http://localhost:${port}`);
  });

  async function shutdown(signal) {
    console.log(`Received ${signal}. Shutting down Task Service...`);
    server.close(async () => {
      await closeDatabaseConnection();
      process.exit(0);
    });
  }

  process.on("SIGINT", () => shutdown("SIGINT"));
  process.on("SIGTERM", () => shutdown("SIGTERM"));
}

startServer().catch((error) => {
  console.error("Failed to start Task Service:", error);
  process.exit(1);
});
