import express from 'express'
import cors from 'cors'
import { errorMiddleware } from './middlewares/error.middleware'
import authRoutes from './modules/auth/auth.routes'

const app = express()

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}))
app.use(express.json())

// Rutas
app.use('/api/auth', authRoutes)

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Error handler (siempre al final)
app.use(errorMiddleware)

export default app