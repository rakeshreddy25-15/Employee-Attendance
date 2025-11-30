import { Schema, model, Document } from 'mongoose';

export interface IUser extends Document {
  username: string;
  email?: string;
  password: string;
  role: 'employee' | 'manager';
}

const UserSchema = new Schema<IUser>({
  username: { type: String, required: true, unique: true },
  email: { type: String },
  password: { type: String, required: true },
  role: { type: String, enum: ['employee', 'manager'], default: 'employee' },
}, { timestamps: true });

export const User = model<IUser>('User', UserSchema);
