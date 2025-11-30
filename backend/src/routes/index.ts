import { Router } from 'express';
import { healthRouter } from './health';
import { authRouter } from './auth';
import { attendanceRouter } from './attendance';
import { Router as Dummy } from 'express';
import dashboardRoutes from './dashboard';

export const router = Router();

router.use('/health', healthRouter);
router.use('/auth', authRouter);
router.use('/attendance', attendanceRouter);
router.use('/dashboard', dashboardRoutes);
