import type { Request, Response } from 'express'
import { authService } from './auth.service'

export const authController = {
  async getMe(req: Request, res: Response) {
    try {
      // El user viene del middleware de autenticación
      const user = (req as Request & { user?: unknown }).user
      res.json({ user })
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : 'Error interno'
      res.status(500).json({ error: msg })
    }
  },

  async register(req: Request, res: Response) {
    try {
      const user = await authService.register(req.body)
      res.status(201).json({ user, message: 'Usuario creado exitosamente' })
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : 'Error al registrar'
      res.status(400).json({ error: msg })
    }
  },
}