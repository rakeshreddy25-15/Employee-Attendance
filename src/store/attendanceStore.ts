import { create } from 'zustand';

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

// Mock data generator
const generateMockAttendance = (employeeId: string, employeeName: string, daysAgo: number): AttendanceRecord => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  const dateStr = date.toISOString().split('T')[0];
  
  const statuses: AttendanceStatus[] = ['present', 'present', 'present', 'late', 'absent', 'half-day'];
  const status = statuses[Math.floor(Math.random() * statuses.length)];
  
  let checkIn = null;
  let checkOut = null;
  let totalHours = 0;
  
  if (status === 'present') {
    checkIn = '09:00';
    checkOut = '18:00';
    totalHours = 9;
  } else if (status === 'late') {
    checkIn = '09:30';
    checkOut = '18:00';
    totalHours = 8.5;
  } else if (status === 'half-day') {
    checkIn = '09:00';
    checkOut = '13:00';
    totalHours = 4;
  }
  
  return {
    id: `att-${employeeId}-${dateStr}`,
    employeeId,
    employeeName,
    date: dateStr,
    checkIn,
    checkOut,
    status,
    totalHours,
  };
};

export const useAttendanceStore = create<AttendanceState>((set, get) => ({
  todayStatus: null,
  summary: null,
  history: [],
  allEmployeesAttendance: [],
  loading: false,
  
  fetchTodayStatus: async () => {
    set({ loading: true });
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const today = new Date().toISOString().split('T')[0];
    const mockRecord: AttendanceRecord = {
      id: 'today-001',
      employeeId: 'emp-001',
      employeeName: 'John Employee',
      date: today,
      checkIn: '09:00',
      checkOut: null,
      status: 'present',
      totalHours: 0,
    };
    
    set({ todayStatus: mockRecord, loading: false });
  },
  
  fetchSummary: async (month: number, year: number) => {
    set({ loading: true });
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const mockSummary: AttendanceSummary = {
      totalPresent: 18,
      totalAbsent: 2,
      totalLate: 3,
      totalHalfDay: 1,
      totalHoursWorked: 162,
    };
    
    set({ summary: mockSummary, loading: false });
  },
  
  fetchHistory: async (startDate: string, endDate: string) => {
    set({ loading: true });
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const mockHistory: AttendanceRecord[] = Array.from({ length: 30 }, (_, i) => 
      generateMockAttendance('emp-001', 'John Employee', i)
    );
    
    set({ history: mockHistory, loading: false });
  },
  
  checkIn: async () => {
    set({ loading: true });
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const now = new Date();
    const time = now.toTimeString().slice(0, 5);
    const today = now.toISOString().split('T')[0];
    
    const status: AttendanceStatus = time > '09:15' ? 'late' : 'present';
    
    const newRecord: AttendanceRecord = {
      id: 'today-' + Date.now(),
      employeeId: 'emp-001',
      employeeName: 'John Employee',
      date: today,
      checkIn: time,
      checkOut: null,
      status,
      totalHours: 0,
    };
    
    set({ todayStatus: newRecord, loading: false });
  },
  
  checkOut: async () => {
    set({ loading: true });
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const current = get().todayStatus;
    if (current) {
      const now = new Date();
      const checkOutTime = now.toTimeString().slice(0, 5);
      
      // Calculate hours
      const checkInParts = current.checkIn!.split(':');
      const checkOutParts = checkOutTime.split(':');
      const checkInMinutes = parseInt(checkInParts[0]) * 60 + parseInt(checkInParts[1]);
      const checkOutMinutes = parseInt(checkOutParts[0]) * 60 + parseInt(checkOutParts[1]);
      const totalHours = Math.round((checkOutMinutes - checkInMinutes) / 60 * 10) / 10;
      
      const updated: AttendanceRecord = {
        ...current,
        checkOut: checkOutTime,
        totalHours,
      };
      
      set({ todayStatus: updated, loading: false });
    }
  },
  
  fetchAllEmployeesAttendance: async (date?: string) => {
    set({ loading: true });
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const employees = [
      { id: 'emp-001', name: 'John Employee' },
      { id: 'emp-002', name: 'Sarah Smith' },
      { id: 'emp-003', name: 'Mike Johnson' },
      { id: 'emp-004', name: 'Emily Davis' },
      { id: 'emp-005', name: 'David Wilson' },
      { id: 'emp-006', name: 'Lisa Anderson' },
      { id: 'emp-007', name: 'Tom Brown' },
      { id: 'emp-008', name: 'Anna Garcia' },
    ];
    
    const mockData: AttendanceRecord[] = employees.map((emp, i) => 
      generateMockAttendance(emp.id, emp.name, 0)
    );
    
    set({ allEmployeesAttendance: mockData, loading: false });
  },
}));
