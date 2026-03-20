const { v4: uuidv4 } = require("uuid");
const { readNotifications, writeNotifications } = require("../data/notificationStore");

async function storeNotification(req, res, next) {
  try {
    const { message } = req.body;
    const notifications = await readNotifications();

    const newNotification = {
      id: uuidv4(),
      message,
      createdAt: new Date().toISOString()
    };

    notifications.push(newNotification);
    await writeNotifications(notifications);

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
    const notifications = await readNotifications();

    return res.status(200).json({ notifications });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  storeNotification,
  getNotifications
};
