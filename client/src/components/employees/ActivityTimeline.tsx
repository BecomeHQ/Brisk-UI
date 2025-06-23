
import { CalendarRange, Clock } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { calculateHours } from "@/components/dashboard/calendar/TimelineUtils";

interface TimelineItem {
  date: string;
  action: string;
  hours?: number;
  className?: string;
}

interface ActivityTimelineProps {
  activities: TimelineItem[];
}

export function ActivityTimeline({ activities }: ActivityTimelineProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-2">
      {activities.map((activity, index) => (
        <div
          key={index}
          className={`relative pl-6 py-3 border-l-2 ${
            index === 0
              ? "border-brisk-500"
              : index === 1
              ? "border-brisk-400"
              : "border-neutral-200"
          }`}
        >
          <div className="absolute -left-1.5 top-3.5">
            <div className={`w-3 h-3 rounded-full ${
              index === 0
                ? "bg-brisk-500"
                : index === 1
                ? "bg-brisk-400"
                : "bg-neutral-300"
            }`}></div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <CalendarRange size={14} className="text-neutral-500" />
                <span className="text-sm font-medium">{formatDate(activity.date)}</span>
              </div>
              <div className="text-sm text-neutral-700 mt-1 pr-4">{activity.action}</div>
            </div>
            {activity.hours !== undefined && (
              <div className={`flex items-center gap-1.5 text-sm font-medium ${
                activity.hours > 10
                  ? "text-warning"
                  : activity.hours > 8
                  ? "text-success"
                  : "text-brisk-500"
              }`}>
                <Clock size={14} />
                <span>{activity.hours}h</span>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
