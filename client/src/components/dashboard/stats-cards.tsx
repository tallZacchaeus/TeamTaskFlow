import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { CheckSquare, Clock, CheckCircle, AlertTriangle } from "lucide-react";

interface DashboardStats {
  totalTasks: number;
  inProgress: number;
  completed: number;
  overdue: number;
  todo: number;
}

export default function StatsCards() {
  const { data: stats, isLoading } = useQuery<DashboardStats>({
    queryKey: ["/api/dashboard/stats"],
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-16 bg-slate-200 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const cards = [
    {
      title: "Total Tasks",
      value: stats?.totalTasks || 0,
      icon: CheckSquare,
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
      change: "+12%",
      changeColor: "text-green-600",
    },
    {
      title: "In Progress",
      value: stats?.inProgress || 0,
      icon: Clock,
      iconBg: "bg-amber-100",
      iconColor: "text-amber-600",
      change: "-3%",
      changeColor: "text-amber-600",
    },
    {
      title: "Completed",
      value: stats?.completed || 0,
      icon: CheckCircle,
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
      change: "+18%",
      changeColor: "text-green-600",
    },
    {
      title: "Overdue",
      value: stats?.overdue || 0,
      icon: AlertTriangle,
      iconBg: "bg-red-100",
      iconColor: "text-red-600",
      change: "+2",
      changeColor: "text-red-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <Card key={card.title} className="shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">{card.title}</p>
                  <p className="text-2xl font-bold text-slate-900">{card.value}</p>
                </div>
                <div className={`w-12 h-12 ${card.iconBg} rounded-xl flex items-center justify-center`}>
                  <Icon className={`w-6 h-6 ${card.iconColor}`} />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <span className={`font-medium ${card.changeColor}`}>{card.change}</span>
                <span className="text-slate-500 ml-2">from last week</span>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
