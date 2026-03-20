import express from 'express'
import * as reportController from '../controllers/reportController.js'

const router = express.Router()

/**
 * @swagger
 * /summary:
 *   get:
 *     summary: Get task summary statistics
 *     tags: [Reports]
 *     responses:
 *       200:
 *         description: Task summary
 */
router.get('/summary', reportController.getSummary)

export default router
