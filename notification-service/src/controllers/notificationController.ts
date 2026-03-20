import type { NextFunction, Request, Response } from 'express'
import { v4 as uuidv4 } from 'uuid'
import {
  createNotification,
  getNotifications as listNotifications,
} from '../models/notificationModel.js'

export async function storeNotification(req: Request, res: Response, next: NextFunction) {
  try {
    const { message } = req.body as { message: string }

    const newNotification = {
      id: uuidv4(),
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

export async function getNotifications(_req: Request, res: Response, next: NextFunction) {
  try {
    const notifications = await listNotifications()

    return res.status(200).json({ notifications })
  } catch (error) {
    return next(error)
  }
}
