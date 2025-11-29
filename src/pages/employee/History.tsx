import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAttendanceStore, AttendanceStatus } from '@/store/attendanceStore';
import { Calendar as CalendarIcon, Filter } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { StatusBadge } from '@/components/StatusBadge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// Simple calendar component
const CalendarView = ({ history }: { history: any[] }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startingDayOfWeek = firstDay.getDay();
  
  const getStatusForDate = (day: number): AttendanceStatus | null => {
    const dateStr = new Date(year, month, day).toISOString().split('T')[0];
    const record = history.find((h) => h.date === dateStr);
    return record?.status || null;
  };
  
  const getStatusColor = (status: AttendanceStatus | null) => {
    if (!status) return 'bg-muted';
    const colors = {
      present: 'bg-success',
      absent: 'bg-destructive',
      late: 'bg-warning',
      'half-day': 'bg-info',
    };
    return colors[status];
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
          const status = getStatusForDate(day);
          const isToday =
            day === new Date().getDate() &&
            month === new Date().getMonth() &&
            year === new Date().getFullYear();
          
          return (
            <div
              key={day}
              className={`aspect-square flex items-center justify-center rounded-lg border-2 ${
                isToday ? 'border-primary' : 'border-transparent'
              } ${getStatusColor(status)} ${
                status ? 'text-white font-medium' : 'bg-muted/50'
              } transition-all hover:scale-105 cursor-pointer`}
            >
              {day}
            </div>
          );
        })}
      </div>
      
      <div className="flex flex-wrap gap-4 justify-center text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-success" />
          <span>Present</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-warning" />
          <span>Late</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-info" />
          <span>Half Day</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-destructive" />
          <span>Absent</span>
        </div>
      </div>
    </div>
  );
};

export default function History() {
  const { history, loading, fetchHistory } = useAttendanceStore();
  const [filterStatus, setFilterStatus] = useState<string>('all');

  useEffect(() => {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 3);
    fetchHistory(startDate.toISOString().split('T')[0], endDate.toISOString().split('T')[0]);
  }, []);

  const filteredHistory =
    filterStatus === 'all'
      ? history
      : history.filter((h) => h.status === filterStatus);

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold">My Attendance History</h1>
        <p className="text-muted-foreground mt-1">
          View your complete attendance record
        </p>
      </motion.div>

      {/* Calendar View */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5" />
              Calendar View
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-96 w-full" />
            ) : (
              <CalendarView history={history} />
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Table View */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Detailed Records</CardTitle>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-48">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="present">Present</SelectItem>
                  <SelectItem value="late">Late</SelectItem>
                  <SelectItem value="half-day">Half Day</SelectItem>
                  <SelectItem value="absent">Absent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-2">
                {[...Array(10)].map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Check In</TableHead>
                    <TableHead>Check Out</TableHead>
                    <TableHead>Hours</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredHistory.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell className="font-medium">
                        {new Date(record.date).toLocaleDateString('en-US', {
                          weekday: 'short',
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </TableCell>
                      <TableCell>{record.checkIn || '--:--'}</TableCell>
                      <TableCell>{record.checkOut || '--:--'}</TableCell>
                      <TableCell>{record.totalHours}h</TableCell>
                      <TableCell>
                        <StatusBadge status={record.status} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
