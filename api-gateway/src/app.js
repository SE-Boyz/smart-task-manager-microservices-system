const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const gatewayRouter = require("./routes/gatewayRoutes");

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
  res.status(200).json({
    service: "api-gateway",
    status: "ok"
  });
});

app.use("/", gatewayRouter);

module.exports = app;
