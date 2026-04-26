import express from 'express'
import * as auditController from '../controllers/auditController.js'
import authMiddleware from '../middleware/authMiddleware.js'

const router = express.Router()

/**
 * @swagger
 * /audit-logs:
 *   get:
 *     summary: Get the authenticated user's audit logs
 *     tags: [Audit]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Audit log list
 */
router.get('/audit-logs', authMiddleware, auditController.getAuditLogs)


export default router
