
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

interface SelectedDateHeaderProps {
  selectedDate: Date;
  employeeCount: number;
}

export function SelectedDateHeader({ selectedDate, employeeCount }: SelectedDateHeaderProps) {
  return (
    <div className="px-6 mb-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CalendarIcon size={16} className="text-neutral-500" />
          <span className="text-sm font-medium">{format(selectedDate, "EEEE, MMMM d, yyyy")}</span>
        </div>
        {employeeCount > 0 && (
          <Badge variant="outline" className="bg-brisk-50 text-brisk-600 font-normal">
            {employeeCount} {employeeCount === 1 ? "employee" : "employees"}
          </Badge>
        )}
      </div>
    </div>
  );
}
