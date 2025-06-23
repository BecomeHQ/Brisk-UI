
export interface CheckInOutData {
  name: string;
  checkIn: string;
  checkOut: string;
}

export interface TeamLeaveEntry {
  date: Date;
  employees: string[];
  checkInOut: CheckInOutData[];
}

// Mock data for team leaves with check-in/out times
export const teamLeaves: TeamLeaveEntry[] = [
  { 
    date: new Date(2025, 4, 18), 
    employees: ["Harish Venkatesh", "Preksha"], 
    checkInOut: [
      { name: "Vasantha kumar", checkIn: "8:30 AM", checkOut: "5:00 PM" },
      { name: "Aleesha", checkIn: "8:45 AM", checkOut: "6:15 PM" },
      { name: "Samuel", checkIn: "9:00 AM", checkOut: "5:30 PM" },
      { name: "Samshritha", checkIn: "8:15 AM", checkOut: "5:45 PM" },
      { name: "Vignesh Arulingam", checkIn: "9:30 AM", checkOut: "6:00 PM" },
      { name: "Indhu", checkIn: "8:45 AM", checkOut: "5:15 PM" },
      { name: "Pooja", checkIn: "9:15 AM", checkOut: "6:30 PM" },
      { name: "Gowtham", checkIn: "8:30 AM", checkOut: "5:30 PM" },
      { name: "Afreetha", checkIn: "9:00 AM", checkOut: "6:00 PM" },
      { name: "Sandeep", checkIn: "8:45 AM", checkOut: "5:45 PM" },
      { name: "Gokul", checkIn: "9:20 AM", checkOut: "6:15 PM" },
      { name: "Shri Karthick Adhithya", checkIn: "8:50 AM", checkOut: "6:30 PM" },
      { name: "Thangavel", checkIn: "9:10 AM", checkOut: "5:30 PM" },
      { name: "Juhi", checkIn: "8:40 AM", checkOut: "5:15 PM" },
      { name: "Divya", checkIn: "9:25 AM", checkOut: "6:00 PM" },
      { name: "Siddharth", checkIn: "8:30 AM", checkOut: "5:45 PM" },
      { name: "Prity", checkIn: "9:15 AM", checkOut: "6:15 PM" },
      { name: "Arjun", checkIn: "8:45 AM", checkOut: "5:30 PM" },
      { name: "Noothan", checkIn: "9:00 AM", checkOut: "6:00 PM" }
    ]
  },
  { 
    date: new Date(2025, 4, 19), 
    employees: ["Samshritha", "Gowtham", "Prity"],
    checkInOut: [
      { name: "Harish Venkatesh", checkIn: "9:00 AM", checkOut: "6:30 PM" },
      { name: "Vasantha kumar", checkIn: "8:45 AM", checkOut: "5:30 PM" },
      { name: "Aleesha", checkIn: "9:15 AM", checkOut: "6:45 PM" },
      { name: "Samuel", checkIn: "8:30 AM", checkOut: "5:15 PM" },
      { name: "Vignesh Arulingam", checkIn: "9:00 AM", checkOut: "6:00 PM" },
      { name: "Indhu", checkIn: "8:45 AM", checkOut: "5:30 PM" },
      { name: "Pooja", checkIn: "9:30 AM", checkOut: "6:15 PM" },
      { name: "Afreetha", checkIn: "8:15 AM", checkOut: "5:00 PM" },
      { name: "Sandeep", checkIn: "9:00 AM", checkOut: "6:30 PM" },
      { name: "Gokul", checkIn: "8:30 AM", checkOut: "5:45 PM" },
      { name: "Preksha", checkIn: "9:15 AM", checkOut: "6:00 PM" },
      { name: "Shri Karthick Adhithya", checkIn: "8:45 AM", checkOut: "5:30 PM" },
      { name: "Thangavel", checkIn: "9:30 AM", checkOut: "6:15 PM" },
      { name: "Juhi", checkIn: "8:15 AM", checkOut: "5:00 PM" },
      { name: "Divya", checkIn: "9:00 AM", checkOut: "5:45 PM" },
      { name: "Siddharth", checkIn: "8:45 AM", checkOut: "6:00 PM" },
      { name: "Arjun", checkIn: "9:15 AM", checkOut: "6:30 PM" },
      { name: "Noothan", checkIn: "8:30 AM", checkOut: "5:15 PM" }
    ]
  },
  { 
    date: new Date(2025, 4, 20), 
    employees: ["Indhu", "Divya", "Arjun"],
    checkInOut: [
      { name: "Harish Venkatesh", checkIn: "8:30 AM", checkOut: "6:00 PM" },
      { name: "Vasantha kumar", checkIn: "9:00 AM", checkOut: "5:45 PM" },
      { name: "Aleesha", checkIn: "8:45 AM", checkOut: "6:15 PM" },
      { name: "Samuel", checkIn: "9:15 AM", checkOut: "5:30 PM" },
      { name: "Samshritha", checkIn: "8:30 AM", checkOut: "6:00 PM" },
      { name: "Vignesh Arulingam", checkIn: "9:00 AM", checkOut: "5:45 PM" },
      { name: "Pooja", checkIn: "8:15 AM", checkOut: "5:00 PM" },
      { name: "Gowtham", checkIn: "9:30 AM", checkOut: "6:30 PM" },
      { name: "Afreetha", checkIn: "8:45 AM", checkOut: "5:15 PM" },
      { name: "Sandeep", checkIn: "9:00 AM", checkOut: "6:00 PM" },
      { name: "Gokul", checkIn: "8:30 AM", checkOut: "5:45 PM" },
      { name: "Preksha", checkIn: "9:15 AM", checkOut: "6:15 PM" },
      { name: "Shri Karthick Adhithya", checkIn: "8:00 AM", checkOut: "5:30 PM" },
      { name: "Thangavel", checkIn: "9:30 AM", checkOut: "6:00 PM" },
      { name: "Juhi", checkIn: "8:45 AM", checkOut: "5:15 PM" },
      { name: "Siddharth", checkIn: "9:00 AM", checkOut: "6:30 PM" },
      { name: "Prity", checkIn: "8:30 AM", checkOut: "5:45 PM" },
      { name: "Noothan", checkIn: "9:15 AM", checkOut: "6:00 PM" }
    ]
  },
  { 
    date: new Date(2025, 4, 21), 
    employees: ["Afreetha", "Sandeep", "Thangavel"],
    checkInOut: [
      { name: "Harish Venkatesh", checkIn: "9:00 AM", checkOut: "6:15 PM" },
      { name: "Vasantha kumar", checkIn: "8:30 AM", checkOut: "5:30 PM" },
      { name: "Aleesha", checkIn: "9:15 AM", checkOut: "6:30 PM" },
      { name: "Samuel", checkIn: "8:45 AM", checkOut: "5:15 PM" },
      { name: "Samshritha", checkIn: "9:00 AM", checkOut: "6:00 PM" },
      { name: "Vignesh Arulingam", checkIn: "8:30 AM", checkOut: "5:45 PM" },
      { name: "Indhu", checkIn: "9:30 AM", checkOut: "6:15 PM" },
      { name: "Pooja", checkIn: "8:15 AM", checkOut: "5:00 PM" },
      { name: "Gowtham", checkIn: "9:00 AM", checkOut: "5:30 PM" },
      { name: "Gokul", checkIn: "8:45 AM", checkOut: "6:00 PM" },
      { name: "Preksha", checkIn: "9:15 AM", checkOut: "5:45 PM" },
      { name: "Shri Karthick Adhithya", checkIn: "8:30 AM", checkOut: "6:30 PM" },
      { name: "Juhi", checkIn: "9:00 AM", checkOut: "5:15 PM" },
      { name: "Divya", checkIn: "8:45 AM", checkOut: "6:00 PM" },
      { name: "Siddharth", checkIn: "9:30 AM", checkOut: "5:30 PM" },
      { name: "Prity", checkIn: "8:15 AM", checkOut: "6:15 PM" },
      { name: "Arjun", checkIn: "9:00 AM", checkOut: "5:45 PM" },
      { name: "Noothan", checkIn: "8:30 AM", checkOut: "6:00 PM" }
    ]
  },
  { 
    date: new Date(2025, 4, 27), 
    employees: ["Samuel", "Juhi", "Siddharth"],
    checkInOut: [
      { name: "Harish Venkatesh", checkIn: "8:45 AM", checkOut: "6:30 PM" },
      { name: "Vasantha kumar", checkIn: "9:00 AM", checkOut: "5:45 PM" },
      { name: "Aleesha", checkIn: "8:30 AM", checkOut: "6:15 PM" },
      { name: "Samshritha", checkIn: "9:15 AM", checkOut: "5:30 PM" },
      { name: "Vignesh Arulingam", checkIn: "8:45 AM", checkOut: "6:00 PM" },
      { name: "Indhu", checkIn: "9:30 AM", checkOut: "5:45 PM" },
      { name: "Pooja", checkIn: "8:15 AM", checkOut: "6:30 PM" },
      { name: "Gowtham", checkIn: "9:00 AM", checkOut: "5:15 PM" },
      { name: "Afreetha", checkIn: "8:45 AM", checkOut: "6:00 PM" },
      { name: "Sandeep", checkIn: "9:15 AM", checkOut: "5:30 PM" },
      { name: "Gokul", checkIn: "8:30 AM", checkOut: "6:15 PM" },
      { name: "Preksha", checkIn: "9:00 AM", checkOut: "5:45 PM" },
      { name: "Shri Karthick Adhithya", checkIn: "8:45 AM", checkOut: "6:30 PM" },
      { name: "Thangavel", checkIn: "9:30 AM", checkOut: "5:15 PM" },
      { name: "Divya", checkIn: "8:15 AM", checkOut: "6:00 PM" },
      { name: "Prity", checkIn: "9:00 AM", checkOut: "5:30 PM" },
      { name: "Arjun", checkIn: "8:45 AM", checkOut: "6:15 PM" },
      { name: "Noothan", checkIn: "9:15 AM", checkOut: "5:45 PM" }
    ]
  },
  { 
    date: new Date(2025, 4, 28), 
    employees: ["Vasantha kumar", "Gokul", "Noothan"],
    checkInOut: [
      { name: "Harish Venkatesh", checkIn: "9:00 AM", checkOut: "6:00 PM" },
      { name: "Aleesha", checkIn: "8:45 AM", checkOut: "5:45 PM" },
      { name: "Samuel", checkIn: "9:15 AM", checkOut: "6:30 PM" },
      { name: "Samshritha", checkIn: "8:30 AM", checkOut: "5:15 PM" },
      { name: "Vignesh Arulingam", checkIn: "9:00 AM", checkOut: "6:00 PM" },
      { name: "Indhu", checkIn: "8:45 AM", checkOut: "5:30 PM" },
      { name: "Pooja", checkIn: "9:30 AM", checkOut: "6:15 PM" },
      { name: "Gowtham", checkIn: "8:15 AM", checkOut: "5:00 PM" },
      { name: "Afreetha", checkIn: "9:00 AM", checkOut: "5:45 PM" },
      { name: "Sandeep", checkIn: "8:30 AM", checkOut: "6:30 PM" },
      { name: "Preksha", checkIn: "9:15 AM", checkOut: "5:15 PM" },
      { name: "Shri Karthick Adhithya", checkIn: "8:00 AM", checkOut: "6:00 PM" },
      { name: "Thangavel", checkIn: "9:30 AM", checkOut: "5:30 PM" },
      { name: "Juhi", checkIn: "8:45 AM", checkOut: "6:15 PM" },
      { name: "Divya", checkIn: "9:00 AM", checkOut: "5:45 PM" },
      { name: "Siddharth", checkIn: "8:30 AM", checkOut: "6:30 PM" },
      { name: "Prity", checkIn: "9:15 AM", checkOut: "5:15 PM" },
      { name: "Arjun", checkIn: "8:45 AM", checkOut: "6:00 PM" }
    ]
  },
];
