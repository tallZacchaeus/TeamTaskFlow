import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Plus, Clock } from "lucide-react";
import { type Activity } from "@shared/schema";
import { formatDistanceToNow } from "date-fns";

export default function RecentActivity() {
  const { data: activities = [], isLoading } = useQuery<Activity[]>({
    queryKey: ["/api/activities"],
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-start gap-3 animate-pulse">
                <div className="w-8 h-8 bg-slate-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-slate-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-slate-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "created":
        return <Plus className="w-4 h-4 text-blue-600" />;
      case "updated":
        return <Clock className="w-4 h-4 text-amber-600" />;
      default:
        return <Clock className="w-4 h-4 text-slate-600" />;
    }
  };

  const getActivityBg = (type: string) => {
    switch (type) {
      case "completed":
        return "bg-green-100";
      case "created":
        return "bg-blue-100";
      case "updated":
        return "bg-amber-100";
      default:
        return "bg-slate-100";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        {activities.length === 0 ? (
          <div className="text-center py-8">
            <Clock className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-600">No recent activity</p>
          </div>
        ) : (
          <div className="space-y-4">
            {activities.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3">
                <div className={`w-8 h-8 ${getActivityBg(activity.type)} rounded-full flex items-center justify-center flex-shrink-0`}>
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-900">{activity.description}</p>
                  <p className="text-xs text-slate-500">
                    {activity.createdAt ? formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true }) : 'Just now'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
