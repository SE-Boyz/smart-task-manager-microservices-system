import type { RequestHandler } from 'express'
import jwt from 'jsonwebtoken'
import { getEnv } from '../config/env.js'
import type { AuthenticatedRequest, AuthTokenPayload } from '../types/auth.js'

const authMiddleware: RequestHandler = (req, res, next) => {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authorization token is required' })
  }

  const token = authHeader.split(' ')[1]

  try {
    const { jwtPublicKey } = getEnv()

    ;(req as AuthenticatedRequest).user = jwt.verify(token, jwtPublicKey, {
      algorithms: ['RS256'],
    }) as AuthTokenPayload
    return next()
  } catch {
    return res.status(401).json({ message: 'Invalid or expired token' })
  }
}

export default authMiddleware
