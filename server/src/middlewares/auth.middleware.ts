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
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization

  if (!authHeader?.startsWith('Bearer ')) {
    res.status(401).json({ success: false, error: 'Token no proporcionado' })
    return
  }

  const token = authHeader.split(' ')[1]

  try {
    const {
      data: { user },
      error,
    } = await supabaseAdmin.auth.getUser(token)

    if (error || !user) {
      res.status(401).json({ success: false, error: 'Token inválido o expirado' })
      return
    }

    const role = (user.user_metadata?.role as string | undefined)?.toUpperCase() ?? 'ADOPTER'

    const { data: existingUser } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('id', user.id)
      .maybeSingle()

    if (!existingUser) {
      const { error: insertError } = await supabaseAdmin.from('users').insert({
        id: user.id,
        name: (user.user_metadata?.full_name as string | undefined) ?? 'Usuario',
        email: user.email,
        role,
      })

      if (insertError) {
        console.error('[auth] No se pudo crear fila en users:', insertError.message)
      }
    }

    req.user = {
      id: user.id,
      email: user.email ?? '',
      role,
      full_name: (user.user_metadata?.full_name as string | undefined) ?? '',
    }

    next()
  } catch {
    res.status(401).json({ success: false, error: 'Error al verificar token' })
  }
}
