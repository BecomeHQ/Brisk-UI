
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { CalendarCheck } from "lucide-react";
import { TeamLeaveEntry } from "./types";

interface EmployeesOnLeaveProps {
  selectedDayData: TeamLeaveEntry | undefined;
}

export function EmployeesOnLeave({ selectedDayData }: EmployeesOnLeaveProps) {
  return (
    <div>
      <h3 className="text-sm text-neutral-500 mb-3 font-medium">Employees on Leave ({selectedDayData?.employees?.length || 0})</h3>
      {selectedDayData?.employees && selectedDayData.employees.length > 0 ? (
        <div className="space-y-3">
          {selectedDayData.employees.map((employee, index) => (
            <div key={index} className="flex items-center gap-3 border-b border-neutral-100 pb-3">
              <Avatar className="h-8 w-8">
                <AvatarFallback>{employee.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium">{employee}</div>
                <div className="text-xs text-neutral-500 flex items-center gap-1.5">
                  <CalendarCheck size={12} />
                  <span>On Leave - Full day</span>
                </div>
              </div>
              <Badge variant="outline" className="ml-auto bg-green-50 text-green-700 border-green-200">
                Full day
              </Badge>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-4 text-neutral-500 bg-neutral-50 rounded-md">
          No employees on leave for this date
        </div>
      )}
    </div>
  );
}
