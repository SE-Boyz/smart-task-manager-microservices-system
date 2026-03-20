const express = require("express");
const { proxyRequest } = require("../controllers/gatewayController");

const router = express.Router();

router.all(
  ["/auth", "/auth/*", "/tasks", "/tasks/*", "/notifications", "/notifications/*", "/reports", "/reports/*"],
  proxyRequest
);

module.exports = router;
