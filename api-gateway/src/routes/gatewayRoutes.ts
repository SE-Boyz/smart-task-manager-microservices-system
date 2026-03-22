import express from 'express'
import { proxyRequest } from '../controllers/gatewayController.js'

const router = express.Router()

router.all(
  [
    '/auth',
    '/auth/*',
    '/tasks',
    '/tasks/*',
    '/notifications',
    '/notifications/*',
    '/reports',
    '/reports/*',
    '/audit-logs',
    '/audit-logs/*',
  ],
  proxyRequest,
)

export default router
