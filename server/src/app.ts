import express from 'express'
import cors from 'cors'
import jwt from 'jsonwebtoken'
import { errorMiddleware } from './middlewares/error.middleware'
import authRoutes from './modules/auth/auth.routes'
import usersRoutes from './modules/users/users.routes'
import petsRoutes from "./modules/pets/pets.routes"
import adoptionsRouter from './modules/adoptions/adoptions.routes'
import chatRouter from './modules/chat/chat.routes'

const app = express();

app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://adoptify-client.vercel.app',
    process.env.CLIENT_URL || '',
  ].filter(Boolean),
  credentials: true,
}))
app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/users', usersRoutes)
app.use('/api/pets', petsRoutes)
app.use('/api/adoptions', adoptionsRouter)
app.use('/api/chat', chatRouter)

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// DEV ONLY — borrar cuando auth esté integrado
app.post('/api/dev/login', (req, res) => {
  const { role = 'ADOPTER' } = req.body;
  const token = jwt.sign(
    { id: '00000000-0000-0000-0000-000000000001', email: 'dev@test.com', role },
    process.env.JWT_SECRET!,
    { expiresIn: '24h' }
  );
  res.json({ token });
});

app.use(errorMiddleware)  

export default app
