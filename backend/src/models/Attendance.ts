import { Schema, model, Document, Types } from 'mongoose';

export interface IAttendance extends Document {
  user: Types.ObjectId;
  date: string; // ISO date (yyyy-mm-dd)
  checkIn?: Date;
  checkOut?: Date;
}

const AttendanceSchema = new Schema<IAttendance>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: String, required: true },
  checkIn: { type: Date },
  checkOut: { type: Date },
}, { timestamps: true });

AttendanceSchema.index({ user: 1, date: 1 }, { unique: true });

export const Attendance = model<IAttendance>('Attendance', AttendanceSchema);
