import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAttendanceStore } from '@/store/attendanceStore';
import { Filter, Search, Download } from 'lucide-react';
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
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function Employees() {
  const { allEmployeesAttendance, loading, fetchAllEmployeesAttendance } = useAttendanceStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  useEffect(() => {
    fetchAllEmployeesAttendance();
  }, []);

  const filteredData = allEmployeesAttendance.filter((record) => {
    const name = record.employeeName || '';
    const matchesSearch = name.toLowerCase().includes((searchQuery || '').toLowerCase());
    const matchesStatus = filterStatus === 'all' || (record.status || '') === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleExport = () => {
    // Mock export functionality
    const csvContent = [
      ['Employee Name', 'Date', 'Check In', 'Check Out', 'Hours', 'Status'],
      ...filteredData.map((r) => [
        r.employeeName,
        r.date,
        r.checkIn || '',
        r.checkOut || '',
        r.totalHours,
        r.status,
      ]),
    ]
      .map((row) => row.join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `attendance-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold">All Employees Attendance</h1>
        <p className="text-muted-foreground mt-1">
          Manage and view attendance records for all team members
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
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by employee name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-full md:w-48">
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
              <Button onClick={handleExport} variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Export CSV
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Attendance Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>
              Attendance Records ({filteredData.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-2">
                {[...Array(8)].map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Check In</TableHead>
                    <TableHead>Check Out</TableHead>
                    <TableHead>Hours</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredData.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(record.employeeName || 'user')}`} />
                            <AvatarFallback>
                              {((record.employeeName || '').split(' ').map(n => n[0] || '').join('') || 'U')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{record.employeeName}</p>
                            <p className="text-xs text-muted-foreground">
                              {record.employeeId}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {new Date(record.date).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="font-mono">
                        {record.checkIn || '--:--'}
                      </TableCell>
                      <TableCell className="font-mono">
                        {record.checkOut || '--:--'}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{record.totalHours}h</Badge>
                      </TableCell>
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
