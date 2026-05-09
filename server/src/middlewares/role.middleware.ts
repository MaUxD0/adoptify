import type { Response, NextFunction } from 'express'
import type { AuthRequest } from './auth.middleware'

export const requireRole = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      res.status(401).json({ error: 'No autenticado' })
      return
    }
    if (!roles.includes(req.user.role)) {
      res.status(403).json({ error: 'No tienes permiso para esta acción' })
      return
    }
    next()
  }
}