import axios from 'axios'
import type { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { getEnv } from '../config/env.js'
import { saveSummarySnapshot, type ReportSummaryRecord } from '../models/reportModel.js'

interface TaskDto {
  status: 'pending' | 'completed'
}

function createServiceToken() {
  return jwt.sign(
    {
      role: 'service',
      serviceName: 'report-service',
    },
    process.env.JWT_SECRET as string,
    { expiresIn: '1h' },
  )
}

export async function getSummary(_req: Request, res: Response, next: NextFunction) {
  try {
    const token = createServiceToken()
    const { taskServiceUrl } = getEnv()

    const response = await axios.get<{ tasks?: TaskDto[] }>(`${taskServiceUrl}/tasks`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    const tasks = response.data.tasks || []
    const summary: ReportSummaryRecord = {
      total: tasks.length,
      completed: tasks.filter((task) => task.status === 'completed').length,
      pending: tasks.filter((task) => task.status === 'pending').length,
      generatedAt: new Date().toISOString(),
    }

    await saveSummarySnapshot(summary)

    return res.status(200).json(summary)
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      return res.status(error.response.status).json({
        message: 'Failed to fetch tasks from Task Service',
      })
    }

    return next(error)
  }
}
