const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    message: {
      type: String,
      required: true,
      trim: true
    },
    createdAt: {
      type: String,
      required: true,
      index: true
    }
  },
  {
    versionKey: false,
    collection: "notifications"
  }
);

const Notification =
  mongoose.models.Notification || mongoose.model("Notification", notificationSchema);

async function createNotification(notification) {
  const createdNotification = await Notification.create(notification);
  return createdNotification.toObject({ versionKey: false });
}

async function getNotifications() {
  return Notification.find().sort({ createdAt: -1 }).select("-_id").lean();
}

module.exports = {
  createNotification,
  getNotifications
};
