import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';

const SALT_ROUNDS = 10;

export async function register(req: Request, res: Response) {
  const { username, password, role, email } = req.body as { username: string; password: string; role?: 'employee'|'manager'; email?: string };
  if (!username || !password) return res.status(400).json({ message: 'username and password required' });

  const existing = await User.findOne({ username }).exec();
  if (existing) return res.status(409).json({ message: 'username already exists' });

  const hashed = await bcrypt.hash(password, SALT_ROUNDS);
  const user = new User({ username, password: hashed, role: role || 'employee', email });
  await user.save();
  res.status(201).json({ id: user._id, username: user.username, role: user.role });
}

export async function login(req: Request, res: Response) {
  const { username, password } = req.body as { username: string; password: string };
  if (!username || !password) return res.status(400).json({ message: 'username and password required' });

  const user = await User.findOne({ username }).exec();
  if (!user) return res.status(401).json({ message: 'invalid credentials' });

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return res.status(401).json({ message: 'invalid credentials' });

  const secret = process.env.JWT_SECRET || '';
  if (!secret) return res.status(500).json({ message: 'JWT secret not configured' });

  const token = jwt.sign({ id: user._id, username: user.username, role: user.role }, secret, { expiresIn: '8h' });
  res.json({ token });
}

export async function me(req: Request, res: Response) {
  // jwtAuth sets req.user
  const anyReq = req as any;
  const payload = anyReq.user;
  if (!payload) return res.status(401).json({ message: 'Unauthorized' });
  const user = await User.findById(payload.id).select('-password').exec();
  res.json(user);
}
