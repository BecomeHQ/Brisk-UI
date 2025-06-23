
import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { teamLeaves } from "@/services/leaves/data";
import { CalendarViewHeader } from "./CalendarViewHeader";
import { CalendarContent } from "./CalendarContent";

export function TeamCalendarView() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  // Get check-in/out and leave data for the selected date
  const selectedDayData = selectedDate 
    ? teamLeaves.find(item => item.date.toDateString() === selectedDate.toDateString())
    : undefined;
  
  // Function to check if a date has data (either leaves or check-ins)
  const hasActivityOnDay = (day: Date) => {
    return teamLeaves.some(item => 
      item.date.toDateString() === day.toDateString() && 
      (item.employees?.length > 0 || item.checkInOut?.length > 0)
    );
  };
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CalendarViewHeader 
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          hasActivityOnDay={hasActivityOnDay}
        />
      </CardHeader>
      
      <Separator className="mb-6" />
      
      <CardContent>
        <CalendarContent
          selectedDate={selectedDate}
          selectedDayData={selectedDayData}
        />
      </CardContent>
    </Card>
  );
}
