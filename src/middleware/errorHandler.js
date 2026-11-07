export class AppError extends Error {
  constructor(message, statusCode = 500, details = null) {
    super(message)
    this.statusCode = statusCode
    this.details = details
    this.isOperational = true
  }
}

export function notFoundHandler(req, res, next) {
  next(new AppError(`Route not found: ${req.method} ${req.originalUrl}`, 404))
}

export function errorHandler(err, req, res, next) {
  void next
  const statusCode = err.statusCode || 500
  const payload = {
    success: false,
    message: err.message || 'Internal server error',
  }

  if (err.details) payload.details = err.details
  if (process.env.NODE_ENV !== 'production' && statusCode === 500) {
    payload.stack = err.stack
  }

  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      details: Object.values(err.errors || {}).map((e) => e.message),
    })
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern || {})[0] || 'field'
    return res.status(409).json({
      success: false,
      message: `Duplicate value for ${field}`,
    })
  }

  if (statusCode >= 500) {
    console.error('[error]', err)
  }

  return res.status(statusCode).json(payload)
}
