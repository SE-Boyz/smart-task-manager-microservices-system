import express from 'express'
import { body } from 'express-validator'
import * as notificationController from '../controllers/notificationController.js'
import authMiddleware from '../middleware/authMiddleware.js'
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
  [
    body('message').trim().notEmpty().withMessage('Message is required'),
    body('userId').trim().notEmpty().withMessage('User ID is required'),
  ],
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
router.get('/notifications', authMiddleware, notificationController.getNotifications)

/**
 * @swagger
 * /notifications/{id}:
 *   delete:
 *     summary: Delete a notification
 *     tags: [Notifications]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Notification deleted successfully
 *       404:
 *         description: Notification not found
 */
router.delete('/notifications/:id', authMiddleware, notificationController.deleteNotification)

/**
 * @swagger
 * /notifications:
 *   delete:
 *     summary: Clear all notifications for the authenticated user
 *     tags: [Notifications]
 *     responses:
 *       200:
 *         description: Notifications cleared successfully
 */
router.delete('/notifications', authMiddleware, notificationController.clearNotifications)

export default router
