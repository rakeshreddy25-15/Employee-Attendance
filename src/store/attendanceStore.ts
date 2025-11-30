import { create } from 'zustand';
import { apiFetch, getAuthHeaders } from '@/lib/api';

export type AttendanceStatus = 'present' | 'absent' | 'late' | 'half-day';

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  date: string;
  checkIn: string | null;
  checkOut: string | null;
  status: AttendanceStatus;
  totalHours: number;
  notes?: string;
}

export interface AttendanceSummary {
  totalPresent: number;
  totalAbsent: number;
  totalLate: number;
  totalHalfDay: number;
  totalHoursWorked: number;
}

interface AttendanceState {
  todayStatus: AttendanceRecord | null;
  summary: AttendanceSummary | null;
  history: AttendanceRecord[];
  allEmployeesAttendance: AttendanceRecord[];
  loading: boolean;
  
  fetchTodayStatus: () => Promise<void>;
  fetchSummary: (month: number, year: number) => Promise<void>;
  fetchHistory: (startDate: string, endDate: string) => Promise<void>;
  checkIn: () => Promise<void>;
  checkOut: () => Promise<void>;
  fetchAllEmployeesAttendance: (date?: string) => Promise<void>;
}

// Note: removed pre-built/mock attendance data. Store now uses real API calls.

export const useAttendanceStore = create<AttendanceState>((set, get) => ({
  todayStatus: null,
  summary: null,
  history: [],
  allEmployeesAttendance: [],
  loading: false,
  
  fetchTodayStatus: async () => {
    set({ loading: true });
    try {
      const data = await apiFetch('/attendance/today', { headers: getAuthHeaders() });
      set({ todayStatus: data || null, loading: false });
    } catch (err) {
      // On error, clear state but keep app running
      set({ todayStatus: null, loading: false });
    }
  },
  
  fetchSummary: async (month: number, year: number) => {
    set({ loading: true });
    try {
      const monthStr = String(month).padStart(2, '0');
      // expected format: YYYY-MM
      const data = await apiFetch(`/attendance/my-summary?month=${year}-${monthStr}`, { headers: getAuthHeaders() });
      set({ summary: data || null, loading: false });
    } catch (err) {
      set({ summary: null, loading: false });
    }
  },
  
  fetchHistory: async (startDate: string, endDate: string) => {
    set({ loading: true });
    try {
      const qs = `?start=${encodeURIComponent(startDate)}&end=${encodeURIComponent(endDate)}`;
      const data = await apiFetch(`/attendance/my-history${qs}`, { headers: getAuthHeaders() });
      set({ history: Array.isArray(data) ? data : [], loading: false });
    } catch (err) {
      set({ history: [], loading: false });
    }
  },
  
  checkIn: async () => {
    set({ loading: true });
    try {
      const data = await apiFetch('/attendance/checkin', { method: 'POST', headers: getAuthHeaders() });
      set({ todayStatus: data || null, loading: false });
    } catch (err) {
      set({ loading: false });
      throw err;
    }
  },
  
  checkOut: async () => {
    set({ loading: true });
    try {
      const data = await apiFetch('/attendance/checkout', { method: 'POST', headers: getAuthHeaders() });
      set({ todayStatus: data || null, loading: false });
    } catch (err) {
      set({ loading: false });
      throw err;
    }
  },
  
  fetchAllEmployeesAttendance: async (date?: string) => {
    set({ loading: true });
    try {
      const qs = date ? `?date=${encodeURIComponent(date)}` : '';
      const data = await apiFetch(`/attendance/all${qs}`, { headers: getAuthHeaders() });
      set({ allEmployeesAttendance: Array.isArray(data) ? data : [], loading: false });
    } catch (err) {
      set({ allEmployeesAttendance: [], loading: false });
    }
  },
}));
