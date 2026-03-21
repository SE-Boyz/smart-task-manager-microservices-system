import mongoose from 'mongoose'

export interface NotificationRecord {
  id: string
  userId: string
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
    userId: {
      type: String,
      required: true,
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

export async function getNotificationsByUser(userId: string) {
  return Notification.find({ userId })
    .sort({ createdAt: -1 })
    .select('-_id')
    .lean<NotificationRecord[]>()
}

export async function deleteNotificationById(id: string, userId: string) {
  const deletedNotification = await Notification.findOneAndDelete({ id, userId })
    .select('-_id')
    .lean<NotificationRecord | null>()

  return deletedNotification
}

export async function clearNotificationsByUser(userId: string) {
  const result = await Notification.deleteMany({ userId })
  return result.deletedCount ?? 0
}
