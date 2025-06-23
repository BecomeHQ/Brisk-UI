
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { format, subDays, isToday, addDays } from "date-fns";
import { teamLeaves } from "@/services/leaves/data";
import { ActivityTimeline } from "../../employees/ActivityTimeline";
import { CheckInHeader } from "./CheckInHeader";
import { WeekDateSelector } from "./WeekDateSelector";
import { SelectedDateHeader } from "./SelectedDateHeader";
import { CheckInList } from "./CheckInList";
import { EmptyState } from "./EmptyState";
import { 
  getWeekDates, 
  getDateDisplay, 
  convertToTimelineItems 
} from "./utils";

export function DailyCheckInOutTracker() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"list" | "timeline">("timeline");
  const [calendarView, setCalendarView] = useState<"day" | "week">("week");
  const [weekDates, setWeekDates] = useState<Date[]>(getWeekDates(selectedDate));
  
  // Update week dates when selected date changes
  useEffect(() => {
    if (calendarView === "week") {
      setWeekDates(getWeekDates(selectedDate));
    }
  }, [selectedDate, calendarView]);
  
  // Get check-in/out data for the selected date
  const checkInOutData = teamLeaves.find(item => item.date.toDateString() === selectedDate.toDateString())?.checkInOut || [];
  
  // Previous day handler
  const goToPreviousDay = () => {
    if (calendarView === "day") {
      setSelectedDate(prev => subDays(prev, 1));
    } else {
      // For week view, go to previous week
      setSelectedDate(prev => subDays(prev, 7));
    }
  };
  
  // Next day handler 
  const goToNextDay = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (calendarView === "day") {
      if (selectedDate < tomorrow) {
        setSelectedDate(prev => addDays(prev, 1));
      }
    } else {
      // For week view, limit to current week
      const lastAllowedDay = new Date();
      if (weekDates[0] <= lastAllowedDay) {
        setSelectedDate(prev => addDays(prev, 7));
      }
    }
  };
  
  // Handle date select from popover calendar
  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
      setCalendarOpen(false);
    }
  };
  
  // Check if a date has activity
  const hasActivity = (date: Date) => {
    return teamLeaves.some(item => item.date.toDateString() === date.toDateString() && item.checkInOut.length > 0);
  };
  
  // Toggle view mode
  const toggleViewMode = (checked: boolean) => {
    setViewMode(checked ? "timeline" : "list");
  };
  
  return (
    <Card className="shadow-sm border border-neutral-200">
      <CardHeader className="p-0">
        <CheckInHeader 
          selectedDate={selectedDate}
          calendarView={calendarView}
          viewMode={viewMode}
          calendarOpen={calendarOpen}
          weekDates={weekDates}
          onPreviousDay={goToPreviousDay}
          onNextDay={goToNextDay}
          onCalendarViewChange={(value) => setCalendarView(value)}
          onViewModeChange={toggleViewMode}
          onCalendarOpenChange={setCalendarOpen}
          onDateSelect={handleDateSelect}
          isNextDayDisabled={(calendarView === "day" && isToday(selectedDate))}
          getDateDisplay={getDateDisplay}
        />
      </CardHeader>
      
      <CardContent className="p-0">
        {/* Horizontal date carousel */}
        {calendarView === "week" && (
          <div className="px-6 py-4 border-b border-neutral-100">
            <WeekDateSelector 
              weekDates={weekDates}
              selectedDate={selectedDate}
              onDateSelect={setSelectedDate}
              hasActivity={hasActivity}
            />
          </div>
        )}
        
        <div className="py-5">
          {/* Selected date information */}
          <SelectedDateHeader 
            selectedDate={selectedDate} 
            employeeCount={checkInOutData.length} 
          />
          
          <div className="mt-6">
            {checkInOutData.length > 0 ? (
              viewMode === "list" ? (
                <CheckInList checkInOutData={checkInOutData} />
              ) : (
                <div className="px-6">
                  <ActivityTimeline activities={convertToTimelineItems(checkInOutData, selectedDate)} />
                </div>
              )
            ) : (
              <EmptyState />
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
