import type { Request, Response, NextFunction } from 'express'
import { supabaseAdmin } from '../config/supabase'

export interface AuthRequest extends Request {
  user?: {
    id: string
    email: string
    role: string
    full_name: string
  }
}

export const authMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization

  if (!authHeader?.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Token no proporcionado' })
    return
  }

  const token = authHeader.split(' ')[1]

  try {
    const { data: { user }, error } = await supabaseAdmin.auth.getUser(token)

    if (error || !user) {
      res.status(401).json({ error: 'Token inválido o expirado' })
      return
    }

    req.user = {
      id: user.id,
      email: user.email!,
      role: user.user_metadata?.role ?? 'adopter',
      full_name: user.user_metadata?.full_name ?? '',
    }

    next()
  } catch {
    res.status(401).json({ error: 'Error al verificar token' })
  }
}