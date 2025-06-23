
import { TeamLeaveEntry } from "./types";
import { EmployeesOnLeave } from "./EmployeesOnLeave";
import { CheckInOutActivity } from "./CheckInOutActivity";

interface CalendarContentProps {
  selectedDate: Date | undefined;
  selectedDayData: TeamLeaveEntry | undefined;
}

export function CalendarContent({ selectedDate, selectedDayData }: CalendarContentProps) {
  return (
    <>
      {selectedDate ? (
        <div className="space-y-8">
          {/* Employees on Leave Section */}
          <EmployeesOnLeave selectedDayData={selectedDayData} />
          
          {/* Check-in/out Activity Section */}
          <CheckInOutActivity selectedDayData={selectedDayData} />
        </div>
      ) : (
        <div className="text-center py-8 text-neutral-500">
          Select a date to view team absence and check-in/out data
        </div>
      )}
    </>
  );
}
