import EmployeeTable from "@/components/employees/EmployeeTable";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronDown, Download, Filter, Search, UserPlus } from "lucide-react";
import { useState } from "react";
import { AddEmployeeDialog } from "@/components/employees/AddEmployeeDialog";

const EmployeesPage = () => {
  const [tab, setTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);
  const [employeeCount, setEmployeeCount] = useState(0);

  const departments = [
    "Digital Design",
    "Client Partner",
    "Content",
    "Branding",
    "Frontrunner",
  ];

  const toggleDepartment = (department: string) => {
    setSelectedDepartments((prev) =>
      prev.includes(department)
        ? prev.filter((d) => d !== department)
        : [...prev, department]
    );
  };

  const handleEmployeeAdded = () => {
    // Refresh the employee table when a new employee is added
    // This will trigger a re-render of the EmployeeTable component
  };

  return (
    <Layout>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Employees</h1>
          <p className="text-neutral-500 mt-1">
            Manage employee wellbeing and work patterns
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <Download size={16} className="mr-2" />
            Export
          </Button>
          <AddEmployeeDialog onEmployeeAdded={handleEmployeeAdded} />
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg border border-neutral-200 shadow-sm mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          {/* <Tabs value={tab} onValueChange={setTab} className="w-full md:w-auto">
            <TabsList>
              <TabsTrigger value="all">All Employees</TabsTrigger>
              <TabsTrigger value="high-risk" className="text-danger">
                High Risk
              </TabsTrigger>
              <TabsTrigger value="moderate-risk" className="text-warning">
                Moderate Risk
              </TabsTrigger>
              <TabsTrigger value="low-risk" className="text-success">
                Low Risk
              </TabsTrigger>
            </TabsList>
          </Tabs> */}

          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400"
                size={18}
              />
              <Input
                placeholder="Search employees..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                {/* <Button variant="outline" className="gap-2">
                  <Filter size={16} />
                  <span className="hidden sm:inline">
                    Filter{" "}
                    {selectedDepartments.length > 0 &&
                      `(${selectedDepartments.length})`}
                  </span>
                  <ChevronDown size={16} />
                </Button> */}
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                {departments.map((department) => (
                  <DropdownMenuCheckboxItem
                    key={department}
                    checked={selectedDepartments.includes(department)}
                    onCheckedChange={() => toggleDepartment(department)}
                  >
                    {department}
                  </DropdownMenuCheckboxItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setSelectedDepartments([])}>
                  Clear all filters
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="text-sm text-neutral-500 mb-2">
          Showing {employeeCount} employees from database
          {selectedDepartments.length > 0 && (
            <span className="ml-2">
              • Filtered by: {selectedDepartments.join(", ")}
            </span>
          )}
        </div>
      </div>

      <EmployeeTable
        employees={[]}
        searchQuery={searchQuery}
        selectedDepartments={selectedDepartments}
        riskFilter={tab}
        onEmployeeCountChange={setEmployeeCount}
      />
    </Layout>
  );
};

export default EmployeesPage;
