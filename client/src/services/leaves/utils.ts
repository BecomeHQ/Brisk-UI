
import { teamLeaves, pendingLeaveRequests } from "./data";
import { DailyTeamData, LeaveRequest } from "./types";

// Function to get team leaves data
export const getTeamLeaves = (): DailyTeamData[] => {
  return teamLeaves;
};

// Function to get pending leave requests
export const getPendingLeaveRequests = (): LeaveRequest[] => {
  return pendingLeaveRequests;
};

// Function to get pending leave requests count
export const getPendingLeaveRequestsCount = (): number => {
  return pendingLeaveRequests.filter(request => request.status === "pending").length;
};
