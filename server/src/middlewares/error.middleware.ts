import type { Request, Response, NextFunction } from 'express'

export class AppError extends Error {
  constructor(
    message: string,
    public statusCode = 500,
  ) {
    super(message)
    this.name = 'AppError'
  }
}

export const errorMiddleware = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  const statusCode = err instanceof AppError ? err.statusCode : 500
  const message = err.message || 'Error interno del servidor'

  if (statusCode >= 500) {
    console.error('[ERROR]', err)
  }

  res.status(statusCode).json({
    success: false,
    error: message,
  })
}
