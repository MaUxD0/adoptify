import type { Response } from 'express'
import type { AuthRequest } from '../../middlewares/auth.middleware'
import { usersService } from './users.service'

export const usersController = {
  async getMyProfile(req: AuthRequest, res: Response) {
    try {
      const profile = await usersService.getProfile(req.user!.id)
      res.json({ profile })
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : 'Error interno'
      res.status(404).json({ error: msg })
    }
  },

  async updateMyProfile(req: AuthRequest, res: Response) {
    try {
      const updated = await usersService.updateProfile(req.user!.id, req.body)
      res.json({ profile: updated, message: 'Perfil actualizado' })
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : 'Error interno'
      res.status(400).json({ error: msg })
    }
  },
}