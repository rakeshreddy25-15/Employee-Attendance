import { Request, Response } from 'express';
import { Attendance } from '../models/Attendance';

export async function employeeStats(req: Request, res: Response) {
  const anyReq = req as any;
  const userId = anyReq.user?.id;
  if (!userId) return res.status(401).json({ message: 'Unauthorized' });
  const total = await Attendance.countDocuments({ user: userId }).exec();
  res.json({ totalDaysRecorded: total });
}

export async function managerStats(req: Request, res: Response) {
  const totalToday = await Attendance.countDocuments({ date: new Date().toISOString().slice(0,10) }).exec();
  res.json({ totalCheckedInToday: totalToday });
}
