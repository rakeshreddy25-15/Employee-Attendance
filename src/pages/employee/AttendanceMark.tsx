import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAttendanceStore } from '@/store/attendanceStore';
import { LogIn, LogOut, Calendar, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { StatusBadge } from '@/components/StatusBadge';

export default function AttendanceMark() {
  const { todayStatus, loading, fetchTodayStatus, checkIn, checkOut } = useAttendanceStore();

  useEffect(() => {
    fetchTodayStatus();
  }, []);

  const handleCheckIn = async () => {
    try {
      await checkIn();
      await fetchTodayStatus();
      toast.success('Checked in successfully!', {
        description: `Checked in at ${new Date().toLocaleTimeString()}`,
      });
    } catch (error) {
      toast.error('Check-in failed', {
        description: 'Unable to check in. Please try again.',
      });
    }
  };

  const handleCheckOut = async () => {
    try {
      await checkOut();
      await fetchTodayStatus();
      toast.success('Checked out successfully!', {
        description: `Checked out at ${new Date().toLocaleTimeString()}`,
      });
    } catch (error) {
      toast.error('Check-out failed', {
        description: 'Unable to check out. Please try again.',
      });
    }
  };

  const currentTime = new Date().toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold">Mark Attendance</h1>
        <p className="text-muted-foreground mt-1">
          Check in or check out for today
        </p>
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Current Time Card */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-gradient-to-br from-primary/10 to-primary/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Current Time
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-5xl font-bold text-primary mb-2">
                  {currentTime}
                </div>
                <div className="text-lg text-muted-foreground">
                  {new Date().toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Today's Status Card */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Today's Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Status</p>
                  {todayStatus ? (
                    <StatusBadge status={todayStatus.status} />
                  ) : (
                    <span className="text-muted-foreground">Not checked in yet</span>
                  )}
                </div>

                {todayStatus && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Check In</p>
                        <p className="text-2xl font-bold text-success">
                          {todayStatus.checkIn || '--:--'}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Check Out</p>
                        <p className="text-2xl font-bold text-destructive">
                          {todayStatus.checkOut || '--:--'}
                        </p>
                      </div>
                    </div>

                    {todayStatus.checkOut && (
                      <div>
                        <p className="text-sm text-muted-foreground">Total Hours</p>
                        <p className="text-2xl font-bold">{todayStatus.totalHours}h</p>
                      </div>
                    )}
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              {!todayStatus?.checkIn ? (
                <Button
                  onClick={handleCheckIn}
                  size="lg"
                  disabled={loading}
                  className="h-32 text-lg font-semibold"
                >
                  <div className="flex flex-col items-center gap-2">
                    <LogIn className="h-8 w-8" />
                    <span>Check In</span>
                  </div>
                </Button>
              ) : (
                <Button
                  size="lg"
                  disabled
                  variant="secondary"
                  className="h-32 text-lg font-semibold"
                >
                  <div className="flex flex-col items-center gap-2">
                    <LogIn className="h-8 w-8" />
                    <span>Already Checked In</span>
                  </div>
                </Button>
              )}

              {todayStatus?.checkIn && !todayStatus?.checkOut ? (
                <Button
                  onClick={handleCheckOut}
                  size="lg"
                  variant="destructive"
                  disabled={loading}
                  className="h-32 text-lg font-semibold"
                >
                  <div className="flex flex-col items-center gap-2">
                    <LogOut className="h-8 w-8" />
                    <span>Check Out</span>
                  </div>
                </Button>
              ) : (
                <Button
                  size="lg"
                  disabled
                  variant="secondary"
                  className="h-32 text-lg font-semibold"
                >
                  <div className="flex flex-col items-center gap-2">
                    <LogOut className="h-8 w-8" />
                    <span>
                      {todayStatus?.checkOut
                        ? 'Already Checked Out'
                        : 'Check In First'}
                    </span>
                  </div>
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Info Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="bg-info-light border-info/20">
          <CardContent className="p-6">
            <h3 className="font-semibold mb-2 text-info">Attendance Guidelines</h3>
            <ul className="space-y-1 text-sm text-info/80">
              <li>• Check in before 9:15 AM to be marked as "Present"</li>
              <li>• Check in after 9:15 AM will be marked as "Late"</li>
              <li>• Complete at least 8 hours for full day attendance</li>
              <li>• Less than 4 hours will be marked as "Half Day"</li>
            </ul>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
