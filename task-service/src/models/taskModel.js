const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    userId: {
      type: String,
      required: true,
      index: true
    },
    title: {
      type: String,
      required: true,
      trim: true
    },
    status: {
      type: String,
      required: true,
      enum: ["pending", "completed"]
    },
    createdAt: {
      type: String,
      required: true
    },
    updatedAt: {
      type: String,
      required: true
    }
  },
  {
    versionKey: false,
    collection: "tasks"
  }
);

taskSchema.index({ userId: 1, createdAt: -1 });

const Task = mongoose.models.Task || mongoose.model("Task", taskSchema);

async function getAllTasks() {
  return Task.find().select("-_id").lean();
}

async function findTasksByUser(userId) {
  return Task.find({ userId }).select("-_id").lean();
}

async function findTaskById(id) {
  return Task.findOne({ id }).select("-_id").lean();
}

async function createTask(task) {
  const createdTask = await Task.create(task);
  return createdTask.toObject({ versionKey: false });
}

async function updateTaskById(id, task) {
  return Task.findOneAndReplace({ id }, task, {
    returnDocument: "after",
    projection: {
      _id: 0
    },
    lean: true
  });
}

async function deleteTaskById(id) {
  await Task.deleteOne({ id });
}

module.exports = {
  createTask,
  deleteTaskById,
  findTaskById,
  findTasksByUser,
  getAllTasks,
  updateTaskById
};
