const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const swaggerUi = require("swagger-ui-express");
const authRoutes = require("./routes/authRoutes");
const swaggerSpec = require("./config/swagger");
const { getDatabaseStatus } = require("./config/database");
const errorHandler = require("./middleware/errorHandler");


const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({ message: "Auth Service is running" });
});

app.get("/health", (req, res) => {
  res.status(200).json({
    service: "auth-service",
    status: "ok",
    database: getDatabaseStatus()
  });
});

app.use("/", authRoutes);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(errorHandler);

module.exports = app;
