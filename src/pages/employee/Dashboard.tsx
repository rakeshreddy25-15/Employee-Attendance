import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAttendanceStore } from '@/store/attendanceStore';
import { StatusBadge } from '@/components/StatusBadge';
import {
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  LogIn,
  LogOut,
  Calendar,
} from 'lucide-react';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export default function EmployeeDashboard() {
  const { todayStatus, summary, history, loading, fetchTodayStatus, fetchSummary, fetchHistory, checkIn, checkOut } =
    useAttendanceStore();

  useEffect(() => {
    fetchTodayStatus();
    fetchSummary(new Date().getMonth() + 1, new Date().getFullYear());
    
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 7);
    fetchHistory(startDate.toISOString().split('T')[0], endDate.toISOString().split('T')[0]);
  }, []);

  const handleCheckIn = async () => {
    await checkIn();
    toast.success('Checked in successfully!');
  };

  const handleCheckOut = async () => {
    await checkOut();
    toast.success('Checked out successfully!');
  };

  const stats = [
    {
      title: 'Present Days',
      value: summary?.totalPresent || 0,
      icon: CheckCircle,
      color: 'text-success',
      bgColor: 'bg-success-light',
    },
    {
      title: 'Absent Days',
      value: summary?.totalAbsent || 0,
      icon: XCircle,
      color: 'text-destructive',
      bgColor: 'bg-destructive-light',
    },
    {
      title: 'Late Arrivals',
      value: summary?.totalLate || 0,
      icon: Clock,
      color: 'text-warning',
      bgColor: 'bg-warning-light',
    },
    {
      title: 'Half Days',
      value: summary?.totalHalfDay || 0,
      icon: AlertCircle,
      color: 'text-info',
      bgColor: 'bg-info-light',
    },
  ];

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Welcome back! Here's your attendance overview
        </p>
      </motion.div>

      {/* Today's Status Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Today's Attendance
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-32 w-full" />
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    {todayStatus ? (
                      <StatusBadge status={todayStatus.status} />
                    ) : (
                      <span className="text-muted-foreground">Not checked in</span>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Date</p>
                    <p className="font-medium">{new Date().toLocaleDateString()}</p>
                  </div>
                </div>

                {todayStatus && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Check In</p>
                      <p className="text-lg font-semibold">{todayStatus.checkIn || '--:--'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Check Out</p>
                      <p className="text-lg font-semibold">{todayStatus.checkOut || '--:--'}</p>
                    </div>
                  </div>
                )}

                <div className="flex gap-3">
                  {!todayStatus?.checkIn ? (
                    <Button onClick={handleCheckIn} className="flex-1" disabled={loading}>
                      <LogIn className="mr-2 h-4 w-4" />
                      Check In
                    </Button>
                  ) : !todayStatus?.checkOut ? (
                    <Button onClick={handleCheckOut} variant="destructive" className="flex-1" disabled={loading}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Check Out
                    </Button>
                  ) : (
                    <div className="flex-1 text-center py-2 text-sm text-muted-foreground">
                      You've completed your attendance for today
                    </div>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Monthly Summary Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + index * 0.05 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {stat.title}
                    </p>
                    <p className="text-3xl font-bold mt-2">{stat.value}</p>
                  </div>
                  <div className={`${stat.bgColor} ${stat.color} p-3 rounded-xl`}>
                    <stat.icon className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Recent Attendance */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Recent Attendance (Last 7 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-2">
                {[...Array(5)].map((_, i) => (
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
                  {history.slice(0, 7).map((record) => (
                    <TableRow key={record.id}>
                      <TableCell className="font-medium">
                        {new Date(record.date).toLocaleDateString()}
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
