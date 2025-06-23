
import { Badge } from "@/components/ui/badge";
import { Calendar, ChevronDown, ChevronRight, Clock } from "lucide-react";
import { calculateHours, calculateTimePosition } from "./TimelineUtils";
import { CheckInOutData } from "./types";
import { format } from "date-fns";
import { useState } from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface ActivityTimelineProps {
  date?: Date;
  checkInOutData: CheckInOutData[];
}

export function ActivityTimeline({
  date,
  checkInOutData
}: ActivityTimelineProps) {
  const [expandedItems, setExpandedItems] = useState<number[]>([]);

  const toggleExpand = (index: number) => {
    setExpandedItems(prevState => {
      if (prevState.includes(index)) {
        return prevState.filter(i => i !== index);
      } else {
        return [...prevState, index];
      }
    });
  };

  if (!checkInOutData || checkInOutData.length === 0) {
    return (
      <div className="bg-white p-5 rounded-md border border-brisk-100 shadow-sm text-center py-8">
        <p className="text-neutral-500">No activity data available for this day.</p>
      </div>
    );
  }

  const formattedDate = date ? format(date, "EEE, MMM d, yyyy") : "";

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-sm font-medium text-brisk-700">
        <Clock size={16} />
        <span>Check-in/Check-out Timeline</span>
        {date && (
          <span className="ml-2 text-xs bg-brisk-50 px-2 py-1 rounded-full text-brisk-600 flex items-center gap-1">
            <Calendar size={12} />
            {formattedDate}
          </span>
        )}
      </div>
      
      <div className="space-y-4">
        {checkInOutData.map((item, index) => (
          <Collapsible 
            key={index} 
            open={expandedItems.includes(index)}
            onOpenChange={() => toggleExpand(index)}
            className="bg-white rounded-md border border-brisk-100 shadow-sm overflow-hidden"
          >
            <CollapsibleTrigger asChild>
              <div className="flex justify-between items-center p-4 cursor-pointer hover:bg-brisk-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="text-brisk-600">
                    {expandedItems.includes(index) ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                  </div>
                  <Badge variant="outline" className="bg-brisk-50 text-brisk-700 font-medium border-brisk-200 px-3 py-1">
                    {item.name}
                  </Badge>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-medium bg-brisk-50 px-2.5 py-1.5 rounded-full text-brisk-700">
                    {calculateHours(item.checkIn, item.checkOut)}
                  </span>
                  {date && <span className="text-xs text-neutral-500">{formattedDate}</span>}
                </div>
              </div>
            </CollapsibleTrigger>
            
            <CollapsibleContent>
              <div className="p-5 pt-2 border-t border-brisk-100">
                <div className="relative mt-8 mb-2">
                  {/* Timeline bar */}
                  <div className="h-12 bg-neutral-100 rounded-lg relative">
                    {/* Active period bar */}
                    <div 
                      className="absolute inset-y-0 bg-gradient-to-r from-brisk-300 to-brisk-400 rounded-md" 
                      style={{
                        left: `${calculateTimePosition(item.checkIn)}%`,
                        width: `${Math.max(5, calculateTimePosition(item.checkOut) - calculateTimePosition(item.checkIn))}%`
                      }}
                    />
                    
                    {/* Timeline markers */}
                    <div 
                      className="absolute -top-6 flex flex-col items-center" 
                      style={{
                        left: `${calculateTimePosition(item.checkIn)}%`,
                        transform: 'translateX(-50%)'
                      }}
                    >
                      <span className="text-xs font-medium text-brisk-700 mb-1 whitespace-nowrap">
                        {item.checkIn}
                      </span>
                      <div className="w-3 h-3 bg-brisk-500 rounded-full shadow-sm"></div>
                    </div>
                    
                    <div 
                      className="absolute -top-6 flex flex-col items-center" 
                      style={{
                        left: `${calculateTimePosition(item.checkOut)}%`,
                        transform: 'translateX(-50%)'
                      }}
                    >
                      <span className="text-xs font-medium text-brisk-700 mb-1 whitespace-nowrap">
                        {item.checkOut}
                      </span>
                      <div className="w-3 h-3 bg-brisk-700 rounded-full shadow-sm"></div>
                    </div>
                  </div>
                  
                  {/* Working hours scale */}
                  <div className="mt-6 pt-2 flex justify-between border-t border-neutral-200">
                    <span className="text-[10px] text-neutral-500">8AM</span>
                    <span className="text-[10px] text-neutral-500">10AM</span>
                    <span className="text-[10px] text-neutral-500">12PM</span>
                    <span className="text-[10px] text-neutral-500">2PM</span>
                    <span className="text-[10px] text-neutral-500">4PM</span>
                    <span className="text-[10px] text-neutral-500">6PM</span>
                    <span className="text-[10px] text-neutral-500">8PM</span>
                  </div>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>
        ))}
      </div>
    </div>
  );
}
