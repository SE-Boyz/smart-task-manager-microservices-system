require("dotenv").config();
const app = require("./app");
const { connectToDatabase, closeDatabaseConnection } = require("./config/database");
const { getEnv } = require("./config/env");

async function startServer() {
  const { port } = getEnv();

  await connectToDatabase();

  const server = app.listen(port, () => {
    console.log(`Notification Service running on http://localhost:${port}`);
  });

  async function shutdown(signal) {
    console.log(`Received ${signal}. Shutting down Notification Service...`);
    server.close(async () => {
      await closeDatabaseConnection();
      process.exit(0);
    });
  }

  process.on("SIGINT", () => shutdown("SIGINT"));
  process.on("SIGTERM", () => shutdown("SIGTERM"));
}

startServer().catch((error) => {
  console.error("Failed to start Notification Service:", error);
  process.exit(1);
});
