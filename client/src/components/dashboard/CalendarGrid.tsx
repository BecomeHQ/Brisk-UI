
import { useState } from "react";
import { format, isSameDay, isWeekend } from "date-fns";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { eachDayOfInterval } from "date-fns";
import { publicHolidays, getLeaveIcon, leaveTypes, Leave } from "./team-leave/types";
import { employees } from "@/services/employees/data";

interface CalendarGridProps {
  selectedType: string[];
  showAbsentOnly: boolean;
  startDate: Date;
  endDate: Date;
  leaves: Leave[];
  onCellClick: (day: Date, employeeId: string) => void;
}

export function CalendarGrid({
  selectedType,
  showAbsentOnly,
  startDate,
  endDate,
  leaves,
  onCellClick
}: CalendarGridProps) {
  // Generate days for the header
  const daysInRange = eachDayOfInterval({ start: startDate, end: endDate });
  
  // Filter employees based on "show absent only"
  const filteredEmployees = showAbsentOnly 
    ? employees.filter(employee => 
        leaves.some(leave => 
          leave.employeeId === employee.id &&
          selectedType.includes(leave.type) &&
          (leave.startDate <= endDate && leave.endDate >= startDate)
        ))
    : employees;

  // Check if an employee has leave on a specific day
  const hasLeaveOnDay = (employeeId: string, day: Date) => {
    // Check personal leaves
    const employeeLeave = leaves.find(leave => 
      leave.employeeId === employeeId &&
      selectedType.includes(leave.type) &&
      day >= leave.startDate &&
      day <= leave.endDate
    );
    
    if (employeeLeave) return employeeLeave.type;
    
    // Check public holidays
    if (selectedType.includes("holiday") && 
        publicHolidays.some(holiday => isSameDay(holiday.date, day))) {
      return "holiday";
    }
    
    return null;
  };

  // Check if a day is a public holiday
  const isPublicHoliday = (day: Date) => {
    return publicHolidays.some(holiday => isSameDay(holiday.date, day));
  };

  // Get public holiday name if applicable
  const getHolidayName = (day: Date) => {
    const holiday = publicHolidays.find(h => isSameDay(h.date, day));
    return holiday ? holiday.name : null;
  };

  return (
    <div className="overflow-x-auto">
      <div className="min-w-[800px] relative">
        {/* Header with dates */}
        <div className="grid" style={{ gridTemplateColumns: "220px repeat(" + daysInRange.length + ", minmax(45px, 1fr))" }}>
          {/* Empty cell for employee column */}
          <div className="p-3 text-sm font-medium text-neutral-500 border-b border-r border-neutral-200 bg-neutral-50 sticky left-0 z-10">
            Employee
          </div>
          
          {/* Date columns */}
          {daysInRange.map((day, i) => {
            const isWeekendDay = isWeekend(day);
            const isHoliday = isPublicHoliday(day);
            const isToday = isSameDay(day, new Date());
            const holidayName = getHolidayName(day);
            
            return (
              <div 
                key={i}
                className={cn(
                  "p-2 text-center text-xs border-b border-r border-neutral-200",
                  isWeekendDay ? "bg-neutral-50" : "bg-white",
                  isHoliday ? "bg-purple-50" : "",
                  isToday ? "font-bold" : ""
                )}
              >
                <div className={cn(
                  "font-medium",
                  isHoliday ? "text-purple-700" : "",
                  isWeekendDay ? "text-neutral-500" : ""
                )}>
                  {format(day, "EEE")}
                </div>
                <div className={cn(
                  "text-neutral-600",
                  isToday ? "text-brisk-600 bg-brisk-50 rounded-full w-6 h-6 flex items-center justify-center mx-auto" : "",
                  isHoliday ? "text-purple-700" : "",
                  isWeekendDay && !isHoliday ? "text-neutral-500" : ""
                )}>
                  {format(day, "d")}
                </div>
                {isHoliday && holidayName && (
                  <div className="text-[10px] text-purple-700 mt-1 truncate" title={holidayName}>
                    {holidayName}
                  </div>
                )}
              </div>
            );
          })}
        </div>
        
        {/* Employee rows */}
        {filteredEmployees.map((employee) => (
          <div 
            key={employee.id} 
            className="grid border-b border-neutral-200" 
            style={{ gridTemplateColumns: "220px repeat(" + daysInRange.length + ", minmax(45px, 1fr))" }}
          >
            {/* Employee info cell */}
            <div className="p-3 flex items-center gap-3 border-r border-neutral-200 bg-white sticky left-0 z-10">
              <Avatar className="h-8 w-8">
                <AvatarFallback>{employee.name.substring(0, 2)}</AvatarFallback>
              </Avatar>
              <div className="truncate">
                <div className="font-medium text-sm">{employee.name}</div>
                <div className="text-xs text-neutral-500">{employee.department}</div>
              </div>
            </div>
            
            {/* Day cells with leave indicators */}
            {daysInRange.map((day, dayIndex) => {
              const leaveType = hasLeaveOnDay(employee.id, day);
              const isWeekendDay = isWeekend(day);
              const isHoliday = isPublicHoliday(day);
              
              // Check if this is the start of a multi-day leave
              const isLeaveStart = leaveType && 
                (dayIndex === 0 || hasLeaveOnDay(employee.id, daysInRange[dayIndex - 1]) !== leaveType);
              
              // Calculate how many days this leave spans
              let leaveSpan = 0;
              if (isLeaveStart && leaveType) {
                for (let i = dayIndex; i < daysInRange.length; i++) {
                  if (hasLeaveOnDay(employee.id, daysInRange[i]) === leaveType) {
                    leaveSpan++;
                  } else {
                    break;
                  }
                }
              }
              
              // Get the color for this leave type
              const typeColor = leaveType ? 
                leaveTypes.find(t => t.id === leaveType)?.color : "";
              
              return (
                <div 
                  key={dayIndex}
                  className={cn(
                    "h-14 border-r border-neutral-200 relative",
                    isWeekendDay ? "bg-neutral-50" : "bg-white",
                    isHoliday && !leaveType ? "bg-purple-50/40" : "",
                    !leaveType ? "cursor-pointer hover:bg-neutral-50" : "cursor-pointer"
                  )}
                  onClick={() => onCellClick(day, employee.id)}
                >
                  {leaveType && isLeaveStart && (
                    <div 
                      className={cn(
                        "absolute top-1/2 -translate-y-1/2 h-8 rounded-md px-2 flex items-center text-xs",
                        typeColor,
                        "cursor-pointer hover:opacity-90 shadow-sm"
                      )}
                      style={{ 
                        left: '4px', 
                        width: `calc(${leaveSpan} * 100% - 8px)`,
                        maxWidth: `calc(${leaveSpan} * 100% - 8px)`,
                        zIndex: 5
                      }}
                      onClick={(e) => {
                        e.stopPropagation(); // Stop propagation to prevent double handling
                        onCellClick(day, employee.id);
                      }}
                    >
                      <span className="truncate whitespace-nowrap">
                        {getLeaveIcon(leaveType)}
                        {leaveSpan > 2 && (
                          <span className="ml-1">{leaveTypes.find(t => t.id === leaveType)?.label || ""}</span>
                        )}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
        
        {filteredEmployees.length === 0 && (
          <div className="p-8 text-center text-neutral-500">
            No employees match the current filter criteria
          </div>
        )}
      </div>
    </div>
  );
}
