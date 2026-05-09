import express from 'express'
import cors from 'cors'
import { errorMiddleware } from './middlewares/error.middleware'
import authRoutes from './modules/auth/auth.routes'
import usersRoutes from './modules/users/users.routes'
import petsRoutes from "./modules/pets/pets.routes"
import adoptionsRouter from './modules/adoptions/adoptions.routes'

const app = express();

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}))
app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/users', usersRoutes)
app.use('/api/pets', petsRoutes)
app.use('/api/adoptions', adoptionsRouter)

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

app.use(errorMiddleware)  

export default app
