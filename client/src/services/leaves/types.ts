
// Define the CheckInOut interface
export interface EmployeeCheckInOut {
  name: string;
  checkIn: string;
  checkOut: string;
}

export interface DailyTeamData {
  date: Date;
  employees: string[];
  checkInOut: EmployeeCheckInOut[];
}

// Define leave request structure
export interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  type: string;
  startDate: Date;
  endDate: Date;
  status: 'pending' | 'approved' | 'rejected';
  requestedOn: Date;
}
