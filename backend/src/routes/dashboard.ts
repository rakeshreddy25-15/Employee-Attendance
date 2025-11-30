import { Router } from 'express';
import { jwtAuth } from '../middleware/authMiddleware';
import { employeeStats, managerStats } from '../controllers/dashboardController';

const r = Router();

r.get('/employee', jwtAuth, employeeStats);
r.get('/manager', jwtAuth, managerStats);

export default r;
