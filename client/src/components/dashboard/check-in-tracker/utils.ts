
import { format, subDays, isToday, isYesterday, addDays, startOfWeek, eachDayOfInterval } from "date-fns";

// Function to get working hours
export const getWorkingHours = (checkIn: string, checkOut: string) => {
  if (!checkIn || !checkOut) return 0;
  const hours = parseFloat(calculateHours(checkIn, checkOut).split('h')[0]);
  return hours;
};

// Function to get status color based on hours
export const getStatusColor = (hours: number) => {
  if (hours > 10) return "bg-warning";
  if (hours >= 8) return "bg-success";
  return "bg-brisk-300";
};

// Function to get text color based on hours
export const getTextColor = (hours: number) => {
  if (hours > 10) return "text-warning";
  if (hours >= 8) return "text-success";
  return "text-brisk-500";
};

// Format date display
export const getDateDisplay = (date: Date) => {
  if (isToday(date)) return "Today";
  if (isYesterday(date)) return "Yesterday";
  return format(date, "MMMM d, yyyy");
};

// Get current week dates
export const getWeekDates = (date: Date) => {
  const start = startOfWeek(date, { weekStartsOn: 1 }); // Start from Monday
  return eachDayOfInterval({
    start,
    end: addDays(start, 6)
  });
};

// Convert check-in/out data to timeline format
export const convertToTimelineItems = (data: any[], selectedDate: Date) => {
  return data.map(item => ({
    date: selectedDate.toISOString(),
    action: `${item.name} checked in at ${item.checkIn} and checked out at ${item.checkOut}`,
    hours: getWorkingHours(item.checkIn, item.checkOut)
  }));
};

// Convert time string to percentage position on timeline
export const timeToPosition = (timeString: string) => {
  const [hourStr, minuteStr] = timeString.replace(/\s*(AM|PM).*/, '').split(':');
  let hour = parseInt(hourStr);
  const minute = parseInt(minuteStr);
  
  if (timeString.includes('PM') && hour !== 12) {
    hour += 12;
  }
  if (timeString.includes('AM') && hour === 12) {
    hour = 0;
  }
  
  // Timeline starts at 8AM (8 hours) and spans to 8PM (20 hours)
  const position = ((hour + minute / 60) - 8) / 12 * 100;
  return Math.max(0, Math.min(100, position));
};

// Calculate hours between check-in and check-out
export const calculateHours = (checkIn: string, checkOut: string): string => {
  const convertTimeToMinutes = (time: string) => {
    const [hoursPart, minutesPart] = time.split(':');
    const isPM = time.includes('PM') && !time.includes('12:');
    const isAM12 = time.includes('12:') && time.includes('AM');
    
    let hours = parseInt(hoursPart);
    if (isPM) hours += 12;
    if (isAM12) hours = 0;
    
    const minutes = parseInt(minutesPart);
    return hours * 60 + minutes;
  };

  const checkInMinutes = convertTimeToMinutes(checkIn);
  const checkOutMinutes = convertTimeToMinutes(checkOut);
  
  const totalMinutes = checkOutMinutes - checkInMinutes;
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  
  return `${hours}h ${minutes}m`;
};
