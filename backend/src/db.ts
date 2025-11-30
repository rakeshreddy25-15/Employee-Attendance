import mongoose from 'mongoose';
import { logger } from './logger';

export async function connectDB(uri: string) {
  try {
    await mongoose.connect(uri);
    logger.info('Connected to MongoDB');
  } catch (err) {
    logger.error('MongoDB connection error: ' + (err as Error).message);
    process.exit(1);
  }
}
