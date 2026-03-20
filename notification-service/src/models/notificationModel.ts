import mongoose from 'mongoose'

export interface NotificationRecord {
  id: string
  message: string
  createdAt: string
}

const notificationSchema = new mongoose.Schema<NotificationRecord>(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    createdAt: {
      type: String,
      required: true,
      index: true,
    },
  },
  {
    versionKey: false,
    collection: 'notifications',
  },
)

const Notification =
  mongoose.models.Notification ||
  mongoose.model<NotificationRecord>('Notification', notificationSchema)

export async function createNotification(notification: NotificationRecord) {
  const createdNotification = await Notification.create(notification)
  return createdNotification.toObject({ versionKey: false })
}

export async function getNotifications() {
  return Notification.find().sort({ createdAt: -1 }).select('-_id').lean<NotificationRecord[]>()
}
