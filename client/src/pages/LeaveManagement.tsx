
import Layout from "@/components/layout/Layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { employees } from "@/services/mockData";
import { AlertCircle, CalendarCheck, CheckCircle, Clock, Download, Filter, Plus, Users, XCircle } from "lucide-react";
import { useState } from "react";

const LeaveManagement = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());

  // Mock leave requests
  const leaveRequests = [
    {
      id: "1",
      employee: "Marcus Johnson",
      type: "Annual Leave",
      startDate: "May 20, 2025",
      endDate: "May 22, 2025",
      days: 3,
      status: "pending",
    },
    {
      id: "2",
      employee: "Emma Rodriguez",
      type: "Sick Leave",
      startDate: "May 19, 2025",
      endDate: "May 19, 2025",
      days: 1,
      status: "pending",
    },
    {
      id: "3",
      employee: "Raj Patel",
      type: "Annual Leave",
      startDate: "May 18, 2025",
      endDate: "May 18, 2025",
      days: 1,
      status: "approved",
    },
  ];

  // Mock upcoming leaves
  const upcomingLeaves = [
    {
      id: "1",
      employee: "Raj Patel",
      type: "Annual Leave",
      startDate: "May 18, 2025",
      endDate: "May 19, 2025",
      days: 2,
    },
    {
      id: "2",
      employee: "Sophia Wong",
      type: "Annual Leave",
      startDate: "May 27, 2025",
      endDate: "May 28, 2025",
      days: 2,
    },
    {
      id: "3",
      employee: "Marcus Johnson",
      type: "Annual Leave",
      startDate: "June 5, 2025",
      endDate: "June 12, 2025",
      days: 5,
    },
  ];

  // Calculate total annual leaves for the team
  const totalLeaves = employees.reduce((sum, emp) => sum + emp.leaves.total, 0);
  const takenLeaves = employees.reduce((sum, emp) => sum + emp.leaves.taken, 0);
  const plannedLeaves = employees.reduce((sum, emp) => sum + emp.leaves.planned, 0);
  const pendingRequests = leaveRequests.filter((req) => req.status === "pending").length;

  return (
    <Layout>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Leave Management</h1>
          <p className="text-neutral-500 mt-1">
            Manage and track employee leaves
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <Download size={16} className="mr-2" />
            Export
          </Button>
          <Button>
            <Plus size={16} className="mr-2" />
            New Request
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-6">
        <div className="bg-white p-5 rounded-lg border border-neutral-200 shadow-sm">
          <div className="flex items-center gap-2 text-neutral-600 mb-2">
            <Clock size={18} />
            <span className="text-sm font-medium">Pending Requests</span>
          </div>
          <div className="text-2xl font-semibold">{pendingRequests}</div>
          <div className="text-xs text-neutral-500 mt-1">Awaiting approval</div>
        </div>

        <div className="bg-white p-5 rounded-lg border border-neutral-200 shadow-sm">
          <div className="flex items-center gap-2 text-neutral-600 mb-2">
            <CalendarCheck size={18} />
            <span className="text-sm font-medium">Annual Leave Used</span>
          </div>
          <div className="text-2xl font-semibold">
            {takenLeaves + plannedLeaves}/{totalLeaves}
          </div>
          <div className="text-xs text-neutral-500 mt-1">Team total</div>
        </div>

        <div className="bg-white p-5 rounded-lg border border-neutral-200 shadow-sm">
          <div className="flex items-center gap-2 text-neutral-600 mb-2">
            <Users size={18} />
            <span className="text-sm font-medium">Team Members on Leave</span>
          </div>
          <div className="text-2xl font-semibold">1</div>
          <div className="text-xs text-neutral-500 mt-1">Today</div>
        </div>

        <div className="bg-white p-5 rounded-lg border border-neutral-200 shadow-sm">
          <div className="flex items-center gap-2 text-neutral-600 mb-2">
            <AlertCircle size={18} />
            <span className="text-sm font-medium">Low Leave Utilization</span>
          </div>
          <div className="text-2xl font-semibold">2</div>
          <div className="text-xs text-neutral-500 mt-1">Employees at risk</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2 bg-white rounded-lg border border-neutral-200 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-neutral-200 flex items-center justify-between">
            <h2 className="text-lg font-medium">Leave Requests</h2>
            <Button variant="outline" size="sm" className="gap-1">
              <Filter size={14} />
              <span>Filter</span>
            </Button>
          </div>
          
          <div className="p-5">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Days</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leaveRequests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell className="font-medium">
                      {request.employee}
                    </TableCell>
                    <TableCell>{request.type}</TableCell>
                    <TableCell>
                      {request.startDate === request.endDate
                        ? request.startDate
                        : `${request.startDate} - ${request.endDate}`}
                    </TableCell>
                    <TableCell>{request.days}</TableCell>
                    <TableCell>
                      {request.status === "pending" ? (
                        <Badge variant="outline" className="bg-warning-light text-warning border-warning/20">
                          Pending
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-success-light text-success border-success/20">
                          Approved
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {request.status === "pending" && (
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-success">
                            <CheckCircle size={16} />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-danger">
                            <XCircle size={16} />
                          </Button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-neutral-200 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-neutral-200">
            <h2 className="text-lg font-medium">Team Calendar</h2>
          </div>
          
          <div className="p-4">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="w-full"
              modifiersClassNames={{
                selected: "bg-brisk-100 text-brisk-900 font-medium",
                today: "bg-neutral-100 text-neutral-900 font-medium"
              }}
            />
            
            <div className="mt-6">
              <h3 className="text-sm font-medium mb-3">Upcoming Leaves</h3>
              
              <div className="space-y-3">
                {upcomingLeaves.map((leave) => (
                  <div
                    key={leave.id}
                    className="p-3 bg-neutral-50 border border-neutral-200 rounded-md"
                  >
                    <div className="flex items-center justify-between">
                      <div className="font-medium text-sm">
                        {leave.employee}
                      </div>
                      <Badge variant="outline" className="bg-brisk-50 text-brisk-700 border-brisk-200">
                        {leave.days} days
                      </Badge>
                    </div>
                    <div className="text-xs text-neutral-500 mt-1">
                      {leave.startDate === leave.endDate
                        ? leave.startDate
                        : `${leave.startDate} - ${leave.endDate}`}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-neutral-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-neutral-200 flex items-center justify-between">
          <h2 className="text-lg font-medium">Team Leave Overview</h2>
          <div className="text-xs text-neutral-500">May 2025</div>
        </div>
        
        <div className="p-5">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Annual Leave</TableHead>
                <TableHead>Taken</TableHead>
                <TableHead>Planned</TableHead>
                <TableHead>Remaining</TableHead>
                <TableHead>Sick Leave</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {employees.map((employee) => (
                <TableRow key={employee.id}>
                  <TableCell className="font-medium">
                    {employee.name}
                  </TableCell>
                  <TableCell>{employee.department}</TableCell>
                  <TableCell>{employee.leaves.total}</TableCell>
                  <TableCell>{employee.leaves.taken}</TableCell>
                  <TableCell>{employee.leaves.planned}</TableCell>
                  <TableCell>
                    {employee.leaves.total - employee.leaves.taken - employee.leaves.planned}
                  </TableCell>
                  <TableCell>{employee.leaves.sickLeaves}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </Layout>
  );
};

export default LeaveManagement;
