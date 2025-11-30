import { Router } from 'express';

export const healthRouter = Router();

healthRouter.get('/', (_, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});
