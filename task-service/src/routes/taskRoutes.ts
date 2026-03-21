import express from 'express'
import { body, param } from 'express-validator'
import * as taskController from '../controllers/taskController.js'
import authMiddleware from '../middleware/authMiddleware.js'
import validateRequest from '../middleware/validateRequest.js'

const router = express.Router()

/**
 * @swagger
 * /tasks:
 *   get:
 *     summary: Get tasks for the logged-in user
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of tasks
 */
router.get('/tasks', authMiddleware, taskController.getTasks)

/**
 * @swagger
 * /tasks:
 *   post:
 *     summary: Create a task
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - status
 *             properties:
 *               title:
 *                 type: string
 *               status:
 *                 type: string
 *     responses:
 *       201:
 *         description: Task created successfully
 */
router.post(
  '/tasks',
  authMiddleware,
  [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('status')
      .isIn(['pending', 'completed'])
      .withMessage('Status must be either pending or completed'),
  ],
  validateRequest,
  taskController.createTask,
)

/**
 * @swagger
 * /tasks/{id}:
 *   put:
 *     summary: Update a task
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - status
 *             properties:
 *               title:
 *                 type: string
 *               status:
 *                 type: string
 *     responses:
 *       200:
 *         description: Task updated successfully
 */
router.put(
  '/tasks/:id',
  authMiddleware,
  [
    param('id').notEmpty().withMessage('Task ID is required'),
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('status')
      .isIn(['pending', 'completed'])
      .withMessage('Status must be either pending or completed'),
  ],
  validateRequest,
  taskController.updateTask,
)

/**
 * @swagger
 * /tasks/{id}:
 *   delete:
 *     summary: Delete a task
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Task deleted successfully
 */
router.delete(
  '/tasks/:id',
  authMiddleware,
  [param('id').notEmpty().withMessage('Task ID is required')],
  validateRequest,
  taskController.deleteTask,
)

export default router
