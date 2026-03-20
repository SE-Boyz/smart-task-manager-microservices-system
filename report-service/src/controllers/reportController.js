const axios = require("axios");
const jwt = require("jsonwebtoken");
const { saveSummarySnapshot } = require("../models/reportModel");

function createServiceToken() {
  return jwt.sign(
    {
      role: "service",
      serviceName: "report-service"
    },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );
}

async function getSummary(req, res, next) {
  try {
    const token = createServiceToken();

    const response = await axios.get(`${process.env.TASK_SERVICE_URL}/tasks`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const tasks = response.data.tasks || [];
    const summary = {
      total: tasks.length,
      completed: tasks.filter((task) => task.status === "completed").length,
      pending: tasks.filter((task) => task.status === "pending").length,
      generatedAt: new Date().toISOString()
    };

    await saveSummarySnapshot(summary);

    return res.status(200).json(summary);
  } catch (error) {
    if (error.response) {
      return res.status(error.response.status).json({
        message: "Failed to fetch tasks from Task Service"
      });
    }

    next(error);
  }
}

module.exports = {
  getSummary
};
