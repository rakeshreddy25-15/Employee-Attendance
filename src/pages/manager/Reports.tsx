import { useState } from 'react';
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

const generateReportData = () => {
  const employees = [
    'John Employee', 'Sarah Smith', 'Mike Johnson', 'Emily Davis',
    'David Wilson', 'Lisa Anderson', 'Tom Brown', 'Anna Garcia'
  ];
  
  return employees.map((name, idx) => ({
    id: `emp-${idx}`,
    name,
    totalDays: 22,
    present: 18 + Math.floor(Math.random() * 3),
    absent: Math.floor(Math.random() * 3),
    late: Math.floor(Math.random() * 4),
    halfDay: Math.floor(Math.random() * 2),
    totalHours: 150 + Math.floor(Math.random() * 30),
    avgCheckIn: '09:05',
    avgCheckOut: '18:10',
  }));
};

export default function Reports() {
  const [reportType, setReportType] = useState('monthly');
  const [selectedEmployee, setSelectedEmployee] = useState('all');
  const [dateRange, setDateRange] = useState('current-month');
  
  const reportData = generateReportData();

  const handleExportReport = () => {
    const csvContent = [
      ['Employee', 'Total Days', 'Present', 'Absent', 'Late', 'Half Day', 'Total Hours'],
      ...reportData.map((r) => [
        r.name,
        r.totalDays,
        r.present,
        r.absent,
        r.late,
        r.halfDay,
        r.totalHours,
      ]),
    ]
      .map((row) => row.join(','))
      .join('\n');

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
                {reportData.map((employee) => {
                  const attendanceRate = ((employee.present + employee.late) / employee.totalDays * 100).toFixed(1);
                  return (
                    <TableRow key={employee.id}>
                      <TableCell className="font-medium">{employee.name}</TableCell>
                      <TableCell>{employee.totalDays}</TableCell>
                      <TableCell>
                        <span className="text-success font-medium">{employee.present}</span>
                      </TableCell>
                      <TableCell>
                        <span className="text-destructive font-medium">{employee.absent}</span>
                      </TableCell>
                      <TableCell>
                        <span className="text-warning font-medium">{employee.late}</span>
                      </TableCell>
                      <TableCell>
                        <span className="text-info font-medium">{employee.halfDay}</span>
                      </TableCell>
                      <TableCell>{employee.totalHours}h</TableCell>
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
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
