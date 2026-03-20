const axios = require("axios");
const jwt = require("jsonwebtoken");

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
    const total = tasks.length;
    const completed = tasks.filter((task) => task.status === "completed").length;
    const pending = tasks.filter((task) => task.status === "pending").length;

    return res.status(200).json({
      total,
      completed,
      pending
    });
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
