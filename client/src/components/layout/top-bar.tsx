import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Search, Plus, Bell, Menu, Settings, Users, Trash2, LogOut, User } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import TaskModal from "@/components/tasks/task-modal";
import CategoryModal from "@/components/modals/category-modal";
import TeamMemberModal from "@/components/modals/team-member-modal";
import DeleteAllModal from "@/components/modals/delete-all-modal";
import { useLocation, Link } from "wouter";

const pageNames: Record<string, string> = {
  "/": "Dashboard",
  "/tasks": "All Tasks",
  "/calendar": "Calendar",
  "/team": "Team",
  "/reports": "Reports",
};

const navigation = [
  { name: "Dashboard", href: "/" },
  { name: "All Tasks", href: "/tasks" },
  { name: "Calendar", href: "/calendar" },
  { name: "Team", href: "/team" },
  { name: "Reports", href: "/reports" },
];

export default function TopBar() {
  const [location] = useLocation();
  const { user, isAdmin } = useAuth();
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const pageName = pageNames[location] || "Dashboard";

  const handleLogout = () => {
    window.location.href = "/api/logout";
  };

  return (
    <>
      <header className="bg-white border-b border-slate-200 px-4 md:px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 md:gap-4">
            {/* Mobile Menu Button */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64 p-0">
                <div className="p-6 border-b border-slate-200">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                      <Plus className="w-4 h-4 text-white" />
                    </div>
                    <h1 className="text-xl font-bold text-slate-900">TaskFlow</h1>
                  </div>
                </div>
                <nav className="p-4 space-y-2">
                  {navigation.map((item) => {
                    const isActive = location === item.href;
                    return (
                      <Link key={item.name} href={item.href}>
                        <div
                          className={`
                            flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer
                            ${isActive ? "text-primary bg-primary/10" : "text-slate-600 hover:bg-slate-100"}
                          `}
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          {item.name}
                        </div>
                      </Link>
                    );
                  })}
                </nav>
              </SheetContent>
            </Sheet>

            <h2 className="text-lg md:text-2xl font-bold text-slate-900">{pageName}</h2>
            
            {/* Search - Hidden on mobile */}
            <div className="relative hidden md:block">
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
          
          <div className="flex items-center gap-1 md:gap-3">
            {/* Admin-only actions */}
            {isAdmin && (
              <>
                <Button 
                  onClick={() => setIsTaskModalOpen(true)}
                  className="text-xs md:text-sm"
                  size="sm"
                >
                  <Plus className="w-4 h-4 md:mr-2" />
                  <span className="hidden md:inline">New Task</span>
                </Button>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="text-xs md:text-sm">
                      <Settings className="w-4 h-4 md:mr-2" />
                      <span className="hidden md:inline">Manage</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem onClick={() => setIsCategoryModalOpen(true)}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Category
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setIsTeamModalOpen(true)}>
                      <Users className="w-4 h-4 mr-2" />
                      Add Team Member
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={() => setIsDeleteModalOpen(true)}
                      className="text-red-600 focus:text-red-600"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Clear All Data
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            )}
            
            {/* User menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span className="hidden md:inline text-xs">
                    {user?.firstName || user?.email || 'User'}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <div className="px-2 py-1.5 text-sm text-muted-foreground">
                  <div className="font-medium">{user?.firstName || 'User'}</div>
                  <div className="text-xs">{user?.email}</div>
                  <div className="text-xs font-medium text-blue-600 capitalize">
                    {user?.role || 'guest'}
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        
        {/* Mobile Search */}
        <div className="mt-4 md:hidden">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <Input
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-full"
            />
          </div>
        </div>
      </header>
      
      <TaskModal 
        isOpen={isTaskModalOpen} 
        onClose={() => setIsTaskModalOpen(false)} 
      />
      <CategoryModal 
        isOpen={isCategoryModalOpen} 
        onClose={() => setIsCategoryModalOpen(false)} 
      />
      <TeamMemberModal 
        isOpen={isTeamModalOpen} 
        onClose={() => setIsTeamModalOpen(false)} 
      />
      <DeleteAllModal 
        isOpen={isDeleteModalOpen} 
        onClose={() => setIsDeleteModalOpen(false)} 
      />
    </>
  );
}
