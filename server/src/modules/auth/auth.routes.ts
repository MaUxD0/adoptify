import { Router } from 'express'
import { authController } from './auth.controller'
import { authMiddleware } from '../../middlewares/auth.middleware'

const router = Router()

router.post('/register', authController.register)
router.get('/me', authMiddleware, authController.getMe)

export default router