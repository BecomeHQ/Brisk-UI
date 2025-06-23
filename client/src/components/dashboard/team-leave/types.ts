import { format } from "date-fns";

// Leave types with color coding
export const leaveTypes = [
  {
    id: "holiday",
    label: "Public Holidays",
    color: "bg-purple-100 border-purple-300 text-purple-700",
    icon: "📅",
  },
  {
    id: "restricted",
    label: "Restricted Holidays",
    color: "bg-orange-100 border-orange-300 text-orange-700",
    icon: "✨",
  },
  {
    id: "sick",
    label: "Sick Leaves",
    color: "bg-yellow-100 border-yellow-300 text-yellow-700",
    icon: "🤧",
  },
  {
    id: "burnout",
    label: "Burn Out Leaves",
    color: "bg-rose-100 border-rose-300 text-rose-700",
    icon: "😵‍💫",
  },
  {
    id: "casual",
    label: "Open Casual Leaves",
    color: "bg-blue-100 border-blue-300 text-blue-700",
    icon: "💤",
  },
  {
    id: "menstrual",
    label: "Menstrual Leaves",
    color: "bg-pink-100 border-pink-300 text-pink-700",
    icon: "🙋‍♀️",
  },
  {
    id: "maternity",
    label: "Maternity Leaves",
    color: "bg-fuchsia-100 border-fuchsia-300 text-fuchsia-700",
    icon: "🤰",
  },
  {
    id: "paternity",
    label: "Paternity Leaves",
    color: "bg-amber-100 border-amber-300 text-amber-700",
    icon: "👨‍🍼",
  },
  {
    id: "bereavement",
    label: "Bereavement Leave",
    color: "bg-indigo-100 border-indigo-300 text-indigo-700",
    icon: "🧑‍🤝‍🧑",
  },
  {
    id: "unpaid",
    label: "Leave Without Pay",
    color: "bg-gray-100 border-gray-300 text-gray-700",
    icon: "💸",
  },
  {
    id: "compensatory",
    label: "Compensatory Leaves",
    color: "bg-teal-100 border-teal-300 text-teal-700",
    icon: "🌀",
  },
  {
    id: "wfh",
    label: "Work From Home",
    color: "bg-emerald-100 border-emerald-300 text-emerald-700",
    icon: "🏡",
  },
  {
    id: "internship",
    label: "Internship Leaves",
    color: "bg-lime-100 border-lime-300 text-lime-700",
    icon: "🎓",
  },
];

// Define the Leave interface
export interface Leave {
  employeeId: string;
  type: string;
  startDate: Date;
  endDate: Date;
}

// Mock leave data - removed all vacation entries

// Public holidays (for all employees)
export const publicHolidays = [
  { name: "Memorial Day", date: new Date(2025, 4, 26) },
];

export interface LeaveType {
  id: string;
  label: string;
  color: string;
  icon: string;
}

export interface PublicHoliday {
  name: string;
  date: Date;
}

export interface CalendarViewProps {
  calendarView: "week" | "2weeks";
  selectedType: string[];
  showAbsentOnly: boolean;
  startDate: Date;
  endDate: Date;
}

// Get the leave type icon
export const getLeaveIcon = (type: string): string => {
  return leaveTypes.find((t) => t.id === type)?.icon || "";
};

// Format date range for display
export const formatDateRange = (startDate: Date, endDate: Date): string => {
  return `${format(startDate, "MMM d")} - ${format(endDate, "MMM d")}`;
};
