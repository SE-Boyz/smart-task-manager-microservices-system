import type { ErrorRequestHandler } from 'express'

interface MongoLikeError extends Error {
  code?: number
  statusCode?: number
}

const errorHandler: ErrorRequestHandler = (err: MongoLikeError, _req, res, _next) => {
  console.error(err)

  if (err.code === 11000) {
    return res.status(409).json({
      message: 'Resource already exists',
    })
  }

  if (err.name === 'MongoServerSelectionError') {
    return res.status(503).json({
      message: 'Database is unavailable',
    })
  }

  const statusCode = err.statusCode || 500
  const message = err.message || 'Internal server error'

  return res.status(statusCode).json({
    message: statusCode === 500 ? 'Something went wrong' : message,
  })
}

export default errorHandler
