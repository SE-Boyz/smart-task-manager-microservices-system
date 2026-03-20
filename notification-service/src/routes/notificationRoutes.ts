import express from 'express'
import { body } from 'express-validator'
import * as notificationController from '../controllers/notificationController.js'
import validateRequest from '../middleware/validateRequest.js'

const router = express.Router()

/**
 * @swagger
 * /notify:
 *   post:
 *     summary: Store a notification log
 *     tags: [Notifications]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - message
 *             properties:
 *               message:
 *                 type: string
 *     responses:
 *       201:
 *         description: Notification stored successfully
 */
router.post(
  '/notify',
  [body('message').trim().notEmpty().withMessage('Message is required')],
  validateRequest,
  notificationController.storeNotification,
)

/**
 * @swagger
 * /notifications:
 *   get:
 *     summary: Get all notifications
 *     tags: [Notifications]
 *     responses:
 *       200:
 *         description: List of notifications
 */
router.get('/notifications', notificationController.getNotifications)

export default router
