
import { ActivityTimeline } from "@/components/employees/ActivityTimeline";
import { BurnoutMeter } from "@/components/employees/BurnoutMeter";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { getEmployeeById } from "@/services/mockData";
import { 
  AlertCircle, ArrowLeft, Bell, Calendar, CalendarRange, CircleUser, Clock, 
  DownloadCloud, FileText, Lightbulb, Mail, MessageSquare, Phone, PieChart 
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

const EmployeeDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const [employee, setEmployee] = useState(getEmployeeById(id || ""));
  const { toast } = useToast();
  
  useEffect(() => {
    if (!employee) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Employee not found",
      });
    }
  }, [employee, toast]);

  if (!employee) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <h2 className="text-xl font-semibold mb-2">Employee Not Found</h2>
          <p className="text-neutral-500 mb-4">
            The employee profile you're looking for doesn't exist or has been removed.
          </p>
          <Link to="/employees">
            <Button>Back to Employees</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  const handleCheckIn = () => {
    toast({
      title: "Check-in Scheduled",
      description: `A well-being check-in with ${employee.name} has been scheduled for tomorrow.`,
    });
  };

  const suggestBreak = () => {
    toast({
      title: "Break Suggested",
      description: `A suggestion for time off has been sent to ${employee.name}.`,
    });
  };

  return (
    <Layout>
      <Link to="/employees" className="flex items-center gap-2 text-neutral-600 mb-6 hover:text-neutral-900">
        <ArrowLeft size={18} />
        <span>Back to Employees</span>
      </Link>
      
      <div className="bg-white rounded-lg border border-neutral-200 shadow-sm overflow-hidden mb-6">
        <div className="bg-brisk-50 p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-neutral-200 flex items-center justify-center text-neutral-700 text-xl font-semibold">
                {employee.name[0]}
              </div>
              <div>
                <h1 className="text-2xl font-semibold">{employee.name}</h1>
                <p className="text-neutral-700">
                  {employee.role} • {employee.department}
                </p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <Button variant="outline" className="gap-2">
                <Mail size={16} />
                <span>Message</span>
              </Button>
              <Button variant="outline" className="gap-2">
                <Phone size={16} />
                <span>Call</span>
              </Button>
              <Button className="gap-2" onClick={handleCheckIn}>
                <MessageSquare size={16} />
                <span>Schedule Check-in</span>
              </Button>
            </div>
          </div>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Clock size={18} className="text-neutral-500" />
                    <h3 className="font-medium">Work Hours</h3>
                  </div>
                  <div className="text-xs font-medium rounded-full px-3 py-1 bg-neutral-100">
                    Last 7 days
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-sm text-neutral-600">Today</span>
                      <span className="text-sm font-medium">
                        {employee.metrics.workHoursToday}h
                      </span>
                    </div>
                    <Progress 
                      value={(employee.metrics.workHoursToday / 12) * 100} 
                      className="h-2"
                    />
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-sm text-neutral-600">This week</span>
                      <span className="text-sm font-medium">
                        {employee.metrics.workHoursThisWeek}h
                      </span>
                    </div>
                    <Progress 
                      value={(employee.metrics.workHoursThisWeek / 60) * 100} 
                      className="h-2"
                    />
                  </div>
                  
                  <div className="pt-2">
                    <div className="flex items-center gap-2 text-sm">
                      <span className={`w-2 h-2 rounded-full ${
                        employee.metrics.lateNightCheckins > 0 
                        ? "bg-danger" 
                        : "bg-success"
                      }`}></span>
                      <span className={employee.metrics.lateNightCheckins > 0 ? "text-danger" : "text-success"}>
                        {employee.metrics.lateNightCheckins} late night check-ins this week
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-5">
                <div className="flex items-center gap-2 mb-4">
                  <PieChart size={18} className="text-neutral-500" />
                  <h3 className="font-medium">Burnout Risk Assessment</h3>
                </div>
                
                <BurnoutMeter 
                  score={employee.metrics.burnoutScore}
                  className="mb-4"
                />
                
                <div className="mt-4 space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-neutral-600">Work Life Balance</span>
                    <span className={`font-medium ${
                      employee.metrics.workLifeBalance > 60 
                      ? "text-success" 
                      : employee.metrics.workLifeBalance > 40
                      ? "text-warning"
                      : "text-danger"
                    }`}>
                      {employee.metrics.workLifeBalance}%
                    </span>
                  </div>
                  
                  {employee.metrics.burnoutScore > 70 && (
                    <div className="p-3 bg-danger-light text-danger rounded-md text-sm mt-3">
                      <div className="font-medium mb-1">Risk Factors:</div>
                      <ul className="list-disc list-inside space-y-1">
                        <li>Consistent late night work</li>
                        <li>Weekend activity</li>
                        <li>Low leave utilization</li>
                      </ul>
                    </div>
                  )}
                  
                  {employee.metrics.burnoutScore > 50 && (
                    <Button variant="outline" className="gap-2 w-full mt-3" onClick={suggestBreak}>
                      <Lightbulb size={16} />
                      <span>Suggest Time Off</span>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Calendar size={18} className="text-neutral-500" />
                  <h3 className="font-medium">Leave Balance</h3>
                </div>
                
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm text-neutral-600">Annual Leave</span>
                    <span className="text-sm font-medium">
                      {employee.leaves.taken + employee.leaves.planned}/{employee.leaves.total} days
                    </span>
                  </div>
                  <Progress 
                    value={((employee.leaves.taken + employee.leaves.planned) / employee.leaves.total) * 100} 
                    className="h-2"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-neutral-50 p-3 rounded-md">
                    <div className="text-xs text-neutral-500 mb-1">Taken</div>
                    <div className="text-lg font-medium">{employee.leaves.taken} days</div>
                  </div>
                  <div className="bg-neutral-50 p-3 rounded-md">
                    <div className="text-xs text-neutral-500 mb-1">Planned</div>
                    <div className="text-lg font-medium">{employee.leaves.planned} days</div>
                  </div>
                </div>
                
                <div className="bg-neutral-50 p-3 rounded-md">
                  <div className="text-xs text-neutral-500 mb-1">Sick Leave</div>
                  <div className="text-lg font-medium">{employee.leaves.sickLeaves} days</div>
                </div>
                
                {employee.leaves.planned > 0 && (
                  <div className="mt-4 p-3 bg-brisk-50 text-brisk-800 rounded-md text-sm">
                    <div className="font-medium mb-1">
                      Upcoming Leave:
                    </div>
                    <div className="flex items-center gap-2">
                      <CalendarRange size={14} />
                      <span>May 27-28, 2025 (2 days)</span>
                    </div>
                  </div>
                )}
                
                {((employee.leaves.taken + employee.leaves.planned) / employee.leaves.total) < 0.25 && (
                  <div className="mt-3 text-sm text-warning flex items-center gap-1.5">
                    <Bell size={14} />
                    <span>Low leave utilization for this time of year</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card>
            <CardContent className="p-0">
              <Tabs defaultValue="activity" className="w-full">
                <div className="border-b">
                  <div className="px-6">
                    <TabsList className="h-12">
                      <TabsTrigger value="activity" className="data-[state=active]:bg-transparent">
                        Activity Log
                      </TabsTrigger>
                      <TabsTrigger value="recommendations" className="data-[state=active]:bg-transparent">
                        Recommendations
                      </TabsTrigger>
                      <TabsTrigger value="notes" className="data-[state=active]:bg-transparent">
                        Notes
                      </TabsTrigger>
                    </TabsList>
                  </div>
                </div>
                
                <TabsContent value="activity" className="m-0 p-0">
                  <div className="p-6">
                    <ActivityTimeline activities={employee.recentActivity} />
                  </div>
                </TabsContent>
                
                <TabsContent value="recommendations" className="m-0 p-6">
                  {employee.metrics.burnoutScore > 70 && (
                    <div className="space-y-4">
                      <div className="p-4 bg-danger-light border border-danger/20 rounded-md">
                        <h4 className="text-danger font-medium mb-2 flex items-center gap-2">
                          <AlertCircle size={16} />
                          High Burnout Risk Alert
                        </h4>
                        <p className="text-sm text-neutral-700 mb-3">
                          {employee.name} shows multiple signs of potential burnout. Consider taking the following actions:
                        </p>
                        <ul className="list-disc list-inside text-sm text-neutral-700 space-y-2">
                          <li>Schedule a well-being check-in this week</li>
                          <li>Suggest taking a day off next week</li>
                          <li>Review current workload and project deadlines</li>
                          <li>Discourage late night and weekend work</li>
                        </ul>
                      </div>
                      
                      <div className="p-4 bg-neutral-50 border border-neutral-200 rounded-md">
                        <h4 className="font-medium mb-2 flex items-center gap-2">
                          <FileText size={16} className="text-neutral-500" />
                          Resources for Managers
                        </h4>
                        <ul className="list-disc list-inside text-sm text-neutral-700 space-y-2">
                          <li>
                            <a href="#" className="text-brisk-600 hover:underline">
                              How to Approach Burnout Conversations
                            </a>
                          </li>
                          <li>
                            <a href="#" className="text-brisk-600 hover:underline">
                              Work Distribution Guidelines
                            </a>
                          </li>
                          <li>
                            <a href="#" className="text-brisk-600 hover:underline">
                              Burnout Prevention Policy
                            </a>
                          </li>
                        </ul>
                      </div>
                    </div>
                  )}
                  
                  {employee.metrics.burnoutScore <= 70 && employee.metrics.burnoutScore > 40 && (
                    <div className="space-y-4">
                      <div className="p-4 bg-warning-light border border-warning/20 rounded-md">
                        <h4 className="text-warning font-medium mb-2 flex items-center gap-2">
                          <AlertCircle size={16} />
                          Moderate Burnout Risk
                        </h4>
                        <p className="text-sm text-neutral-700 mb-3">
                          {employee.name} is showing some signs of potential stress. Consider these preventive measures:
                        </p>
                        <ul className="list-disc list-inside text-sm text-neutral-700 space-y-2">
                          <li>Regular check-ins during 1:1 meetings</li>
                          <li>Review workload distribution within the team</li>
                          <li>Ensure all upcoming leave is planned</li>
                        </ul>
                      </div>
                    </div>
                  )}
                  
                  {employee.metrics.burnoutScore <= 40 && (
                    <div className="space-y-4">
                      <div className="p-4 bg-success-light border border-success/20 rounded-md">
                        <h4 className="text-success font-medium mb-2 flex items-center gap-2">
                          <CircleUser size={16} />
                          Low Burnout Risk
                        </h4>
                        <p className="text-sm text-neutral-700">
                          {employee.name} is maintaining a healthy work-life balance. Continue to support their current work patterns.
                        </p>
                      </div>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="notes" className="m-0 p-6">
                  <div className="text-sm text-neutral-500 italic">
                    No notes have been added for this employee.
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card>
            <CardContent className="p-5">
              <h3 className="font-medium mb-4">Employee Information</h3>
              
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm text-neutral-500 mb-1">Contact Information</h4>
                  <Separator className="mb-3" />
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Mail size={16} className="text-neutral-400" />
                      <span className="text-sm">{employee.name.toLowerCase().replace(" ", ".")}@company.com</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone size={16} className="text-neutral-400" />
                      <span className="text-sm">+1 (555) 123-4567</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm text-neutral-500 mb-1">Employment Details</h4>
                  <Separator className="mb-3" />
                  
                  <div className="grid grid-cols-2 gap-y-2 text-sm">
                    <div className="text-neutral-500">Department:</div>
                    <div>{employee.department}</div>
                    <div className="text-neutral-500">Role:</div>
                    <div>{employee.role}</div>
                    <div className="text-neutral-500">Status:</div>
                    <div>Full time</div>
                    <div className="text-neutral-500">Join Date:</div>
                    <div>June 15, 2022</div>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm text-neutral-500 mb-1">Administrative</h4>
                  <Separator className="mb-3" />
                  
                  <div className="flex flex-col gap-2">
                    <Button variant="outline" size="sm" className="justify-start">
                      <FileText size={14} className="mr-2" />
                      View Full HR Record
                    </Button>
                    <Button variant="outline" size="sm" className="justify-start">
                      <DownloadCloud size={14} className="mr-2" />
                      Export Data
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default EmployeeDetailsPage;
