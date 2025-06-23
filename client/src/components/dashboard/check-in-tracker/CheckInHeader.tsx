
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { format } from "date-fns";
import { CalendarView } from "../calendar/CalendarView";

interface CheckInHeaderProps {
  selectedDate: Date;
  calendarView: "day" | "week";
  viewMode: "list" | "timeline";
  calendarOpen: boolean;
  weekDates: Date[];
  onPreviousDay: () => void;
  onNextDay: () => void;
  onCalendarViewChange: (value: "day" | "week") => void;
  onViewModeChange: (checked: boolean) => void;
  onCalendarOpenChange: (open: boolean) => void;
  onDateSelect: (date: Date | undefined) => void;
  isNextDayDisabled: boolean;
  getDateDisplay: (date: Date) => string;
}

export function CheckInHeader({
  selectedDate,
  calendarView,
  viewMode,
  calendarOpen,
  weekDates,
  onPreviousDay,
  onNextDay,
  onCalendarViewChange,
  onViewModeChange,
  onCalendarOpenChange,
  onDateSelect,
  isNextDayDisabled,
  getDateDisplay
}: CheckInHeaderProps) {
  return (
    <div className="flex flex-row items-center justify-between pb-2 pt-5 px-6">
      <div className="text-lg font-medium">Employee Check-In/Out</div>
      <div className="flex items-center space-x-2">
        <Tabs value={calendarView} onValueChange={(v) => onCalendarViewChange(v as "day" | "week")}>
          <TabsList className="h-8">
            <TabsTrigger value="day" className="text-xs px-3 h-7">Day</TabsTrigger>
            <TabsTrigger value="week" className="text-xs px-3 h-7">Week</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onPreviousDay}>
          <ChevronLeft size={16} />
        </Button>
        
        <Popover open={calendarOpen} onOpenChange={onCalendarOpenChange}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="h-9 text-sm font-medium px-3 flex items-center gap-1">
              {calendarView === "day" ? (
                <span>{getDateDisplay(selectedDate)}</span>
              ) : (
                <span>{format(weekDates[0], "MMM d")} - {format(weekDates[6], "MMM d")}</span>
              )}
              <CalendarIcon size={16} />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="center">
            <CalendarView 
              date={selectedDate} 
              onSelect={onDateSelect} 
              hasLeaves={() => false}
            />
          </PopoverContent>
        </Popover>
        
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8" 
          onClick={onNextDay} 
          disabled={isNextDayDisabled}
        >
          <ChevronRight size={16} />
        </Button>

        <div className="flex items-center ml-4">
          <span className="text-sm mr-2">Timeline</span>
          <Switch 
            checked={viewMode === "timeline"} 
            onCheckedChange={checked => onViewModeChange(checked)} 
            className="scale-90" 
          />
        </div>
      </div>
    </div>
  );
}
