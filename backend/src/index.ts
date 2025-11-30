import express from 'express';
import dotenv from 'dotenv';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import { router as apiRouter } from './routes';
import { logger } from './logger';
import { connectDB } from './db';

dotenv.config();

const app = express();
const PORT = process.env.PORT ? Number(process.env.PORT) : 4000;

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:8080';

app.use(helmet());
app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true,
  })
);
app.use(express.json());
app.use(morgan('dev'));

app.use('/api', apiRouter);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Not Found' });
});

// error handler
app.use((err: any, req: express.Request, res: express.Response, _next: any) => {
  logger.error(err?.message || 'Unknown error');
  res.status(err?.status || 500).json({ message: err?.message || 'Internal Server Error' });
});

async function start() {
  const mongo = process.env.MONGO_URI || '';
  if (!mongo) {
    logger.error('MONGO_URI not set in .env');
    process.exit(1);
  }
  await connectDB(mongo);
  app.listen(PORT, () => {
    logger.info(`Server listening on port ${PORT}`);
  });
}

start();
