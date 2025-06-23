import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Employee } from "@/services/employees/types";
import { apiService } from "@/services/api";

interface EmployeeTableProps {
  employees: Employee[];
  searchQuery?: string;
  selectedDepartments?: string[];
  riskFilter?: string;
  onEmployeeCountChange?: (count: number) => void;
}

// Total leaves per person configuration
const totalLeaves = {
  sickLeave: 12,
  casualLeave: 6,
  burnout: 6,
  mensuralLeaves: 18,
  unpaidLeave: 20,
  internshipLeave: 10,
  wfhLeave: 10,
  bereavementLeave: 5,
  maternityLeave: 13,
  paternityLeave: 20,
  restrictedHoliday: 6,
};

// Database user interface
interface DbUser {
  _id: string;
  username: string;
  slackId: string;
  sickLeave: number;
  restrictedHoliday: number;
  burnout: number;
  mensuralLeaves: number;
  casualLeave: number;
  maternityLeave: number;
  unpaidLeave: number;
  paternityLeave: number;
  bereavementLeave: number;
  wfhLeave: number;
  internshipLeave: number;
  createdAt: string;
  updatedAt: string;
}

const EmployeeTable: React.FC<EmployeeTableProps> = ({
  employees,
  searchQuery = "",
  selectedDepartments = [],
  riskFilter = "all",
  onEmployeeCountChange,
}) => {
  const [sortColumn, setSortColumn] = useState<keyof Employee | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [dbUsers, setDbUsers] = useState<DbUser[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch users from database
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await apiService.getAllEmployees();
        if (response.error) {
          console.error("Error fetching users:", response.error);
        } else {
          setDbUsers(response.data || []);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Convert database users to Employee format with calculated leave balances
  const combinedEmployees: Employee[] = dbUsers.map((dbUser, index) => {
    // Calculate remaining leaves for each type
    const remainingLeaves = {
      sickLeave: totalLeaves.sickLeave - dbUser.sickLeave,
      casualLeave: totalLeaves.casualLeave - dbUser.casualLeave,
      burnout: totalLeaves.burnout - dbUser.burnout,
      mensuralLeaves: totalLeaves.mensuralLeaves - dbUser.mensuralLeaves,
      unpaidLeave: totalLeaves.unpaidLeave - dbUser.unpaidLeave,
      internshipLeave: totalLeaves.internshipLeave - dbUser.internshipLeave,
      wfhLeave: totalLeaves.wfhLeave - dbUser.wfhLeave,
      bereavementLeave: totalLeaves.bereavementLeave - dbUser.bereavementLeave,
      maternityLeave: totalLeaves.maternityLeave - dbUser.maternityLeave,
      paternityLeave: totalLeaves.paternityLeave - dbUser.paternityLeave,
      restrictedHoliday:
        totalLeaves.restrictedHoliday - dbUser.restrictedHoliday,
    };

    // Calculate total taken leaves
    const totalTaken = Object.values({
      sickLeave: dbUser.sickLeave,
      casualLeave: dbUser.casualLeave,
      burnout: dbUser.burnout,
      mensuralLeaves: dbUser.mensuralLeaves,
      unpaidLeave: dbUser.unpaidLeave,
      internshipLeave: dbUser.internshipLeave,
      wfhLeave: dbUser.wfhLeave,
      bereavementLeave: dbUser.bereavementLeave,
      maternityLeave: dbUser.maternityLeave,
      paternityLeave: dbUser.paternityLeave,
      restrictedHoliday: dbUser.restrictedHoliday,
    }).reduce((sum, value) => sum + value, 0);

    // Calculate total available leaves
    const totalAvailable = Object.values(totalLeaves).reduce(
      (sum, value) => sum + value,
      0
    );

    return {
      id: dbUser._id,
      name: dbUser.username,
      role: "Employee", // Default role since not in database
      department: "", // Empty department as requested
      gender: "Male" as const, // Default gender
      avatar: `https://images.unsplash.com/photo-${
        1500000000000 + index
      }?w=150&h=150&fit=crop&crop=face`,
      metrics: {
        workHoursToday: 8.5, // Static value
        workHoursThisWeek: 42,
        lateNightCheckins: 3,
        burnoutScore: 65,
        workLifeBalance: 7.2,
      },
      leaves: {
        total: totalAvailable,
        taken: totalTaken,
        planned: 0,
        sickLeaves: remainingLeaves.sickLeave,
        sick: remainingLeaves.sickLeave,
        casual: remainingLeaves.casualLeave,
        emergency: 0,
        bereavement: remainingLeaves.bereavementLeave,
        maternity: remainingLeaves.maternityLeave,
        paternity: remainingLeaves.paternityLeave,
        menstrual: remainingLeaves.mensuralLeaves,
        compensatory: 0,
        burnout: remainingLeaves.burnout,
        unpaid: remainingLeaves.unpaidLeave,
        internship: remainingLeaves.internshipLeave,
        wfh: remainingLeaves.wfhLeave,
        restrictedHoliday: remainingLeaves.restrictedHoliday,
      },
      recentActivity: [
        { date: "2024-03-15", action: "Normal work day", hours: 8.5 },
      ],
    };
  });

  // Filter employees based on search query, departments, and risk level
  const filterEmployees = () => {
    let filtered = [...combinedEmployees];

    // Filter by risk level
    if (riskFilter === "high-risk") {
      filtered = filtered.filter((emp) => emp.metrics.burnoutScore >= 70);
    } else if (riskFilter === "moderate-risk") {
      filtered = filtered.filter(
        (emp) => emp.metrics.burnoutScore >= 40 && emp.metrics.burnoutScore < 70
      );
    } else if (riskFilter === "low-risk") {
      filtered = filtered.filter((emp) => emp.metrics.burnoutScore < 40);
    }

    // Filter by departments (since departments are empty, this won't filter anything)
    if (selectedDepartments.length > 0) {
      filtered = filtered.filter((emp) =>
        selectedDepartments.includes(emp.department)
      );
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (emp) =>
          emp.name.toLowerCase().includes(query) ||
          emp.role.toLowerCase().includes(query) ||
          emp.department.toLowerCase().includes(query)
      );
    }

    return filtered;
  };

  const filteredEmployees = filterEmployees();

  useEffect(() => {
    onEmployeeCountChange?.(filteredEmployees.length);
  }, [filteredEmployees.length, onEmployeeCountChange]);

  const handleSort = (column: keyof Employee) => {
    if (column === sortColumn) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const sortedEmployees = [...filteredEmployees].sort((a, b) => {
    if (sortColumn) {
      const aValue = a[sortColumn];
      const bValue = b[sortColumn];

      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortDirection === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      } else if (typeof aValue === "number" && typeof bValue === "number") {
        return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
      }
    }
    return 0;
  });

  // Updated leave types to match database schema
  const leaveTypes = [
    { key: "sick", label: "Sick", dbKey: "sickLeave" },
    { key: "casual", label: "Casual", dbKey: "casualLeave" },
    { key: "burnout", label: "Burnout", dbKey: "burnout" },
    { key: "menstrual", label: "Menstrual", dbKey: "mensuralLeaves" },
    { key: "unpaid", label: "Unpaid", dbKey: "unpaidLeave" },
    { key: "internship", label: "Internship", dbKey: "internshipLeave" },
    { key: "wfh", label: "WFH", dbKey: "wfhLeave" },
    { key: "bereavement", label: "Bereavement", dbKey: "bereavementLeave" },
    { key: "maternity", label: "Maternity", dbKey: "maternityLeave" },
    { key: "paternity", label: "Paternity", dbKey: "paternityLeave" },
    {
      key: "restrictedHoliday",
      label: "Restricted",
      dbKey: "restrictedHoliday",
    },
  ];

  const calculateWeeklyWorkLifeBalance = (employee: Employee) => {
    const weeklyHours = employee.metrics.workHoursThisWeek;
    const lateNightCheckins = employee.metrics.lateNightCheckins;
    const averageDailyHours = weeklyHours / 7;

    // Base score starts at 10 (perfect balance)
    let balanceScore = 10;

    // Deduct points for excessive daily hours (more than 8 hours per day on average)
    if (averageDailyHours > 8) {
      const excessHours = averageDailyHours - 8;
      balanceScore -= excessHours * 0.8; // Deduct 0.8 points per excess hour
    }

    // Deduct points for late night check-ins
    if (lateNightCheckins > 0) {
      balanceScore -= lateNightCheckins * 0.5; // Deduct 0.5 points per late night login
    }

    // Additional penalty if both conditions are present (compounding effect)
    if (averageDailyHours > 8 && lateNightCheckins > 2) {
      balanceScore -= 1.0; // Extra penalty for chronic overwork
    }

    // Ensure score stays within 0-10 range
    return Math.max(0, Math.min(10, balanceScore));
  };

  const getWorkLifeBalanceHighlight = (employee: Employee) => {
    const calculatedBalance = calculateWeeklyWorkLifeBalance(employee);

    if (calculatedBalance < 4) return "text-red-600 font-semibold"; // Poor balance
    if (calculatedBalance >= 7) return "text-green-600 font-semibold"; // Good balance
    return "text-yellow-600 font-semibold"; // Moderate balance
  };

  const getLeaveHighlight = (remaining: number, total: number) => {
    const percentage = (remaining / total) * 100;
    if (percentage < 20) return "text-red-600 font-semibold"; // Low remaining
    if (percentage >= 60) return "text-green-600 font-semibold"; // Good remaining
    return "text-yellow-600 font-semibold"; // Moderate remaining
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-500">Loading employees...</div>
      </div>
    );
  }

  return (
    <div className="relative w-full overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead
              onClick={() => handleSort("name")}
              className="cursor-pointer min-w-[250px] sticky left-0 bg-white z-10 border-r border-gray-200"
            >
              Employee Details
              {sortColumn === "name" && (sortDirection === "asc" ? " ▲" : " ▼")}
            </TableHead>
            <TableHead className="min-w-[200px]">Leave Summary</TableHead>
            {leaveTypes.map((leaveType) => (
              <TableHead
                key={leaveType.key}
                className="text-center min-w-[80px]"
              >
                {leaveType.label}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedEmployees.map((employee) => {
            const calculatedBalance = calculateWeeklyWorkLifeBalance(employee);

            return (
              <TableRow key={employee.id}>
                <TableCell className="font-medium sticky left-0 bg-white z-10 border-r border-gray-200">
                  <div className="flex flex-col">
                    <span className="font-semibold text-base">
                      {employee.name}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="min-w-[200px]">
                  <div className="flex flex-col space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500">
                        Leaves Taken:
                      </span>
                      <span className="text-sm">
                        {employee.leaves.taken}/{employee.leaves.total}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500">Remaining:</span>
                      <span className="text-sm text-green-600 font-semibold">
                        {Math.max(
                          0,
                          employee.leaves.total - employee.leaves.taken
                        )}
                      </span>
                    </div>
                  </div>
                </TableCell>
                {leaveTypes.map((leaveType) => {
                  const remaining = employee.leaves[
                    leaveType.key as keyof typeof employee.leaves
                  ] as number;
                  const total =
                    totalLeaves[leaveType.dbKey as keyof typeof totalLeaves];

                  return (
                    <TableCell key={leaveType.key} className="text-center">
                      <div className="flex flex-col items-center">
                        <Badge
                          variant="secondary"
                          className={`text-xs ${getLeaveHighlight(
                            remaining,
                            total
                          )}`}
                        >
                          {remaining}
                        </Badge>
                      </div>
                    </TableCell>
                  );
                })}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default EmployeeTable;
