
import { employees } from "./data";
import { Employee } from "./types";
import { getTeamLeaves } from "../leaves/utils";

export const getEmployeeById = (id: string): Employee | undefined => {
  return employees.find((employee) => employee.id === id);
};

export const getEmployeesByDepartment = (department: string): Employee[] => {
  return employees.filter((employee) => employee.department === department);
};

export const getHighBurnoutRiskEmployees = (): Employee[] => {
  return employees.filter((employee) => employee.metrics.burnoutScore > 70);
};

export const getLowLeaveUtilizationEmployees = (): Employee[] => {
  return employees.filter(
    (employee) => 
      (employee.leaves.taken + employee.leaves.planned) / employee.leaves.total < 0.25 && 
      new Date().getMonth() > 5  // Only after half year
  );
};

// Function to get employees on leave today
export const getEmployeesOnLeaveToday = (): string[] => {
  const today = new Date();
  const todayString = today.toDateString();
  const todayData = getTeamLeaves().find(item => item.date.toDateString() === todayString);
  return todayData?.employees || [];
};

// Function to get employees on leave in the next 7 days
export const getEmployeesOnLeaveNextWeek = (): string[] => {
  const today = new Date();
  const nextWeek = new Date(today);
  nextWeek.setDate(today.getDate() + 7);
  
  // Create an array of all dates between today and next week
  const dateRange: Date[] = [];
  for (let d = new Date(today); d <= nextWeek; d.setDate(d.getDate() + 1)) {
    dateRange.push(new Date(d));
  }
  
  // Filter teamLeaves for entries within the date range and collect employee names
  const employeesOnLeave = new Set<string>();
  const teamLeaves = getTeamLeaves();
  
  dateRange.forEach(date => {
    const dateString = date.toDateString();
    const leaveData = teamLeaves.find(item => item.date.toDateString() === dateString);
    if (leaveData?.employees && leaveData.employees.length > 0) {
      leaveData.employees.forEach(employee => employeesOnLeave.add(employee));
    }
  });
  
  return Array.from(employeesOnLeave);
};
