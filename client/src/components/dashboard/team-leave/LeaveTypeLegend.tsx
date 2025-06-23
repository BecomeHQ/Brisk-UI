
import React, { useState } from "react";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { LeaveType, leaveTypes } from "./types";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

interface LeaveTypeLegendProps {
  title?: string;
  collapsible?: boolean;
  initialCollapsed?: boolean;
  maxVisible?: number;
  leaveTypes?: LeaveType[];
  className?: string;
  badgeClassName?: string;
}

export function LeaveTypeLegend({
  title = "Leave Types Legend",
  collapsible = true,
  initialCollapsed = true,
  maxVisible = 6,
  leaveTypes: customTypes,
  className,
  badgeClassName,
}: LeaveTypeLegendProps) {
  const [isExpanded, setIsExpanded] = useState(!initialCollapsed);
  
  // Use provided leave types or default to the global ones
  const types = customTypes || leaveTypes;
  
  // Calculate how many items to show in collapsed state
  const displayedTypes = collapsible && !isExpanded 
    ? types.slice(0, maxVisible) 
    : types;
  
  const hasMoreTypes = collapsible && types.length > maxVisible;
  
  return (
    <div className={cn("px-4 py-4 border-t border-neutral-200 bg-neutral-50 rounded-b-lg", className)}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-neutral-700">{title}</span>
        {collapsible && hasMoreTypes && (
          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-2 text-xs hover:bg-neutral-200"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? (
              <>
                Show Less <ChevronUp className="ml-1 h-3 w-3" />
              </>
            ) : (
              <>
                Show All <ChevronDown className="ml-1 h-3 w-3" />
              </>
            )}
          </Button>
        )}
      </div>
      
      <ScrollArea className={cn("max-h-[240px]", isExpanded ? "" : "max-h-[120px]")}>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
          {displayedTypes.map((type) => (
            <div 
              key={type.id} 
              className={cn(
                "flex items-center gap-2 p-2 rounded-md border transition-all hover:shadow-sm",
                type.color.includes("bg-") ? type.color : "",
                badgeClassName
              )}
            >
              <div className="text-lg flex-shrink-0">{type.icon}</div>
              <span className="text-xs font-medium whitespace-nowrap overflow-hidden text-ellipsis">
                {type.label}
              </span>
            </div>
          ))}
        </div>
      </ScrollArea>
      
      {collapsible && !isExpanded && hasMoreTypes && (
        <div className="mt-2 text-center text-xs text-neutral-500">
          and {types.length - maxVisible} more types...
        </div>
      )}
    </div>
  );
}
