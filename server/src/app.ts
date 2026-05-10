import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import adoptionsRouter from './modules/adoptions/adoptions.routes';
const chatRouter = require('./modules/chat/chat.routes').default;
import { errorHandler } from './middlewares/error.middleware';

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL ?? 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/health', (_req, res) => res.json({ status: 'ok' }));

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

app.use('/api/adoptions', adoptionsRouter);
app.use('/api/chat', chatRouter);

app.use(errorHandler);

export default app;