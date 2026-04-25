import type { ErrorRequestHandler } from 'express'

interface MongoLikeError extends Error {
  code?: number
  statusCode?: number
}

const errorHandler: ErrorRequestHandler = (err: MongoLikeError, req, res, _next) => {
  console.error(`[Auth Service] ERROR at ${req.method} ${req.path}:`)
  console.error(`Message: ${err.message}`)
  console.error(`Stack: ${err.stack}`)

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
    message: statusCode === 500 ? `Something went wrong: ${message}` : message,
  })
}

export default errorHandler
