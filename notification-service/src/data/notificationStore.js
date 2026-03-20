const fs = require("fs").promises;
const path = require("path");

const notificationsFilePath = path.join(__dirname, "notifications.json");

async function readNotifications() {
  const fileContent = await fs.readFile(notificationsFilePath, "utf-8");
  return JSON.parse(fileContent.replace(/^\uFEFF/, ""));
}

async function writeNotifications(notifications) {
  await fs.writeFile(notificationsFilePath, JSON.stringify(notifications, null, 2));
}

module.exports = {
  readNotifications,
  writeNotifications
};

