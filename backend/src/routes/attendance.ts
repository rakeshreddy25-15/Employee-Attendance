import { Router } from 'express';
import { jwtAuth } from '../middleware/authMiddleware';
import * as ctrl from '../controllers/attendanceController';

export const attendanceRouter = Router();

// Employee
attendanceRouter.post('/checkin', jwtAuth, ctrl.checkIn);
attendanceRouter.post('/checkout', jwtAuth, ctrl.checkOut);
attendanceRouter.get('/my-history', jwtAuth, ctrl.myHistory);
attendanceRouter.get('/my-summary', jwtAuth, ctrl.mySummary);
attendanceRouter.get('/today', jwtAuth, ctrl.todayStatus);

// Manager
attendanceRouter.get('/all', jwtAuth, ctrl.allAttendance);
attendanceRouter.get('/employee/:id', jwtAuth, ctrl.employeeAttendance);
attendanceRouter.get('/summary', jwtAuth, ctrl.teamSummary);
attendanceRouter.get('/export', jwtAuth, ctrl.exportCSV);
attendanceRouter.get('/today-status', jwtAuth, ctrl.todayStatusAll);
