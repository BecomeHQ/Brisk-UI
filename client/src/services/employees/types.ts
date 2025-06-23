export interface Employee {
  id: string;
  name: string;
  role: string;
  department: string;
  gender: "Male" | "Female";
  avatar: string;
  metrics: {
    workHoursToday: number;
    workHoursThisWeek: number;
    lateNightCheckins: number;
    burnoutScore: number;
    workLifeBalance: number;
  };
  leaves: {
    total: number;
    taken: number;
    planned: number;
    sickLeaves: number;
    // Detailed breakdown by leave type
    sick: number;
    casual: number;
    emergency: number;
    bereavement: number;
    maternity: number;
    paternity: number;
    menstrual: number;
    compensatory: number;
  };
  recentActivity: {
    date: string;
    action: string;
    hours?: number;
  }[];
}

export interface TeamMetrics {
  averageWorkHours: number;
  averageBurnoutScore: number;
  averageWorkLifeBalance: number;
  pendingLeaveRequests: number;
  activeBurnoutRisks: number;
  employeeLeavesToday: number;
  employeeCheckIns: number;
  totalEmployees: number;
  leavePercentage: number;
  burnoutRiskPercentage: number;
  weekendWorkers: number;
  weekendWorkersPercentage: number;
  lateNightCheckins: number;
  yesterdayCheckins: number;
}
