import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";
import Tasks from "@/pages/tasks";
import Team from "@/pages/team";
import Reports from "@/pages/reports";
import Calendar from "@/pages/calendar";
import Sidebar from "@/components/layout/sidebar";
import TopBar from "@/components/layout/top-bar";

function Router() {
  return (
    <div className="flex h-screen bg-slate-50">
      <div className="hidden md:block">
        <Sidebar />
      </div>
      <main className="flex-1 flex flex-col overflow-hidden">
        <TopBar />
        <Switch>
          <Route path="/" component={Dashboard} />
          <Route path="/tasks" component={Tasks} />
          <Route path="/calendar" component={Calendar} />
          <Route path="/team" component={Team} />
          <Route path="/reports" component={Reports} />
          <Route component={NotFound} />
        </Switch>
      </main>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
