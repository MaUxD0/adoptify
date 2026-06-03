import type { Response, NextFunction } from 'express'
import type { AuthRequest } from './auth.middleware'

export const requireRole = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      res.status(401).json({ success: false, error: 'No autenticado' })
      return
    }

    const userRole = req.user.role.toUpperCase()
    const allowedRoles = roles.map((role) => role.toUpperCase())

    if (!allowedRoles.includes(userRole)) {
      res.status(403).json({
        success: false,
        error: 'No tienes permiso para esta acción',
      })
      return
    }

    next()
  }
}
