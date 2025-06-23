
import { Employee } from "../types";

export const clientPartnerTeam: Employee[] = [
  {
    id: "3",
    name: "Aleesha",
    role: "Associate Client Partner",
    department: "Client Partner",
    gender: "Female",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b5bc?w=150&h=150&fit=crop&crop=face",
    metrics: {
      workHoursToday: 8,
      workHoursThisWeek: 40,
      lateNightCheckins: 2,
      burnoutScore: 55,
      workLifeBalance: 7.3,
    },
    leaves: {
      total: 22,
      taken: 5,
      planned: 4,
      sickLeaves: 2,
      sick: 2,
      casual: 2,
      emergency: 0,
      bereavement: 0,
      maternity: 0,
      paternity: 0,
      menstrual: 0,
      compensatory: 1,
    },
    recentActivity: [
      { date: "2024-03-15", action: "Client meeting", hours: 8 },
      { date: "2024-03-14", action: "Proposal preparation", hours: 7.5 },
    ],
  },
];
