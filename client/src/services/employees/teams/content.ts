
import { Employee } from "../types";

export const contentTeam: Employee[] = [
  {
    id: "5",
    name: "Samshritha",
    role: "Lead Content Writer",
    department: "Content",
    gender: "Female",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    metrics: {
      workHoursToday: 7,
      workHoursThisWeek: 35,
      lateNightCheckins: 1,
      burnoutScore: 40,
      workLifeBalance: 8.2,
    },
    leaves: {
      total: 22,
      taken: 4,
      planned: 3,
      sickLeaves: 1,
      sick: 1,
      casual: 2,
      emergency: 0,
      bereavement: 0,
      maternity: 0,
      paternity: 0,
      menstrual: 0,
      compensatory: 1,
    },
    recentActivity: [
      { date: "2024-03-15", action: "Content creation", hours: 7 },
    ],
  },
  {
    id: "6",
    name: "Vignesh Arulingam",
    role: "Marketing and Growth Manager",
    department: "Content",
    gender: "Male",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    metrics: {
      workHoursToday: 8.5,
      workHoursThisWeek: 42.5,
      lateNightCheckins: 3,
      burnoutScore: 60,
      workLifeBalance: 7.0,
    },
    leaves: {
      total: 24,
      taken: 6,
      planned: 5,
      sickLeaves: 2,
      sick: 2,
      casual: 2,
      emergency: 0,
      bereavement: 0,
      maternity: 0,
      paternity: 0,
      menstrual: 0,
      compensatory: 2,
    },
    recentActivity: [
      { date: "2024-03-15", action: "Marketing campaign", hours: 8.5 },
    ],
  },
];
