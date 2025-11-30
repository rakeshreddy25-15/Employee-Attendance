import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAttendanceStore, AttendanceStatus } from '@/store/attendanceStore';
import { Calendar as CalendarIcon, Users } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const TeamCalendarGrid = ({ history }: { history: any[] }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startingDayOfWeek = firstDay.getDay();
  
  const getStatsForDate = (day: number) => {
    const dateStr = new Date(year, month, day).toISOString().split('T')[0];
    const dayRecords = history.filter((h) => h.date === dateStr);
    
    const present = dayRecords.filter((r) => r.status === 'present').length;
    const late = dayRecords.filter((r) => r.status === 'late').length;
    const absent = dayRecords.filter((r) => r.status === 'absent').length;
    const halfDay = dayRecords.filter((r) => r.status === 'half-day').length;
    
    return { present, late, absent, halfDay, total: dayRecords.length };
  };
  
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const blanks = Array.from({ length: startingDayOfWeek }, (_, i) => i);
  
  const changeMonth = (delta: number) => {
    setCurrentDate(new Date(year, month + delta, 1));
  };
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">
          {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </h3>
        <div className="flex gap-2">
          <button
            onClick={() => changeMonth(-1)}
            className="px-3 py-1 rounded-lg hover:bg-muted transition-colors"
          >
            ‹
          </button>
          <button
            onClick={() => changeMonth(1)}
            className="px-3 py-1 rounded-lg hover:bg-muted transition-colors"
          >
            ›
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-7 gap-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div key={day} className="text-center text-sm font-medium text-muted-foreground p-2">
            {day}
          </div>
        ))}
        
        {blanks.map((blank) => (
          <div key={`blank-${blank}`} className="aspect-square" />
        ))}
        
        {days.map((day) => {
          const stats = getStatsForDate(day);
          const isToday =
            day === new Date().getDate() &&
            month === new Date().getMonth() &&
            year === new Date().getFullYear();
          
          const attendanceRate = stats.total > 0 
            ? ((stats.present + stats.late) / stats.total) * 100 
            : 0;
          
          let bgColor = 'bg-muted/50';
          if (attendanceRate >= 90) bgColor = 'bg-success/20';
          else if (attendanceRate >= 70) bgColor = 'bg-warning/20';
          else if (attendanceRate > 0) bgColor = 'bg-destructive/20';
          
          return (
            <div
              key={day}
              className={`aspect-square flex flex-col items-center justify-center rounded-lg border-2 ${
                isToday ? 'border-primary' : 'border-transparent'
              } ${bgColor} transition-all hover:scale-105 cursor-pointer p-1`}
            >
              <div className="font-medium text-sm">{day}</div>
              {stats.total > 0 && (
                <div className="text-xs text-muted-foreground mt-1">
                  {stats.present + stats.late}/{stats.total}
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      <div className="flex flex-wrap gap-4 justify-center text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-success/20 border border-success" />
          <span>90%+ attendance</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-warning/20 border border-warning" />
          <span>70-90% attendance</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-destructive/20 border border-destructive" />
          <span>&lt;70% attendance</span>
        </div>
      </div>
    </div>
  );
};

export default function TeamCalendar() {
  const { allEmployeesAttendance, loading, fetchAllEmployeesAttendance } = useAttendanceStore();

  useEffect(() => {
    fetchAllEmployeesAttendance();
  }, []);

  // Use real attendance records fetched from the backend as historical data
  const historicalData = allEmployeesAttendance;

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold">Team Calendar</h1>
        <p className="text-muted-foreground mt-1">
          Visual overview of team attendance patterns
        </p>
      </motion.div>

      {/* Summary Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="bg-success-light text-success p-3 rounded-xl">
                  <Users className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Average Attendance</p>
                  <p className="text-2xl font-bold">87%</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="bg-info-light text-info p-3 rounded-xl">
                  <CalendarIcon className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Working Days</p>
                  <p className="text-2xl font-bold">22</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="bg-warning-light text-warning p-3 rounded-xl">
                  <Users className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Team Members</p>
                  <p className="text-2xl font-bold">8</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>

      {/* Calendar View */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5" />
              Team Attendance Calendar
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-96 w-full" />
            ) : (
              <TeamCalendarGrid history={historicalData} />
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
