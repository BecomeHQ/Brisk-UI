
import { CalendarDays } from "lucide-react";

interface DayHeaderProps {
  date: Date;
}

export function DayHeader({ date }: DayHeaderProps) {
  return (
    <div className="flex items-center gap-2 mb-6">
      <CalendarDays size={20} className="text-brisk-600" />
      <h4 className="text-lg font-medium text-brisk-800">
        {date.toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })}
      </h4>
    </div>
  );
}
