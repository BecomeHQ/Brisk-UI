import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { useState } from "react";
import { CalendarView } from "./calendar/CalendarView";
import { formatDate } from "./calendar/TimelineUtils";
import { TeamLeaveEntry } from "./calendar/types";
import { teamLeaves } from "@/services/leaves/data";
import { format } from "date-fns";
import { ActivityTimeline } from "./calendar/ActivityTimeline";
import { Clock, User } from "lucide-react";

export function LeaveCalendar() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedDay, setSelectedDay] = useState<TeamLeaveEntry | undefined>(
    teamLeaves.find(
      (leave) => formatDate(leave.date) === formatDate(new Date())
    )
  );

  // Function to check if a day has leaves
  const hasLeaves = (day: Date) => {
    return teamLeaves.some(
      (leave) => formatDate(leave.date) === formatDate(day)
    );
  };

  // Function to select a day and find any leave data for it
  const handleSelectDay = (day: Date | undefined) => {
    setDate(day);
    if (day) {
      const selectedLeaveData = teamLeaves.find(
        (leave) => formatDate(leave.date) === formatDate(day)
      );
      setSelectedDay(selectedLeaveData);
    } else {
      setSelectedDay(undefined);
    }
  };

  return (
    <Card className="p-6">
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="w-full lg:w-1/2">
          <h2 className="text-lg font-medium mb-4">Team Leave Calendar</h2>
          <CalendarView
            date={date}
            onSelect={handleSelectDay}
            hasLeaves={hasLeaves}
          />
        </div>
        <div className="w-full lg:w-1/2">
          <h2 className="text-lg font-medium mb-4">
            {selectedDay
              ? format(selectedDay.date, "MMMM d, yyyy")
              : "No date selected"}
          </h2>
          {selectedDay ? (
            <div className="space-y-6">
              {selectedDay.employees && selectedDay.employees.length > 0 && (
                <div>
                  <h3 className="text-sm text-neutral-500 mb-3">
                    Team Members on Leave
                  </h3>
                  <div className="space-y-3">
                    {selectedDay.employees.map((employee, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src="/placeholder.svg" alt={employee} />
                          <AvatarFallback>
                            {employee.substring(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{employee}</div>
                          <div className="text-sm text-neutral-500">
                            On Leave
                          </div>
                        </div>
                        <Badge variant="outline" className="ml-auto">
                          Full day
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedDay.checkInOut && selectedDay.checkInOut.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-sm text-neutral-500 mb-3">
                    Check In/Out Activity
                  </h3>
                  <div className="space-y-3">
                    {selectedDay.checkInOut.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between border-b border-neutral-100 pb-3"
                      >
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage
                              src="/placeholder.svg"
                              alt={item.name}
                            />
                            <AvatarFallback>
                              {item.name.substring(0, 2)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{item.name}</div>
                            <div className="text-xs text-neutral-500 flex items-center gap-1.5">
                              <Clock size={12} />
                              {item.checkIn} - {item.checkOut}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8 text-neutral-500">
              Select a date to view team leave and check-in/out data
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
