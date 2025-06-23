
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format, isToday, isYesterday } from "date-fns";
import { CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface CalendarViewHeaderProps {
  selectedDate: Date | undefined;
  setSelectedDate: (date: Date | undefined) => void;
  hasActivityOnDay: (day: Date) => boolean;
}

export function CalendarViewHeader({ selectedDate, setSelectedDate, hasActivityOnDay }: CalendarViewHeaderProps) {
  const [calendarOpen, setCalendarOpen] = useState(false);
  
  const goToPreviousDay = () => {
    if (selectedDate) {
      const newDate = new Date(selectedDate);
      newDate.setDate(newDate.getDate() - 1);
      setSelectedDate(newDate);
    }
  };
  
  const goToNextDay = () => {
    if (selectedDate) {
      const newDate = new Date(selectedDate);
      newDate.setDate(newDate.getDate() + 1);
      setSelectedDate(newDate);
    }
  };
  
  const getDateDisplay = (date: Date | undefined) => {
    if (!date) return "No date selected";
    if (isToday(date)) return "Today";
    if (isYesterday(date)) return "Yesterday";
    return format(date, "MMMM d, yyyy");
  };

  return (
    <div className="flex items-center justify-between pb-2">
      <span className="text-lg font-medium">Team Calendar</span>
      <div className="flex items-center space-x-2">
        <Button variant="outline" size="icon" className="h-8 w-8" onClick={goToPreviousDay}>
          <ChevronLeft size={16} />
        </Button>
        
        <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="h-8 text-sm font-medium px-2 flex items-center gap-1">
              <span>{getDateDisplay(selectedDate)}</span>
              <CalendarIcon size={14} />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="center">
            <Calendar 
              mode="single" 
              selected={selectedDate} 
              onSelect={(date) => {
                setSelectedDate(date);
                setCalendarOpen(false);
              }} 
              className={cn("p-3 pointer-events-auto")} 
              modifiers={{
                hasActivity: hasActivityOnDay
              }} 
              modifiersStyles={{
                hasActivity: {
                  fontWeight: "bold",
                  textDecoration: "underline",
                  textDecorationColor: "#3b82f6"
                }
              }}
            />
          </PopoverContent>
        </Popover>
        
        <Button variant="outline" size="icon" className="h-8 w-8" onClick={goToNextDay}>
          <ChevronRight size={16} />
        </Button>
      </div>
    </div>
  );
}
