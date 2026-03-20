const fs = require("fs").promises;
const path = require("path");

const tasksFilePath = path.join(__dirname, "tasks.json");

async function readTasks() {
  const fileContent = await fs.readFile(tasksFilePath, "utf-8");
  return JSON.parse(fileContent.replace(/^\uFEFF/, ""));
}

async function writeTasks(tasks) {
  await fs.writeFile(tasksFilePath, JSON.stringify(tasks, null, 2));
}

module.exports = {
  readTasks,
  writeTasks
};

