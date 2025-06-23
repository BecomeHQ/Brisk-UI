import { useState } from "react";
import { format, isSameDay, isWeekend } from "date-fns";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { eachDayOfInterval } from "date-fns";
import { publicHolidays, getLeaveIcon, leaveTypes, Leave } from "./types";

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

interface CalendarGridProps {
  selectedType: string[];
  showAbsentOnly: boolean;
  startDate: Date;
  endDate: Date;
  leaves: Leave[];
  users: User[];
  loading: boolean;
  onCellClick: (day: Date, employeeId: string) => void;
  databaseLeaves: DatabaseLeave[];
}

export function CalendarGrid({
  selectedType,
  showAbsentOnly,
  startDate,
  endDate,
  leaves,
  users,
  loading,
  onCellClick,
  databaseLeaves,
}: CalendarGridProps) {
  // State to track which cell is showing leave details
  const [clickedCell, setClickedCell] = useState<{
    userId: string;
    day: Date;
  } | null>(null);

  // Generate days for the header
  const daysInRange = eachDayOfInterval({ start: startDate, end: endDate });

  // Debug logging for filtering
  console.log("Selected leave types:", selectedType);
  console.log("Total users:", users.length);
  console.log("Database leaves count:", databaseLeaves.length);

  // Filter users based on "show absent only"
  const filteredUsers = showAbsentOnly
    ? users.filter((user) =>
        databaseLeaves.some(
          (leave) =>
            leave.user === user.slackId &&
            leave.status === "Approved" &&
            selectedType.includes(
              mapDatabaseLeaveTypeToCalendarType(leave.leaveType)
            ) &&
            leave.dates.some((leaveDate) => {
              const date = new Date(leaveDate);
              return date >= startDate && date <= endDate;
            })
        )
      )
    : users;

  console.log("Filtered users count:", filteredUsers.length);

  // Check if a user has leave on a specific day from database
  const hasLeaveOnDay = (userId: string, day: Date) => {
    // Find user by Slack ID
    const user = users.find((u) => u._id === userId);
    if (!user) return null;

    // Check database leaves for this user on this day
    const databaseLeave = databaseLeaves.find(
      (leave) =>
        leave.user === user.slackId &&
        leave.status === "Approved" &&
        leave.dates.some((leaveDate) => isSameDay(new Date(leaveDate), day))
    );

    if (databaseLeave) {
      // Map database leave type to calendar leave type
      const mappedLeaveType = mapDatabaseLeaveTypeToCalendarType(
        databaseLeave.leaveType
      );

      // Only return leave info if the leave type is in the selected types
      if (selectedType.includes(mappedLeaveType)) {
        // Log leave details
        console.log(
          "Leave details for",
          user.username,
          "on",
          format(day, "yyyy-MM-dd"),
          ":",
          {
            leaveId: databaseLeave._id,
            user: databaseLeave.user,
            username: databaseLeave.username || user.username,
            dates: databaseLeave.dates,
            reason: databaseLeave.reason,
            status: databaseLeave.status,
            leaveType: databaseLeave.leaveType,
            leaveDay: databaseLeave.leaveDay,
            leaveTime: databaseLeave.leaveTime,
          }
        );

        return { type: mappedLeaveType, leaveData: databaseLeave };
      }
    }

    // Check public holidays
    if (
      selectedType.includes("holiday") &&
      publicHolidays.some((holiday) => isSameDay(holiday.date, day))
    ) {
      return { type: "holiday", leaveData: null };
    }

    return null;
  };

  // Function to map database leave types to calendar leave types
  const mapDatabaseLeaveTypeToCalendarType = (
    databaseLeaveType: string
  ): string => {
    const typeMap: { [key: string]: string } = {
      Casual_Leave: "casual",
      Sick_Leave: "sick",
      Maternity_Leave: "maternity",
      Paternity_Leave: "paternity",
      Bereavement_Leave: "bereavement",
      WFH_Leave: "wfh",
      Internship_Leave: "internship",
      Unpaid_Leave: "unpaid",
      Restricted_Holiday: "restricted",
      Burnout_Leave: "burnout",
      Menstrual_Leave: "menstrual",
      Compensatory_Leave: "compensatory",
      // Add more mappings as needed
      casualLeave: "casual",
      sickLeave: "sick",
      maternityLeave: "maternity",
      paternityLeave: "paternity",
      bereavementLeave: "bereavement",
      wfhLeave: "wfh",
      internshipLeave: "internship",
      unpaidLeave: "unpaid",
      restrictedHoliday: "restricted",
      burnout: "burnout",
      mensuralLeaves: "menstrual",
    };

    const mappedType =
      typeMap[databaseLeaveType] ||
      databaseLeaveType.toLowerCase().replace("_", "");
    console.log(
      `Mapping leave type: "${databaseLeaveType}" -> "${mappedType}"`
    );
    return mappedType;
  };

  // Check if a day is a public holiday
  const isPublicHoliday = (day: Date) => {
    return publicHolidays.some((holiday) => isSameDay(holiday.date, day));
  };

  // Get public holiday name if applicable
  const getHolidayName = (day: Date) => {
    const holiday = publicHolidays.find((h) => isSameDay(h.date, day));
    return holiday ? holiday.name : null;
  };

  // Handle cell click
  const handleCellClick = (day: Date, userId: string) => {
    const currentCell = { userId, day };

    // If clicking the same cell, hide the details
    if (
      clickedCell &&
      clickedCell.userId === userId &&
      isSameDay(clickedCell.day, day)
    ) {
      setClickedCell(null);
    } else {
      // Show details for the clicked cell
      setClickedCell(currentCell);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-neutral-500">Loading users...</div>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <div className="min-w-[800px] relative">
        {/* Header with dates */}
        <div
          className="grid"
          style={{
            gridTemplateColumns:
              "220px repeat(" + daysInRange.length + ", minmax(45px, 1fr))",
          }}
        >
          {/* Empty cell for employee column */}
          <div className="p-3 text-sm font-medium text-neutral-500 border-b border-r border-neutral-200 bg-neutral-50 sticky left-0 z-10">
            Employee
          </div>

          {/* Date columns */}
          {daysInRange.map((day, i) => {
            const isWeekendDay = isWeekend(day);
            const isHoliday = isPublicHoliday(day);
            const isToday = isSameDay(day, new Date());
            const holidayName = getHolidayName(day);

            return (
              <div
                key={i}
                className={cn(
                  "p-2 text-center text-xs border-b border-r border-neutral-200",
                  isWeekendDay ? "bg-neutral-50" : "bg-white",
                  isHoliday ? "bg-purple-50" : "",
                  isToday ? "font-bold" : ""
                )}
              >
                <div
                  className={cn(
                    "font-medium",
                    isHoliday ? "text-purple-700" : "",
                    isWeekendDay ? "text-neutral-500" : ""
                  )}
                >
                  {format(day, "EEE")}
                </div>
                <div
                  className={cn(
                    "text-neutral-600",
                    isToday
                      ? "text-brisk-600 bg-brisk-50 rounded-full w-6 h-6 flex items-center justify-center mx-auto"
                      : "",
                    isHoliday ? "text-purple-700" : "",
                    isWeekendDay && !isHoliday ? "text-neutral-500" : ""
                  )}
                >
                  {format(day, "d")}
                </div>
                {isHoliday && holidayName && (
                  <div
                    className="text-[10px] text-purple-700 mt-1 truncate"
                    title={holidayName}
                  >
                    {holidayName}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* User rows */}
        {filteredUsers.map((user) => (
          <div
            key={user._id}
            className="grid border-b border-neutral-200"
            style={{
              gridTemplateColumns:
                "220px repeat(" + daysInRange.length + ", minmax(45px, 1fr))",
            }}
          >
            {/* User info cell */}
            <div className="p-3 flex items-center gap-3 border-r border-neutral-200 bg-white sticky left-0 z-10">
              <Avatar className="h-8 w-8">
                <AvatarFallback>{user.username.substring(0, 2)}</AvatarFallback>
              </Avatar>
              <div className="truncate">
                <div className="font-medium text-sm">{user.username}</div>
                <div className="text-xs text-neutral-500">
                  {/* Department is blank as requested */}
                </div>
              </div>
            </div>

            {/* Day cells with leave indicators */}
            {daysInRange.map((day, dayIndex) => {
              const leaveInfo = hasLeaveOnDay(user._id, day);
              const isWeekendDay = isWeekend(day);
              const isHoliday = isPublicHoliday(day);
              const isCellClicked =
                clickedCell &&
                clickedCell.userId === user._id &&
                isSameDay(clickedCell.day, day);

              // Check if this is the start of a multi-day leave
              const isLeaveStart =
                leaveInfo &&
                (dayIndex === 0 ||
                  hasLeaveOnDay(user._id, daysInRange[dayIndex - 1])?.type !==
                    leaveInfo.type);

              // Calculate how many days this leave spans
              let leaveSpan = 0;
              if (isLeaveStart && leaveInfo) {
                for (let i = dayIndex; i < daysInRange.length; i++) {
                  const nextDayLeaveInfo = hasLeaveOnDay(
                    user._id,
                    daysInRange[i]
                  );
                  if (nextDayLeaveInfo?.type === leaveInfo.type) {
                    leaveSpan++;
                  } else {
                    break;
                  }
                }
              }

              // Get the color for this leave type
              const typeColor = leaveInfo
                ? leaveTypes.find((t) => t.id === leaveInfo.type)?.color
                : "";

              return (
                <div
                  key={dayIndex}
                  className={cn(
                    "h-14 border-r border-neutral-200 relative",
                    isWeekendDay ? "bg-neutral-50" : "bg-white",
                    isHoliday && !leaveInfo ? "bg-purple-50/40" : "",
                    // Show green background for users not on leave, red for users on leave
                    leaveInfo
                      ? "bg-red-100 border-red-300"
                      : "bg-green-100 border-green-300 cursor-pointer hover:bg-green-200"
                  )}
                  onClick={() => handleCellClick(day, user._id)}
                >
                  {leaveInfo && isLeaveStart && (
                    <div
                      className={cn(
                        "absolute top-1/2 -translate-y-1/2 h-8 rounded-md px-2 flex items-center text-xs",
                        typeColor,
                        "cursor-pointer hover:opacity-90 shadow-sm"
                      )}
                      style={{
                        left: "4px",
                        width: `calc(${leaveSpan} * 100% - 8px)`,
                        maxWidth: `calc(${leaveSpan} * 100% - 8px)`,
                        zIndex: 5,
                      }}
                      onClick={(e) => {
                        e.stopPropagation(); // Stop propagation to prevent double handling
                        handleCellClick(day, user._id);
                      }}
                    >
                      <span className="truncate whitespace-nowrap">
                        {getLeaveIcon(leaveInfo.type)}
                        {leaveSpan > 2 && (
                          <span className="ml-1">
                            {leaveTypes.find((t) => t.id === leaveInfo.type)
                              ?.label || ""}
                          </span>
                        )}
                      </span>
                    </div>
                  )}

                  {/* Show leave details when cell is clicked */}
                  {isCellClicked && leaveInfo && leaveInfo.leaveData && (
                    <div className="absolute top-full left-0 z-20 bg-white border border-gray-300 rounded-md shadow-lg p-3 min-w-[200px]">
                      <div className="text-sm font-medium text-gray-900 mb-2">
                        Leave Details
                      </div>
                      <div className="text-xs space-y-1">
                        <div>
                          <strong>Type:</strong> {leaveInfo.leaveData.leaveType}
                        </div>
                        <div>
                          <strong>Status:</strong> {leaveInfo.leaveData.status}
                        </div>
                        <div>
                          <strong>Reason:</strong>{" "}
                          {leaveInfo.leaveData.reason || "N/A"}
                        </div>
                        <div>
                          <strong>Day:</strong>{" "}
                          {leaveInfo.leaveData.leaveDay.join(", ")}
                        </div>
                        <div>
                          <strong>Time:</strong>{" "}
                          {leaveInfo.leaveData.leaveTime.join(", ")}
                        </div>
                        <div>
                          <strong>Dates:</strong>{" "}
                          {leaveInfo.leaveData.dates
                            .map((date: Date) =>
                              format(new Date(date), "MMM dd, yyyy")
                            )
                            .join(", ")}
                        </div>
                      </div>
                      <div className="text-xs text-gray-500 mt-2">
                        Click again to hide
                      </div>
                    </div>
                  )}

                  {/* Show "No Leave" message when cell is clicked and user is not on leave */}
                  {isCellClicked && !leaveInfo && (
                    <div className="absolute top-full left-0 z-20 bg-white border border-gray-300 rounded-md shadow-lg p-3 min-w-[150px]">
                      <div className="text-sm font-medium text-gray-900 mb-2">
                        No Leave
                      </div>
                      <div className="text-xs text-gray-600">
                        {user.username} is available on{" "}
                        {format(day, "MMM dd, yyyy")}
                      </div>
                      <div className="text-xs text-gray-500 mt-2">
                        Click again to hide
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}

        {filteredUsers.length === 0 && (
          <div className="p-8 text-center text-neutral-500">
            No users match the current filter criteria
          </div>
        )}
      </div>
    </div>
  );
}
