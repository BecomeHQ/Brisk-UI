
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Clock } from "lucide-react";
import { TeamLeaveEntry } from "./types";
import { calculateHours } from "./TimelineUtils";

interface CheckInOutActivityProps {
  selectedDayData: TeamLeaveEntry | undefined;
}

export function CheckInOutActivity({ selectedDayData }: CheckInOutActivityProps) {
  // Function to get working hours
  const getWorkingHours = (checkIn: string, checkOut: string) => {
    if (!checkIn || !checkOut) return null;
    return parseFloat(calculateHours(checkIn, checkOut).split('h')[0]);
  };

  // Function to get status color based on hours
  const getStatusColor = (hours: number | null) => {
    if (hours === null) return "bg-neutral-200";
    if (hours > 10) return "bg-red-500";
    if (hours > 8) return "bg-yellow-500";
    return "bg-green-500";
  };
  
  return (
    <div>
      <h3 className="text-sm text-neutral-500 mb-3 font-medium">Check In/Out Activity ({selectedDayData?.checkInOut?.length || 0})</h3>
      {selectedDayData?.checkInOut && selectedDayData.checkInOut.length > 0 ? (
        <div className="space-y-3">
          {selectedDayData.checkInOut.map((item, index) => {
            const hours = getWorkingHours(item.checkIn, item.checkOut);
            
            return (
              <div key={index} className="flex items-center gap-3 border-b border-neutral-100 pb-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>{item.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{item.name}</div>
                  <div className="text-xs text-neutral-500 flex items-center gap-1.5">
                    <Clock size={12} />
                    <span>{item.checkIn} - {item.checkOut}</span>
                  </div>
                </div>
                {hours && (
                  <div className={`ml-auto text-sm font-medium flex items-center gap-1.5 ${
                    hours > 10 
                      ? "text-red-600" 
                      : hours > 8 
                      ? "text-yellow-600" 
                      : "text-green-600"
                  }`}>
                    <Clock size={14} />
                    <span>{hours}h</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-4 text-neutral-500 bg-neutral-50 rounded-md">
          No check-in/out data for this date
        </div>
      )}
    </div>
  );
}
