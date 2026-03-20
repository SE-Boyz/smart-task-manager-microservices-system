const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
      lowercase: true
    },
    password: {
      type: String,
      required: true
    }
  },
  {
    versionKey: false,
    collection: "users"
  }
);

const User = mongoose.models.User || mongoose.model("User", userSchema);

async function createUser(user) {
  const createdUser = await User.create(user);
  return createdUser.toObject({ versionKey: false });
}

async function findUserByEmail(email) {
  return User.findOne({ email }).select("-_id").lean();
}

async function findUserById(id) {
  return User.findOne({ id }).select("-_id -password").lean();
}

module.exports = {
  createUser,
  findUserByEmail,
  findUserById
};
