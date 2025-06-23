
// Utility functions for timeline calculations

// Calculate work hours from check-in to check-out
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

  const cleanCheckIn = checkIn.replace(/\s*(AM|PM)/, '');
  const cleanCheckOut = checkOut.replace(/\s*(AM|PM)/, '');
  
  const checkInMinutes = convertTimeToMinutes(checkIn);
  const checkOutMinutes = convertTimeToMinutes(checkOut);
  
  const totalMinutes = checkOutMinutes - checkInMinutes;
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  
  return `${hours}h ${minutes}m`;
};

// Calculate position percentage for check-in/out times (8AM to 8PM = 12 hours)
export const calculateTimePosition = (time: string): number => {
  const convertTimeToHours = (timeStr: string) => {
    const [hoursPart, minutesPart] = timeStr.split(':');
    let hours = parseInt(hoursPart);
    const minutes = parseInt(minutesPart.replace(/\s*(AM|PM).*/, ''));
    
    if (timeStr.includes('PM') && hours !== 12) {
      hours += 12;
    }
    if (timeStr.includes('AM') && hours === 12) {
      hours = 0;
    }
    
    return hours + (minutes / 60);
  };

  const timeInHours = convertTimeToHours(time);
  // Calculate position percentage (from 8AM to 8PM = 12 working hours)
  const startHour = 8; // 8AM
  const totalHours = 12; // 12 hours (8AM to 8PM)
  
  // Calculate percentage position
  const position = ((timeInHours - startHour) / totalHours) * 100;
  return Math.max(0, Math.min(100, position)); // Clamp between 0-100%
};

// Helper function to format date for comparison
export const formatDate = (date: Date): string => {
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
};
