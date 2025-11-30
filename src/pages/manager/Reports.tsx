import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Download, Calendar, Filter } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { StatusBadge } from '@/components/StatusBadge';
import { Label } from '@/components/ui/label';

import { useAttendanceStore } from '@/store/attendanceStore';

export default function Reports() {
  const [reportType, setReportType] = useState('monthly');
  const [selectedEmployee, setSelectedEmployee] = useState('all');
  const [dateRange, setDateRange] = useState('current-month');
  
  const { allEmployeesAttendance, loading, fetchAllEmployeesAttendance } = useAttendanceStore();

  useEffect(() => {
    // attempt to load real attendance data (will be empty if backend not available)
    fetchAllEmployeesAttendance();
  }, [fetchAllEmployeesAttendance, dateRange]);

  const reportData = allEmployeesAttendance || [];

  const handleExportReport = () => {
    // Export whatever data is currently available (may be empty if no backend data)
    const header = ['Employee', 'Date', 'Check In', 'Check Out', 'Hours', 'Status'];
    const rows = reportData.length
      ? reportData.map((r: any) => [r.employeeName || r.name || '', r.date || '', r.checkIn || '', r.checkOut || '', r.totalHours ?? '', r.status || ''])
      : [];

    const csvContent = [header, ...rows].map((row) => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `attendance-report-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold">Reports & Analytics</h1>
        <p className="text-muted-foreground mt-1">
          Generate and export detailed attendance reports
        </p>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Report Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label>Report Type</Label>
                <Select value={reportType} onValueChange={setReportType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily Report</SelectItem>
                    <SelectItem value="weekly">Weekly Report</SelectItem>
                    <SelectItem value="monthly">Monthly Report</SelectItem>
                    <SelectItem value="custom">Custom Range</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Date Range</Label>
                <Select value={dateRange} onValueChange={setDateRange}>
                  <SelectTrigger>
                    <Calendar className="mr-2 h-4 w-4" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="current-month">Current Month</SelectItem>
                    <SelectItem value="last-month">Last Month</SelectItem>
                    <SelectItem value="last-3-months">Last 3 Months</SelectItem>
                    <SelectItem value="last-6-months">Last 6 Months</SelectItem>
                    <SelectItem value="current-year">Current Year</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Employee</Label>
                <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Employees</SelectItem>
                    <SelectItem value="emp-001">John Employee</SelectItem>
                    <SelectItem value="emp-002">Sarah Smith</SelectItem>
                    <SelectItem value="emp-003">Mike Johnson</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="mt-4 flex gap-3">
              <Button className="flex-1" onClick={handleExportReport}>
                <Download className="mr-2 h-4 w-4" />
                Export as CSV
              </Button>
              <Button variant="outline" className="flex-1">
                <FileText className="mr-2 h-4 w-4" />
                Generate PDF
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Summary Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground">Total Working Days</p>
              <p className="text-3xl font-bold mt-2">22</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground">Average Attendance</p>
              <p className="text-3xl font-bold mt-2 text-success">87%</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground">Total Hours</p>
              <p className="text-3xl font-bold mt-2">1,456</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground">Late Arrivals</p>
              <p className="text-3xl font-bold mt-2 text-warning">12</p>
            </CardContent>
          </Card>
        </div>
      </motion.div>

      {/* Detailed Report Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Detailed Attendance Report</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Total Days</TableHead>
                  <TableHead>Present</TableHead>
                  <TableHead>Absent</TableHead>
                  <TableHead>Late</TableHead>
                  <TableHead>Half Day</TableHead>
                  <TableHead>Total Hours</TableHead>
                  <TableHead>Attendance %</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reportData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center text-muted-foreground">
                      No attendance data available.
                    </TableCell>
                  </TableRow>
                ) : (
                  reportData.map((employee: any) => {
                    // Try to show per-employee aggregated values if present; otherwise show per-day fields
                    const name = employee.employeeName || employee.name || '—';
                    const totalDays = employee.totalDays ?? '-';
                    const present = employee.present ?? (employee.status === 'present' ? 1 : 0);
                    const absent = employee.absent ?? (employee.status === 'absent' ? 1 : 0);
                    const late = employee.late ?? (employee.status === 'late' ? 1 : 0);
                    const halfDay = employee.halfDay ?? 0;
                    const totalHours = employee.totalHours ?? '-';
                    const attendanceRate = totalDays && totalDays !== '-' ? (((present + late) / totalDays) * 100).toFixed(1) : '0.0';

                    return (
                      <TableRow key={employee.id || `${name}-${employee.date || ''}`}>
                        <TableCell className="font-medium">{name}</TableCell>
                        <TableCell>{totalDays}</TableCell>
                        <TableCell>
                          <span className="text-success font-medium">{present}</span>
                        </TableCell>
                        <TableCell>
                          <span className="text-destructive font-medium">{absent}</span>
                        </TableCell>
                        <TableCell>
                          <span className="text-warning font-medium">{late}</span>
                        </TableCell>
                        <TableCell>
                          <span className="text-info font-medium">{halfDay}</span>
                        </TableCell>
                        <TableCell>{totalHours}h</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="flex-1 bg-muted rounded-full h-2">
                              <div
                                className={`h-full rounded-full ${
                                  parseFloat(attendanceRate) >= 90
                                    ? 'bg-success'
                                    : parseFloat(attendanceRate) >= 75
                                    ? 'bg-warning'
                                    : 'bg-destructive'
                                }`}
                                style={{ width: `${attendanceRate}%` }}
                              />
                            </div>
                            <span className="text-sm font-medium w-12">{attendanceRate}%</span>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
