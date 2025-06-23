
import { format, isToday } from "date-fns";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { cn } from "@/lib/utils";

interface DateSelectorProps {
  weekDates: Date[];
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  hasActivity: (date: Date) => boolean;
}

export function WeekDateSelector({ weekDates, selectedDate, onDateSelect, hasActivity }: DateSelectorProps) {
  // Format date for day display
  const formatDayDate = (date: Date) => {
    if (isToday(date)) {
      return {
        day: "Today",
        date: format(date, "d")
      };
    }
    return {
      day: format(date, "EEE"),
      date: format(date, "d")
    };
  };

  return (
    <div className="relative">
      <Carousel
        opts={{ loop: false, align: "start" }}
        className="w-full mx-auto px-4"
      >
        <CarouselContent>
          {weekDates.map((date, index) => {
            const formattedDate = formatDayDate(date);
            const isSelected = date.toDateString() === selectedDate.toDateString();
            const hasData = hasActivity(date);
            
            return (
              <CarouselItem key={index} className="basis-1/5 md:basis-1/7 lg:basis-1/7 min-w-[70px]">
                <div 
                  className={cn(
                    "flex flex-col items-center py-3 px-1 rounded-md cursor-pointer transition-all transform hover:scale-105",
                    isSelected 
                      ? "bg-brisk-500 text-white shadow-md" 
                      : hasData 
                        ? "bg-brisk-50 border border-brisk-100" 
                        : "hover:bg-neutral-100 border border-transparent"
                  )}
                  onClick={() => onDateSelect(date)}
                >
                  <span className="text-xs font-medium">{formattedDate.day}</span>
                  <span className={cn(
                    "text-lg font-bold mt-1",
                    isSelected ? "text-white" : hasData ? "text-brisk-600" : ""
                  )}>
                    {formattedDate.date}
                  </span>
                  {hasData && !isSelected && (
                    <div className="w-1.5 h-1.5 rounded-full bg-brisk-500 mt-1"></div>
                  )}
                </div>
              </CarouselItem>
            );
          })}
        </CarouselContent>
        <CarouselPrevious className="absolute -left-2 top-1/2 -translate-y-1/2 border border-neutral-200 h-7 w-7" />
        <CarouselNext className="absolute -right-2 top-1/2 -translate-y-1/2 border border-neutral-200 h-7 w-7" />
      </Carousel>
    </div>
  );
}
