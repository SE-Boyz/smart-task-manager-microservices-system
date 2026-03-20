const fs = require("fs").promises;
const path = require("path");

const usersFilePath = path.join(__dirname, "users.json");

async function readUsers() {
  const fileContent = await fs.readFile(usersFilePath, "utf-8");
  return JSON.parse(fileContent.replace(/^\uFEFF/, ""));
}

async function writeUsers(users) {
  await fs.writeFile(usersFilePath, JSON.stringify(users, null, 2));
}

module.exports = {
  readUsers,
  writeUsers
};

