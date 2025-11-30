import { Request, Response } from 'express';
import { Attendance } from '../models/Attendance';
import { User } from '../models/User';
import { Types } from 'mongoose';

function todayDateString() {
  const d = new Date();
  return d.toISOString().slice(0, 10);
}

export async function checkIn(req: Request, res: Response) {
  const anyReq = req as any;
  const userId = anyReq.user?.id;
  if (!userId) return res.status(401).json({ message: 'Unauthorized' });

  const date = todayDateString();
  const existing = await Attendance.findOne({ user: userId, date }).exec();
  if (existing && existing.checkIn) return res.status(400).json({ message: 'Already checked in' });

  if (existing) {
    existing.checkIn = new Date();
    await existing.save();
    return res.json(existing);
  }

  const att = new Attendance({ user: userId, date, checkIn: new Date() });
  await att.save();
  res.status(201).json(att);
}

export async function checkOut(req: Request, res: Response) {
  const anyReq = req as any;
  const userId = anyReq.user?.id;
  if (!userId) return res.status(401).json({ message: 'Unauthorized' });

  const date = todayDateString();
  const existing = await Attendance.findOne({ user: userId, date }).exec();
  if (!existing || !existing.checkIn) return res.status(400).json({ message: 'Not checked in' });
  if (existing.checkOut) return res.status(400).json({ message: 'Already checked out' });

  existing.checkOut = new Date();
  await existing.save();
  res.json(existing);
}

export async function myHistory(req: Request, res: Response) {
  const anyReq = req as any;
  const userId = anyReq.user?.id;
  if (!userId) return res.status(401).json({ message: 'Unauthorized' });

  const records = await Attendance.find({ user: userId }).sort({ date: -1 }).limit(200).exec();
  res.json(records);
}

export async function mySummary(req: Request, res: Response) {
  // simple monthly summary: count of days present in given month
  const anyReq = req as any;
  const userId = anyReq.user?.id;
  if (!userId) return res.status(401).json({ message: 'Unauthorized' });
  const month = req.query.month as string | undefined; // format YYYY-MM
  const m = month || (new Date().toISOString().slice(0,7));

  const regex = new RegExp('^' + m);
  const count = await Attendance.countDocuments({ user: userId, date: { $regex: regex } }).exec();
  res.json({ month: m, daysPresent: count });
}

export async function todayStatus(req: Request, res: Response) {
  const anyReq = req as any;
  const userId = anyReq.user?.id;
  if (!userId) return res.status(401).json({ message: 'Unauthorized' });
  const date = todayDateString();
  const record = await Attendance.findOne({ user: userId, date }).exec();
  res.json({ date, status: record ? (record.checkIn ? (record.checkOut ? 'checked-out' : 'checked-in') : 'none') : 'none', record });
}

// Manager endpoints
export async function allAttendance(req: Request, res: Response) {
  const list = await Attendance.find().populate('user', 'username role').sort({ date: -1 }).limit(1000).exec();
  res.json(list);
}

export async function employeeAttendance(req: Request, res: Response) {
  const { id } = req.params;
  if (!Types.ObjectId.isValid(id)) return res.status(400).json({ message: 'invalid id' });
  const list = await Attendance.find({ user: id }).sort({ date: -1 }).exec();
  res.json(list);
}

export async function teamSummary(req: Request, res: Response) {
  // simple aggregation: count present today by role
  const date = todayDateString();
  const present = await Attendance.find({ date }).populate('user', 'username role').exec();
  const byRole: Record<string, number> = {};
  present.forEach(p => {
    const r = (p as any).user?.role || 'unknown';
    byRole[r] = (byRole[r] || 0) + 1;
  });
  res.json({ date, presentCount: present.length, byRole });
}

export async function exportCSV(req: Request, res: Response) {
  const rows = await Attendance.find().populate('user', 'username email').limit(5000).exec();
  const header = 'username,email,date,checkIn,checkOut\n';
  const lines = rows.map(r => `${(r as any).user?.username || ''},${(r as any).user?.email || ''},${r.date},${r.checkIn?.toISOString() || ''},${r.checkOut?.toISOString() || ''}`);
  const csv = header + lines.join('\n');
  res.header('Content-Type', 'text/csv');
  res.attachment('attendance.csv');
  res.send(csv);
}

export async function todayStatusAll(req: Request, res: Response) {
  const date = todayDateString();
  const present = await Attendance.find({ date }).populate('user', 'username role').exec();
  res.json(present.map(p => ({ username: (p as any).user?.username, role: (p as any).user?.role, checkIn: p.checkIn, checkOut: p.checkOut })));
}
