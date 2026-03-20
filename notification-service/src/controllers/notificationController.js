const { v4: uuidv4 } = require("uuid");
const { createNotification, getNotifications: listNotifications } = require("../models/notificationModel");

async function storeNotification(req, res, next) {
  try {
    const { message } = req.body;

    const newNotification = {
      id: uuidv4(),
      message,
      createdAt: new Date().toISOString()
    };

    await createNotification(newNotification);

    return res.status(201).json({
      message: "Notification stored successfully",
      notification: newNotification
    });
  } catch (error) {
    next(error);
  }
}

async function getNotifications(req, res, next) {
  try {
    const notifications = await listNotifications();

    return res.status(200).json({ notifications });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  storeNotification,
  getNotifications
};
