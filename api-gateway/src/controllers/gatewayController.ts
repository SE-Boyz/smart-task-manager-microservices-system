import axios from 'axios'
import type { NextFunction, Request, Response } from 'express'
import { getEnv } from '../config/env.js'

const HOP_BY_HOP_RESPONSE_HEADERS = new Set([
  'connection',
  'content-length',
  'transfer-encoding',
])

interface TargetResolution {
  baseUrl: string
  path: string
}

function resolveTarget(path: string): TargetResolution | null {
  const {
    authServiceUrl,
    taskServiceUrl,
    notificationServiceUrl,
    reportServiceUrl,
    auditServiceUrl,
  } = getEnv()

  if (path === '/auth' || path.startsWith('/auth/')) {
    return {
      baseUrl: authServiceUrl,
      path: path.replace(/^\/auth/, '') || '/',
    }
  }

  if (path === '/tasks' || path.startsWith('/tasks/')) {
    return {
      baseUrl: taskServiceUrl,
      path,
    }
  }

  if (path === '/notifications' || path.startsWith('/notifications/')) {
    return {
      baseUrl: notificationServiceUrl,
      path,
    }
  }

  if (path === '/reports' || path.startsWith('/reports/')) {
    return {
      baseUrl: reportServiceUrl,
      path: path.replace(/^\/reports/, '') || '/',
    }
  }

  if (path === '/audit-logs' || path.startsWith('/audit-logs/')) {
    return {
      baseUrl: auditServiceUrl,
      path: path.replace(/^\/audit-logs/, '') || '/',
    }
  }

  return null
}

export async function proxyRequest(req: Request, res: Response, next: NextFunction) {
  const target = resolveTarget(req.path)

  if (!target) {
    return res.status(404).json({
      message: 'No downstream service mapping found for this route.',
    })
  }

  try {
    console.log(`[Gateway] Proxying to: ${target.baseUrl}${target.path}`)
    const response = await axios({
      method: req.method,
      url: `${target.baseUrl}${target.path}`,
      params: req.query,
      data: ['GET', 'HEAD'].includes(req.method) ? undefined : req.body,
      headers: {
        authorization: req.headers.authorization,
        'content-type': req.headers['content-type'],
      },
      validateStatus: () => true,
    })
    console.log(`[Gateway] Downstream response: ${response.status}`)

    Object.entries(response.headers).forEach(([header, value]) => {
      if (!HOP_BY_HOP_RESPONSE_HEADERS.has(header.toLowerCase()) && value !== undefined) {
        res.setHeader(header, value as string)
      }
    })

    return res.status(response.status).send(response.data)
  } catch (error: unknown) {
    if (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      error.code === 'ECONNREFUSED'
    ) {
      return res.status(503).json({
        message: 'Downstream service is unavailable.',
      })
    }

    return next(error)
  }
}
