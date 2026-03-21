import type { NextFunction, Request, Response } from 'express'
import { getSummarySnapshot } from '../models/reportModel.js'

export async function getSummary(_req: Request, res: Response, next: NextFunction) {
  try {
    const summary = await getSummarySnapshot()

    return res.status(200).json(summary)
  } catch (error) {
    return next(error)
  }
}
