import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  CheckCircle,
  Clock,
  Download,
  Filter,
  Plus,
  XCircle,
  Loader2,
} from "lucide-react";
import { apiService } from "@/services/api";
import { format } from "date-fns";

interface LeaveManagementDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

interface LeaveRequest {
  _id: string;
  user: string; // Slack ID
  username: string; // Mapped username
  dates: string[];
  reason: string;
  status: string;
  leaveType: string;
  leaveDay: string[];
  leaveTime: string[];
  createdAt: string;
  updatedAt: string;
}

export function LeaveManagementDialog({
  isOpen,
  onClose,
}: LeaveManagementDialogProps) {
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all leave requests when dialog opens
  useEffect(() => {
    if (isOpen) {
      fetchLeaveRequests();
    }
  }, [isOpen]);

  const fetchLeaveRequests = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch all leave requests
      const response = await apiService.getAllLeaveRequests();

      if (response.error) {
        setError(response.error);
      } else {
        setLeaveRequests(response.data || []);
      }
    } catch (err) {
      setError("Failed to fetch leave requests");
      console.error("Error fetching leave requests:", err);
    } finally {
      setLoading(false);
    }
  };

  const pendingRequests = leaveRequests.filter(
    (req) => req.status === "Pending"
  );
  const approvedToday = leaveRequests.filter((req) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const updatedAt = new Date(req.updatedAt);
    updatedAt.setHours(0, 0, 0, 0);
    return req.status === "Approved" && updatedAt.getTime() === today.getTime();
  });

  const calculateDays = (dates: string[]) => {
    return dates.length;
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM d, yyyy");
    } catch {
      return dateString;
    }
  };

  const formatDateRange = (dates: string[]) => {
    if (dates.length === 1) {
      return formatDate(dates[0]);
    }
    return `${formatDate(dates[0])} - ${formatDate(dates[dates.length - 1])}`;
  };

  const getLeaveTypeDisplay = (leaveType: string) => {
    const typeMap: { [key: string]: string } = {
      casualLeave: "Casual Leave",
      sickLeave: "Sick Leave",
      maternityLeave: "Maternity Leave",
      paternityLeave: "Paternity Leave",
      bereavementLeave: "Bereavement Leave",
      wfhLeave: "Work From Home",
      internshipLeave: "Internship Leave",
      unpaidLeave: "Unpaid Leave",
      restrictedHoliday: "Restricted Holiday",
      burnout: "Burnout Leave",
      mensuralLeaves: "Menstrual Leave",
    };
    return typeMap[leaveType] || leaveType;
  };

  const handleApprove = async (requestId: string) => {
    try {
      // TODO: Implement approve functionality
      console.log("Approving request:", requestId);
      // Refresh the data after approval
      await fetchLeaveRequests();
    } catch (err) {
      console.error("Error approving request:", err);
    }
  };

  const handleReject = async (requestId: string) => {
    try {
      // TODO: Implement reject functionality
      console.log("Rejecting request:", requestId);
      // Refresh the data after rejection
      await fetchLeaveRequests();
    } catch (err) {
      console.error("Error rejecting request:", err);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Leave Management</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
              <div className="flex items-center gap-2 text-amber-700 mb-2">
                <Clock size={18} />
                <span className="text-sm font-medium">Pending Requests</span>
              </div>
              <div className="text-2xl font-semibold text-amber-800">
                {loading ? "..." : pendingRequests.length}
              </div>
              <div className="text-xs text-amber-600 mt-1">
                Awaiting approval
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <div className="flex items-center gap-2 text-blue-700 mb-2">
                <CheckCircle size={18} />
                <span className="text-sm font-medium">This Week</span>
              </div>
              <div className="text-2xl font-semibold text-blue-800">
                {loading
                  ? "..."
                  : leaveRequests.filter((req) => req.status === "Approved")
                      .length}
              </div>
              <div className="text-xs text-blue-600 mt-1">
                Approved requests
              </div>
            </div>

            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <div className="flex items-center gap-2 text-green-700 mb-2">
                <CheckCircle size={18} />
                <span className="text-sm font-medium">Approved Today</span>
              </div>
              <div className="text-2xl font-semibold text-green-800">
                {loading ? "..." : approvedToday.length}
              </div>
              <div className="text-xs text-green-600 mt-1">Leave requests</div>
            </div>
          </div>

          {/* Leave Requests Table */}
          <div className="bg-white rounded-lg border border-neutral-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-neutral-200 flex items-center justify-between">
              <h3 className="text-lg font-medium">Leave Requests</h3>
            </div>

            <div className="p-4">
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin mr-2" />
                  <span>Loading leave requests...</span>
                </div>
              ) : error ? (
                <div className="flex items-center justify-center py-8 text-red-600">
                  <span>Error: {error}</span>
                </div>
              ) : (
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
                    {leaveRequests.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={6}
                          className="text-center py-8 text-neutral-500"
                        >
                          No leave requests found
                        </TableCell>
                      </TableRow>
                    ) : (
                      leaveRequests.map((request) => (
                        <TableRow key={request._id}>
                          <TableCell className="font-medium">
                            {request.username || request.user}
                          </TableCell>
                          <TableCell>
                            {getLeaveTypeDisplay(request.leaveType)}
                          </TableCell>
                          <TableCell>
                            {formatDateRange(request.dates)}
                          </TableCell>
                          <TableCell>{calculateDays(request.dates)}</TableCell>
                          <TableCell>
                            {request.status === "Pending" ? (
                              <Badge
                                variant="outline"
                                className="bg-warning-light text-warning border-warning/20"
                              >
                                Pending
                              </Badge>
                            ) : request.status === "Approved" ? (
                              <Badge
                                variant="outline"
                                className="bg-success-light text-success border-success/20"
                              >
                                Approved
                              </Badge>
                            ) : (
                              <Badge
                                variant="outline"
                                className="bg-danger-light text-danger border-danger/20"
                              >
                                Rejected
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            {request.status === "Pending" && (
                              <div className="flex justify-end gap-2">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-success"
                                  onClick={() => handleApprove(request._id)}
                                >
                                  <CheckCircle size={16} />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-danger"
                                  onClick={() => handleReject(request._id)}
                                >
                                  <XCircle size={16} />
                                </Button>
                              </div>
                            )}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
