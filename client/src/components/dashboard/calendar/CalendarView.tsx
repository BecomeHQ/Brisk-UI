
import { Calendar } from "@/components/ui/calendar";

interface CalendarViewProps {
  date: Date | undefined;
  onSelect: (date: Date | undefined) => void;
  hasLeaves: (date: Date) => boolean;
}

export function CalendarView({ date, onSelect, hasLeaves }: CalendarViewProps) {
  return (
    <Calendar
      mode="single"
      selected={date}
      onSelect={onSelect}
      className="w-full rounded-md border-0"
      modifiersClassNames={{
        selected: "bg-brisk-500 text-white hover:bg-brisk-600 font-medium",
        today: "bg-brisk-50 text-brisk-900 font-medium border border-brisk-200"
      }}
      modifiers={{
        leaves: (day) => hasLeaves(day),
      }}
      modifiersStyles={{
        leaves: {
          textDecoration: "underline",
          textDecorationColor: "#0ea5e9",
          textDecorationThickness: "2px",
          fontWeight: "500"
        }
      }}
      styles={{
        caption: { marginBottom: "1rem" },
        nav_button: { margin: "0 0.25rem" }
      }}
    />
  );
}
