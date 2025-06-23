
import { useToast } from "@/hooks/use-toast";
import { Bell, Search, Settings } from "lucide-react";
import { Link } from "react-router-dom";

export default function Header() {
  const { toast } = useToast();

  const handleNotificationClick = () => {
    toast({
      title: "Notifications",
      description: "You have 2 new notifications",
    });
  };

  return (
    <header className="bg-white border-b border-neutral-200 sticky top-0 z-20">
      <div className="container flex items-center justify-between h-16 px-4">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2 font-semibold text-xl">
            <span className="text-brisk-600">Brisk</span>
            <span className="text-neutral-700">AI</span>
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative w-64 hidden md:block">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" size={18} />
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-10 pr-4 py-2 rounded-md border border-neutral-200 focus:outline-none focus:ring-1 focus:ring-brisk-500"
            />
          </div>
          
          <button 
            className="p-2 rounded-full hover:bg-neutral-100" 
            onClick={handleNotificationClick}
          >
            <Bell size={20} className="text-neutral-500" />
          </button>
          
          <button className="p-2 rounded-full hover:bg-neutral-100">
            <Settings size={20} className="text-neutral-500" />
          </button>
          
          <div className="h-8 w-8 rounded-full bg-brisk-100 text-brisk-800 flex items-center justify-center font-medium">
            HR
          </div>
        </div>
      </div>
    </header>
  );
}
