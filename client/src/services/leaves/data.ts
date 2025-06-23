
import { DailyTeamData, LeaveRequest } from "./types";

// Sample data for employee check-in/out
export const teamLeaves: DailyTeamData[] = [
  {
    date: new Date(),
    employees: ["Harish Venkatesh", "Aleesha"],
    checkInOut: [
      { name: "Vasantha kumar", checkIn: "09:00 AM", checkOut: "06:30 PM" },
      { name: "Samuel", checkIn: "08:45 AM", checkOut: "05:15 PM" },
      { name: "Samshritha", checkIn: "08:30 AM", checkOut: "07:00 PM" },
      { name: "Vignesh Arulingam", checkIn: "09:15 AM", checkOut: "05:30 PM" },
      { name: "Indhu", checkIn: "08:50 AM", checkOut: "05:45 PM" },
      { name: "Pooja", checkIn: "09:10 AM", checkOut: "06:00 PM" },
      { name: "Gowtham", checkIn: "08:30 AM", checkOut: "05:30 PM" },
      { name: "Afreetha", checkIn: "09:30 AM", checkOut: "06:45 PM" },
      { name: "Sandeep", checkIn: "08:15 AM", checkOut: "05:00 PM" },
      { name: "Gokul", checkIn: "09:45 AM", checkOut: "07:15 PM" },
      { name: "Preksha", checkIn: "08:00 AM", checkOut: "05:30 PM" },
      { name: "Shri Karthick Adhithya", checkIn: "09:20 AM", checkOut: "06:15 PM" },
      { name: "Thangavel", checkIn: "08:40 AM", checkOut: "05:40 PM" },
      { name: "Juhi", checkIn: "09:05 AM", checkOut: "06:10 PM" },
      { name: "Divya", checkIn: "08:55 AM", checkOut: "06:00 PM" },
      { name: "Siddharth", checkIn: "09:25 AM", checkOut: "06:30 PM" },
      { name: "Prity", checkIn: "08:35 AM", checkOut: "05:45 PM" },
      { name: "Arjun", checkIn: "09:15 AM", checkOut: "06:20 PM" },
      { name: "Noothan", checkIn: "08:45 AM", checkOut: "05:50 PM" },
    ]
  },
  {
    date: new Date(new Date().setDate(new Date().getDate() - 1)), // Yesterday
    employees: ["Divya", "Pooja", "Noothan"],
    checkInOut: [
      { name: "Harish Venkatesh", checkIn: "09:05 AM", checkOut: "06:45 PM" },
      { name: "Vasantha kumar", checkIn: "08:50 AM", checkOut: "05:30 PM" },
      { name: "Aleesha", checkIn: "08:40 AM", checkOut: "07:15 PM" },
      { name: "Samuel", checkIn: "09:10 AM", checkOut: "05:20 PM" },
      { name: "Samshritha", checkIn: "08:45 AM", checkOut: "05:50 PM" },
      { name: "Vignesh Arulingam", checkIn: "09:20 AM", checkOut: "06:10 PM" },
      { name: "Indhu", checkIn: "08:30 AM", checkOut: "05:30 PM" },
      { name: "Gowtham", checkIn: "09:15 AM", checkOut: "06:00 PM" },
      { name: "Afreetha", checkIn: "08:50 AM", checkOut: "05:45 PM" },
      { name: "Sandeep", checkIn: "09:30 AM", checkOut: "06:30 PM" },
      { name: "Gokul", checkIn: "08:40 AM", checkOut: "05:40 PM" },
      { name: "Preksha", checkIn: "09:00 AM", checkOut: "06:15 PM" },
      { name: "Shri Karthick Adhithya", checkIn: "08:55 AM", checkOut: "05:55 PM" },
      { name: "Thangavel", checkIn: "09:25 AM", checkOut: "06:25 PM" },
      { name: "Juhi", checkIn: "08:35 AM", checkOut: "05:35 PM" },
      { name: "Siddharth", checkIn: "09:20 AM", checkOut: "06:20 PM" },
      { name: "Prity", checkIn: "08:45 AM", checkOut: "05:45 PM" },
      { name: "Arjun", checkIn: "09:10 AM", checkOut: "06:10 PM" },
    ]
  },
  {
    date: new Date(new Date().setDate(new Date().getDate() - 2)), // Day before yesterday
    employees: ["Preksha", "Gokul", "Siddharth", "Juhi"],
    checkInOut: [
      { name: "Harish Venkatesh", checkIn: "08:55 AM", checkOut: "06:30 PM" },
      { name: "Vasantha kumar", checkIn: "08:35 AM", checkOut: "07:30 PM" },
      { name: "Aleesha", checkIn: "08:50 AM", checkOut: "05:40 PM" },
      { name: "Samuel", checkIn: "09:10 AM", checkOut: "06:15 PM" },
      { name: "Samshritha", checkIn: "08:45 AM", checkOut: "05:45 PM" },
      { name: "Vignesh Arulingam", checkIn: "09:00 AM", checkOut: "06:00 PM" },
      { name: "Indhu", checkIn: "08:40 AM", checkOut: "05:50 PM" },
      { name: "Pooja", checkIn: "09:15 AM", checkOut: "06:30 PM" },
      { name: "Gowtham", checkIn: "08:30 AM", checkOut: "05:30 PM" },
      { name: "Afreetha", checkIn: "09:20 AM", checkOut: "06:20 PM" },
      { name: "Sandeep", checkIn: "08:50 AM", checkOut: "05:40 PM" },
      { name: "Shri Karthick Adhithya", checkIn: "09:05 AM", checkOut: "06:10 PM" },
      { name: "Thangavel", checkIn: "08:45 AM", checkOut: "05:45 PM" },
      { name: "Divya", checkIn: "09:30 AM", checkOut: "06:30 PM" },
      { name: "Prity", checkIn: "08:40 AM", checkOut: "05:40 PM" },
      { name: "Arjun", checkIn: "09:15 AM", checkOut: "06:15 PM" },
      { name: "Noothan", checkIn: "08:55 AM", checkOut: "05:55 PM" },
    ]
  }
];

// Add pending leave requests data
export const pendingLeaveRequests: LeaveRequest[] = [
  {
    id: "lr1",
    employeeId: "3",
    employeeName: "Aleesha",
    type: "vacation",
    startDate: new Date(2025, 5, 1),
    endDate: new Date(2025, 5, 5),
    status: "pending",
    requestedOn: new Date(2025, 4, 15)
  },
  {
    id: "lr2",
    employeeId: "5",
    employeeName: "Samshritha",
    type: "sick",
    startDate: new Date(2025, 5, 3),
    endDate: new Date(2025, 5, 4),
    status: "pending",
    requestedOn: new Date(2025, 4, 18)
  },
  {
    id: "lr3",
    employeeId: "1",
    employeeName: "Harish Venkatesh",
    type: "casual",
    startDate: new Date(2025, 4, 29),
    endDate: new Date(2025, 5, 2),
    status: "pending",
    requestedOn: new Date(2025, 4, 16)
  }
];
