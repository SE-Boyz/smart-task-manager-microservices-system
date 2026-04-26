import type { NextFunction, Request, Response } from 'express'
import { getAuditLogsByUser } from '../models/auditLogModel.js'
import type { AuthenticatedRequest } from '../types/auth.js'

export async function getAuditLogs(req: Request, res: Response, next: NextFunction) {
  try {
    const authenticatedRequest = req as AuthenticatedRequest
    const auditLogs = await getAuditLogsByUser(authenticatedRequest.user.id)

    return res.status(200).json({ auditLogs })
  } catch (error) {
    return next(error)
  }
}
