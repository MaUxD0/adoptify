import express from 'express';
import cors from 'cors';
import adoptionsRouter from './modules/adoptions/adoptions.routes';
import { errorHandler } from './middlewares/error.middleware';

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL ?? 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/health', (_req, res) => res.json({ status: 'ok' }));

app.use('/api/adoptions', adoptionsRouter);

app.use(errorHandler);

export default app;