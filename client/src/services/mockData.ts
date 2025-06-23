
// This file is just a re-export for compatibility with existing imports
// We should eventually update all imports to use the new module paths directly

// Import the data first so it's available for the functions below
import { employees, teamMetrics } from './employees/data';
import { teamLeaves, pendingLeaveRequests } from './leaves/data';

// Then export them
export { employees, teamMetrics };
export { teamLeaves, pendingLeaveRequests };

export { 
  getEmployeeById,
  getEmployeesByDepartment, 
  getHighBurnoutRiskEmployees, 
  getLowLeaveUtilizationEmployees,
  getEmployeesOnLeaveToday,
  getEmployeesOnLeaveNextWeek
} from './employees/utils';

// Export pending leave requests count function
export const getPendingLeaveRequestsCount = (): number => {
  return pendingLeaveRequests.length;
};
