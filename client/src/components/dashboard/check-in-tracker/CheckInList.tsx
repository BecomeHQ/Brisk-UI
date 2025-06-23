
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface CheckInOutData {
  name: string;
  checkIn: string;
  checkOut: string;
}

interface CheckInListProps {
  checkInOutData: CheckInOutData[];
}

export function CheckInList({ checkInOutData }: CheckInListProps) {
  return (
    <div className="space-y-4 px-6">
      <div className="grid grid-cols-3 text-sm font-medium text-neutral-500 pb-2 border-b">
        <div>Employee</div>
        <div>Check In</div>
        <div>Check Out</div>
      </div>
      <div className="space-y-1">
        {checkInOutData.map((employee, index) => (
          <div 
            key={index} 
            className={`grid grid-cols-3 items-center py-3 rounded-md ${
              index % 2 === 0 ? "bg-neutral-50" : "bg-white"
            } hover:bg-brisk-50 transition-colors`}
          >
            <div className="flex items-center gap-3 pl-3">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-brisk-100 text-brisk-700">
                  {employee.name.split(" ").map(n => n[0]).join("")}
                </AvatarFallback>
              </Avatar>
              <span className="font-medium">{employee.name}</span>
            </div>
            <div className="font-medium text-sm text-brisk-700">{employee.checkIn}</div>
            <div className="font-medium text-sm text-brisk-700">{employee.checkOut}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
