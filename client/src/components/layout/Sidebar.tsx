import { cn } from "@/lib/utils";
import { BarChart2, FileText, Home, UserCircle, Users } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export default function Sidebar() {
  const location = useLocation();
  
  const navItems = [
    { icon: Home, label: "Dashboard", path: "/" },
    { icon: Users, label: "Employees", path: "/employees" },
    { icon: BarChart2, label: "Reports", path: "/reports" },
    { icon: FileText, label: "Documentation", path: "/docs" },
  ];

  return (
    <aside className="w-64 bg-white border-r border-neutral-200 h-[calc(100vh-4rem)] fixed top-16 left-0">
      <div className="flex flex-col h-full">
        <div className="p-4">
          <div className="text-sm font-medium text-neutral-400 mb-2">Main</div>
          <nav className="space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-all",
                  location.pathname === item.path
                    ? "bg-brisk-50 text-brisk-600"
                    : "text-neutral-600 hover:bg-neutral-50"
                )}
              >
                <item.icon size={18} />
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>

        <div className="mt-auto p-4 border-t border-neutral-200">
          <div className="text-sm font-medium text-neutral-400 mb-2">Support</div>
          <button className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-neutral-600 hover:bg-neutral-50 w-full text-left transition-all">
            <UserCircle size={18} />
            <span>Account & Settings</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
