import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarIcon, Check, Filter, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { leaveTypes, formatDateRange } from "./types";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface CalendarHeaderProps {
  selectedType: string[];
  setSelectedType: React.Dispatch<React.SetStateAction<string[]>>;
  showAbsentOnly: boolean;
  setShowAbsentOnly: React.Dispatch<React.SetStateAction<boolean>>;
  calendarView: "week" | "2weeks";
  setCalendarView: React.Dispatch<React.SetStateAction<"week" | "2weeks">>;
  startDate: Date;
  endDate: Date;
  setDate: React.Dispatch<React.SetStateAction<Date | undefined>>;
}

export function CalendarHeader({
  selectedType,
  setSelectedType,
  showAbsentOnly,
  setShowAbsentOnly,
  calendarView,
  setCalendarView,
  startDate,
  endDate,
  setDate,
}: CalendarHeaderProps) {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Calculate how many leave types are currently selected
  const selectedCount = selectedType.length;
  const totalCount = leaveTypes.length;

  // Function to select all leave types
  const selectAll = () => {
    setSelectedType(leaveTypes.map((t) => t.id));
  };

  // Function to clear all selections
  const clearAll = () => {
    setSelectedType([]);
  };

  return (
    <div className="p-4 border-b border-neutral-200 bg-white">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <h2 className="text-lg font-medium">Team Leave Calendar</h2>

        {/* Filter bar */}
        <div className="flex flex-wrap gap-2 items-center">
          {/* Leave type filter */}
          <AlertDialog open={isFilterOpen} onOpenChange={setIsFilterOpen}>
            <AlertDialogTrigger asChild>
              <Button
                variant={selectedCount < totalCount ? "default" : "outline"}
                className="h-8 px-2 text-xs"
                onClick={() => setIsFilterOpen(true)}
              >
                <Filter className="mr-1 h-3 w-3" />
                Leave Types
                <Badge className="ml-1 h-4 text-[10px]">
                  {selectedCount}/{totalCount}
                </Badge>
                {selectedCount < totalCount && (
                  <Badge
                    variant="secondary"
                    className="ml-1 h-4 text-[10px] bg-yellow-100 text-yellow-800"
                  >
                    Filtered
                  </Badge>
                )}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="max-w-md max-h-[80vh] overflow-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium">Leave Types</h3>
                <X
                  className="h-4 w-4 cursor-pointer opacity-70 hover:opacity-100"
                  onClick={() => setIsFilterOpen(false)}
                />
              </div>

              <div className="flex items-center justify-between mb-2">
                <div className="text-sm text-neutral-500">
                  {selectedCount} of {totalCount} selected
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 text-xs"
                    onClick={selectAll}
                  >
                    Select All
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 text-xs"
                    onClick={clearAll}
                  >
                    Clear
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-1 mt-4">
                {leaveTypes.map((type) => (
                  <div
                    key={type.id}
                    className={cn(
                      "flex items-center justify-between p-2 rounded-md cursor-pointer hover:bg-neutral-50",
                      selectedType.includes(type.id) ? type.color : ""
                    )}
                    onClick={() => {
                      setSelectedType((prev) =>
                        prev.includes(type.id)
                          ? prev.filter((t) => t !== type.id)
                          : [...prev, type.id]
                      );
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <div className="text-lg">{type.icon}</div>
                      <span>{type.label}</span>
                    </div>
                    {selectedType.includes(type.id) && (
                      <Check className="h-4 w-4" />
                    )}
                  </div>
                ))}
              </div>

              <div className="flex justify-end gap-2 mt-4">
                <Button
                  variant="default"
                  onClick={() => setIsFilterOpen(false)}
                  className="w-full"
                >
                  Apply Filters
                </Button>
              </div>
            </AlertDialogContent>
          </AlertDialog>

          {/* Show absent only toggle */}

          {/* View selector */}
          <ToggleGroup
            type="single"
            value={calendarView}
            onValueChange={(value) =>
              value && setCalendarView(value as "week" | "2weeks")
            }
          >
            <ToggleGroupItem value="week" className="text-xs">
              Week
            </ToggleGroupItem>
            <ToggleGroupItem value="2weeks" className="text-xs">
              2 Weeks
            </ToggleGroupItem>
          </ToggleGroup>

          {/* Date picker */}
          <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="text-xs h-8 px-2"
                onClick={() => setIsCalendarOpen(!isCalendarOpen)}
              >
                <CalendarIcon className="mr-1 h-4 w-4" />
                {formatDateRange(startDate, endDate)}
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-auto p-0">
              <Calendar
                mode="single"
                selected={startDate}
                onSelect={(date) => {
                  if (date) {
                    setDate(date);
                    setIsCalendarOpen(false);
                  }
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  );
}
