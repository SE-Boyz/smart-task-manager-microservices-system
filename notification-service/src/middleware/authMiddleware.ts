import type { RequestHandler } from 'express'
import jwt from 'jsonwebtoken'
import { getEnv } from '../config/env.js'
import type { AuthenticatedRequest, AuthTokenPayload } from '../types/auth.js'

const authMiddleware: RequestHandler = (req, res, next) => {
  const authHeader = req.headers.authorization
  console.log('[Notification Service] Auth Middleware: Received request to:', req.path)

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.warn('[Notification Service] Auth Middleware: Missing or invalid Authorization header format')
    return res.status(401).json({ message: 'Authorization token is required' })
  }

  const token = authHeader.split(' ')[1]
  console.log('[Notification Service] Auth Middleware: Extracting token...')

  try {
    const { jwtPublicKey } = getEnv()

    const decoded = jwt.verify(token, jwtPublicKey, {
      algorithms: ['RS256'],
    }) as AuthTokenPayload

      ; (req as AuthenticatedRequest).user = decoded
    console.log('[Notification Service] Auth Middleware: Token verified successfully for user:')
    return next()
  } catch (error) {
    console.error('[Notification Service] Auth Middleware: JWT Verification Failed:', error instanceof Error ? error.message : error)
    return res.status(401).json({ message: 'Invalid or expired token' })
  }
}

export default authMiddleware
