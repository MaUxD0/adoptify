import { Router } from 'express'
import { usersController } from './users.controller'
import { authMiddleware } from '../../middlewares/auth.middleware'

const router = Router()

router.use(authMiddleware) 

router.get('/profile', usersController.getMyProfile)
router.patch('/profile', usersController.updateMyProfile)
router.post('/profile/image', usersController.uploadProfileImage)

export default router
