import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";
import { TrendingUp, Users, Clock, Target } from "lucide-react";

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

export function TaskAnalyticsChart() {
  const { data: taskAnalytics, isLoading } = useQuery({
    queryKey: ["/api/analytics/tasks"],
  });

  if (isLoading) return <div className="h-64 animate-pulse bg-gray-200 rounded"></div>;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="w-5 h-5" />
          Task Status Analytics
        </CardTitle>
        <CardDescription>Distribution and performance metrics by task status</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={Array.isArray(taskAnalytics) ? taskAnalytics : []}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="status" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#3b82f6" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export function TeamPerformanceChart() {
  const { data: teamPerformance, isLoading } = useQuery({
    queryKey: ["/api/analytics/team-performance"],
  });

  if (isLoading) return <div className="h-64 animate-pulse bg-gray-200 rounded"></div>;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="w-5 h-5" />
          Team Performance Metrics
        </CardTitle>
        <CardDescription>Individual team member completion rates and task loads</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {Array.isArray(teamPerformance) ? teamPerformance.map((member: any, index: number) => (
            <div key={member.name} className="space-y-2">
              <div className="flex justify-between items-center">
                <div>
                  <span className="font-medium">{member.name}</span>
                  <Badge variant="outline" className="ml-2">{member.role}</Badge>
                </div>
                <span className="text-sm text-muted-foreground">
                  {member.completion_rate || 0}% completion rate
                </span>
              </div>
              <Progress value={member.completion_rate || 0} className="h-2" />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{member.completed_tasks || 0} completed</span>
                <span>{member.total_tasks || 0} total tasks</span>
                <span>{member.overdue_tasks || 0} overdue</span>
              </div>
            </div>
          )) : []}
        </div>
      </CardContent>
    </Card>
  );
}

export function CategoryAnalyticsChart() {
  const { data: categoryAnalytics, isLoading } = useQuery({
    queryKey: ["/api/analytics/categories"],
  });

  if (isLoading) return <div className="h-64 animate-pulse bg-gray-200 rounded"></div>;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Category Distribution</CardTitle>
        <CardDescription>Task distribution across project categories</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={categoryAnalytics}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ category_name, task_count }) => `${category_name}: ${task_count}`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="task_count"
            >
              {categoryAnalytics?.map((entry: any, index: number) => (
                <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export function ProductivityTrendsChart() {
  const { data: trends, isLoading } = useQuery({
    queryKey: ["/api/analytics/productivity-trends"],
  });

  if (isLoading) return <div className="h-64 animate-pulse bg-gray-200 rounded"></div>;

  const formattedData = trends?.map((item: any) => ({
    ...item,
    week: new Date(item.week_start).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          Productivity Trends
        </CardTitle>
        <CardDescription>Weekly task creation and completion patterns</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={formattedData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="week" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="tasks_created" stroke="#3b82f6" name="Created" />
            <Line type="monotone" dataKey="tasks_completed" stroke="#10b981" name="Completed" />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export function TimeTrackingChart() {
  const { data: timeData, isLoading } = useQuery({
    queryKey: ["/api/analytics/time-tracking"],
  });

  if (isLoading) return <div className="h-64 animate-pulse bg-gray-200 rounded"></div>;

  // Group by team member and sum total hours
  const aggregatedData = timeData?.reduce((acc: any[], entry: any) => {
    const existing = acc.find(item => item.team_member === entry.team_member);
    if (existing) {
      existing.total_hours += Number(entry.total_hours || 0);
      existing.tasks_worked_on += Number(entry.tasks_worked_on || 0);
    } else {
      acc.push({
        team_member: entry.team_member,
        total_hours: Number(entry.total_hours || 0),
        tasks_worked_on: Number(entry.tasks_worked_on || 0)
      });
    }
    return acc;
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="w-5 h-5" />
          Time Tracking Analytics
        </CardTitle>
        <CardDescription>Hours logged by team members in the last 30 days</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={aggregatedData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="team_member" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="total_hours" fill="#8b5cf6" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export function WorkloadDistributionChart() {
  const { data: workloadData, isLoading } = useQuery({
    queryKey: ["/api/analytics/workload-distribution"],
  });

  if (isLoading) return <div className="h-64 animate-pulse bg-gray-200 rounded"></div>;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Current Workload Distribution</CardTitle>
        <CardDescription>Active and pending tasks by team member</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {workloadData?.map((member: any) => (
            <div key={member.name} className="space-y-2">
              <div className="flex justify-between items-center">
                <div>
                  <span className="font-medium">{member.name}</span>
                  <Badge variant="outline" className="ml-2">{member.role}</Badge>
                </div>
                <div className="flex gap-2 text-sm">
                  <Badge variant="secondary">{member.pending_tasks || 0} pending</Badge>
                  <Badge variant="default">{member.active_tasks || 0} active</Badge>
                  {Number(member.overdue_tasks || 0) > 0 && (
                    <Badge variant="destructive">{member.overdue_tasks} overdue</Badge>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="text-center p-2 bg-yellow-50 rounded">
                  <div className="font-medium">{member.pending_tasks || 0}</div>
                  <div className="text-muted-foreground">Pending</div>
                </div>
                <div className="text-center p-2 bg-blue-50 rounded">
                  <div className="font-medium">{member.active_tasks || 0}</div>
                  <div className="text-muted-foreground">Active</div>
                </div>
                <div className="text-center p-2 bg-red-50 rounded">
                  <div className="font-medium">{member.high_priority_tasks || 0}</div>
                  <div className="text-muted-foreground">High Priority</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}