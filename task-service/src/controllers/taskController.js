const axios = require("axios");
const { v4: uuidv4 } = require("uuid");
const { readTasks, writeTasks } = require("../data/taskStore");

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
    const tasks = await readTasks();

    // The report service uses a service token, so it can fetch all tasks.
    if (req.user.role === "service") {
      return res.status(200).json({ tasks });
    }

    const userTasks = tasks.filter((task) => task.userId === req.user.id);

    return res.status(200).json({ tasks: userTasks });
  } catch (error) {
    next(error);
  }
}

async function createTask(req, res, next) {
  try {
    const { title, status } = req.body;
    const tasks = await readTasks();

    const newTask = {
      id: uuidv4(),
      userId: req.user.id,
      title,
      status,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    tasks.push(newTask);
    await writeTasks(tasks);
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
    const tasks = await readTasks();
    const taskIndex = tasks.findIndex((task) => task.id === id);

    if (taskIndex === -1) {
      return res.status(404).json({ message: "Task not found" });
    }

    const existingTask = tasks[taskIndex];

    if (req.user.role !== "service" && existingTask.userId !== req.user.id) {
      return res.status(403).json({ message: "You are not allowed to update this task" });
    }

    const updatedTask = {
      ...existingTask,
      title,
      status,
      updatedAt: new Date().toISOString()
    };

    tasks[taskIndex] = updatedTask;
    await writeTasks(tasks);
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
    const tasks = await readTasks();
    const existingTask = tasks.find((task) => task.id === id);

    if (!existingTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (req.user.role !== "service" && existingTask.userId !== req.user.id) {
      return res.status(403).json({ message: "You are not allowed to delete this task" });
    }

    const updatedTasks = tasks.filter((task) => task.id !== id);
    await writeTasks(updatedTasks);

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
