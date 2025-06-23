import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { addDays } from "date-fns";
import { CalendarHeader } from "./team-leave/CalendarHeader";
import { CalendarGrid } from "./team-leave/CalendarGrid";
import { Leave } from "./team-leave/types";
import { useToast } from "@/hooks/use-toast";
import { apiService } from "@/services/api";

interface User {
  _id: string;
  username: string;
  slackId: string;
}

// Interface for database leave structure
interface DatabaseLeave {
  _id: string;
  user: string; // Slack ID
  dates: Date[];
  reason: string;
  status: string;
  leaveType: string;
  leaveDay: string[];
  leaveTime: string[];
  username?: string;
}

export function TeamLeaveCalendar() {
  const [selectedType, setSelectedType] = useState<string[]>([
    "holiday",
    "sick",
    "burnout",
    "casual",
    "menstrual",
    "maternity",
    "paternity",
    "bereavement",
    "unpaid",
    "compensatory",
    "wfh",
    "internship",
    "restricted",
  ]);
  const [showAbsentOnly, setShowAbsentOnly] = useState(false);
  const [calendarView, setCalendarView] = useState<"week" | "2weeks">("2weeks");
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [leaves, setLeaves] = useState<Leave[]>([]);
  const [databaseLeaves, setDatabaseLeaves] = useState<DatabaseLeave[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { toast } = useToast();

  // Fetch users from MongoDB
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await apiService.getAllUsers();

        if (response.error) {
          setError(response.error);
        } else {
          setUsers(response.data || []);
        }
      } catch (err) {
        setError("Failed to fetch users");
        console.error("Error fetching users:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Fetch leaves from MongoDB
  useEffect(() => {
    const fetchLeaves = async () => {
      try {
        const response = await apiService.getAllLeaveRequests();

        if (response.error) {
          console.error("Error fetching leaves:", response.error);
        } else {
          const leavesData = response.data || [];
          console.log("Fetched leaves from database:", leavesData);
          setDatabaseLeaves(leavesData);

          // Convert database leaves to the format expected by the calendar
          const convertedLeaves: Leave[] = leavesData
            .filter((leave: DatabaseLeave) => leave.status === "Approved")
            .flatMap((leave: DatabaseLeave) =>
              leave.dates.map((date: Date) => ({
                employeeId: leave.user, // Use Slack ID as employeeId
                type: leave.leaveType.toLowerCase().replace("_", ""), // Convert "Casual_Leave" to "casual"
                startDate: new Date(date),
                endDate: new Date(date),
              }))
            );

          setLeaves(convertedLeaves);
        }
      } catch (err) {
        console.error("Error fetching leaves:", err);
      }
    };

    fetchLeaves();
  }, []);

  // Calculate end date based on view
  const endDate =
    calendarView === "week" ? addDays(startDate, 6) : addDays(startDate, 13);

  // Update calendar when date changes
  useEffect(() => {
    if (date) {
      setStartDate(date);
    }
  }, [date]);

  return (
    <Card className="overflow-hidden">
      <CalendarHeader
        selectedType={selectedType}
        setSelectedType={setSelectedType}
        showAbsentOnly={showAbsentOnly}
        setShowAbsentOnly={setShowAbsentOnly}
        calendarView={calendarView}
        setCalendarView={setCalendarView}
        startDate={startDate}
        endDate={endDate}
        setDate={setDate}
      />

      <CalendarGrid
        selectedType={selectedType}
        showAbsentOnly={showAbsentOnly}
        startDate={startDate}
        endDate={endDate}
        leaves={leaves}
        users={users}
        loading={loading}
        onCellClick={() => {}} // Empty function since we handle clicks in CalendarGrid
        databaseLeaves={databaseLeaves}
      />
    </Card>
  );
}
