const axios = require("axios");
const { v4: uuidv4 } = require("uuid");
const {
  createTask: createTaskRecord,
  deleteTaskById,
  findTaskById,
  findTasksByUser,
  getAllTasks,
  updateTaskById
} = require("../models/taskModel");

async function sendNotification(message) {
  try {
    await axios.post(`${process.env.NOTIFICATION_SERVICE_URL}/notify`, { message });
  } catch (error) {
    // The main task action still succeeds even if the notification service is unavailable.
    console.error("Failed to send notification:", error.message);
  }
}

async function getTasks(req, res, next) {
  try {
    if (req.user.role === "service") {
      const tasks = await getAllTasks();
      return res.status(200).json({ tasks });
    }

    const userTasks = await findTasksByUser(req.user.id);

    return res.status(200).json({ tasks: userTasks });
  } catch (error) {
    next(error);
  }
}

async function createTask(req, res, next) {
  try {
    const { title, status } = req.body;

    const newTask = {
      id: uuidv4(),
      userId: req.user.id,
      title,
      status,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await createTaskRecord(newTask);
    await sendNotification(`Task created: ${newTask.title}`);

    return res.status(201).json({
      message: "Task created successfully",
      task: newTask
    });
  } catch (error) {
    next(error);
  }
}

async function updateTask(req, res, next) {
  try {
    const { id } = req.params;
    const { title, status } = req.body;
    const existingTask = await findTaskById(id);

    if (!existingTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (req.user.role !== "service" && existingTask.userId !== req.user.id) {
      return res.status(403).json({ message: "You are not allowed to update this task" });
    }

    const updatedTask = {
      ...existingTask,
      title,
      status,
      updatedAt: new Date().toISOString()
    };

    await updateTaskById(id, updatedTask);
    await sendNotification(`Task updated: ${updatedTask.title}`);

    return res.status(200).json({
      message: "Task updated successfully",
      task: updatedTask
    });
  } catch (error) {
    next(error);
  }
}

async function deleteTask(req, res, next) {
  try {
    const { id } = req.params;
    const existingTask = await findTaskById(id);

    if (!existingTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (req.user.role !== "service" && existingTask.userId !== req.user.id) {
      return res.status(403).json({ message: "You are not allowed to delete this task" });
    }

    await deleteTaskById(id);

    return res.status(200).json({
      message: "Task deleted successfully"
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getTasks,
  createTask,
  updateTask,
  deleteTask
};
