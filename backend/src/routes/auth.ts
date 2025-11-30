import { Router } from 'express';
import { register, login, me } from '../controllers/authController';
import { jwtAuth } from '../middleware/authMiddleware';

export const authRouter = Router();

authRouter.post('/register', register);
authRouter.post('/login', login);
authRouter.get('/me', jwtAuth, me);
