import type { NextFunction, Request, Response } from 'express'
import { v4 as uuidv4 } from 'uuid'
import {
  createNotification,
  clearNotificationsByUser,
  deleteNotificationById,
  getNotificationsByUser,
} from '../models/notificationModel.js'
import type { AuthenticatedRequest } from '../types/auth.js'

export async function storeNotification(req: Request, res: Response, next: NextFunction) {
  try {
    const { message, userId } = req.body as { message: string; userId: string }

    const newNotification = {
      id: uuidv4(),
      userId,
      message,
      createdAt: new Date().toISOString(),
    }

    await createNotification(newNotification)

    return res.status(201).json({
      message: 'Notification stored successfully',
      notification: newNotification,
    })
  } catch (error) {
    return next(error)
  }
}

export async function getNotifications(req: Request, res: Response, next: NextFunction) {
  try {
    const authenticatedRequest = req as AuthenticatedRequest
    const notifications = await getNotificationsByUser(authenticatedRequest.user.id)

    return res.status(200).json({ notifications })
  } catch (error) {
    return next(error)
  }
}

export async function deleteNotification(req: Request, res: Response, next: NextFunction) {
  try {
    const authenticatedRequest = req as AuthenticatedRequest
    const id = String(req.params.id)
    const deletedNotification = await deleteNotificationById(id, authenticatedRequest.user.id)

    if (!deletedNotification) {
      return res.status(404).json({ message: 'Notification not found' })
    }

    return res.status(200).json({
      message: 'Notification deleted successfully',
      notification: deletedNotification,
    })
  } catch (error) {
    return next(error)
  }
}

export async function clearNotifications(req: Request, res: Response, next: NextFunction) {
  try {
    const authenticatedRequest = req as AuthenticatedRequest
    const deletedCount = await clearNotificationsByUser(authenticatedRequest.user.id)

    return res.status(200).json({
      message: deletedCount > 0 ? 'Notifications cleared successfully' : 'No notifications to clear',
      deletedCount,
    })
  } catch (error) {
    return next(error)
  }
}
