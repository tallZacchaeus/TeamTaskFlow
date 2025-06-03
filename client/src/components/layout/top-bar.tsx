import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, Bell } from "lucide-react";
import TaskModal from "@/components/tasks/task-modal";
import { useLocation } from "wouter";

const pageNames: Record<string, string> = {
  "/": "Dashboard",
  "/tasks": "All Tasks",
  "/calendar": "Calendar",
  "/team": "Team",
  "/reports": "Reports",
};

export default function TopBar() {
  const [location] = useLocation();
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const pageName = pageNames[location] || "Dashboard";

  return (
    <>
      <header className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-bold text-slate-900">{pageName}</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-80"
              />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button onClick={() => setIsTaskModalOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              New Task
            </Button>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-4 h-4" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </Button>
          </div>
        </div>
      </header>
      
      <TaskModal 
        isOpen={isTaskModalOpen} 
        onClose={() => setIsTaskModalOpen(false)} 
      />
    </>
  );
}
