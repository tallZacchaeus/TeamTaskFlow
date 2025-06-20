import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useQuery } from "@tanstack/react-query";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Area, AreaChart } from 'recharts';
import { Target, Users, Folder, TrendingUp, Clock, BarChart3 } from "lucide-react";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

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
          {Array.isArray(teamPerformance) && teamPerformance.map((member: any, index: number) => (
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
          ))}
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
        <CardTitle className="flex items-center gap-2">
          <Folder className="w-5 h-5" />
          Category Distribution
        </CardTitle>
        <CardDescription>Task distribution across project categories</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={Array.isArray(categoryAnalytics) ? categoryAnalytics : []}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ category_name, task_count }) => `${category_name}: ${task_count}`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="task_count"
            >
              {Array.isArray(categoryAnalytics) && categoryAnalytics.map((entry: any, index: number) => (
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
  const { data: productivityTrends, isLoading } = useQuery({
    queryKey: ["/api/analytics/productivity-trends"],
  });

  if (isLoading) return <div className="h-64 animate-pulse bg-gray-200 rounded"></div>;

  const chartData = Array.isArray(productivityTrends) ? productivityTrends.map((item: any) => ({
    week: new Date(item.week_start).toLocaleDateString(),
    created: item.tasks_created || 0,
    completed: item.tasks_completed || 0
  })) : [];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          Productivity Trends
        </CardTitle>
        <CardDescription>12-week task creation and completion patterns</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="week" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="created" stroke="#8884d8" name="Created" />
            <Line type="monotone" dataKey="completed" stroke="#82ca9d" name="Completed" />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export function TimeTrackingChart() {
  const { data: timeAnalytics, isLoading } = useQuery({
    queryKey: ["/api/analytics/time-tracking"],
  });

  if (isLoading) return <div className="h-64 animate-pulse bg-gray-200 rounded"></div>;

  const chartData = Array.isArray(timeAnalytics) ? timeAnalytics.reduce((acc: any[], item: any) => {
    const existingWeek = acc.find(week => week.week === new Date(item.week_start).toLocaleDateString());
    if (existingWeek) {
      existingWeek[item.team_member] = item.total_hours || 0;
    } else {
      acc.push({
        week: new Date(item.week_start).toLocaleDateString(),
        [item.team_member]: item.total_hours || 0
      });
    }
    return acc;
  }, []) : [];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="w-5 h-5" />
          Time Tracking Analytics
        </CardTitle>
        <CardDescription>30-day rolling window of time spent per team member</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="week" />
            <YAxis />
            <Tooltip />
            <Area type="monotone" dataKey="total_hours" stackId="1" stroke="#8884d8" fill="#8884d8" />
          </AreaChart>
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
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5" />
          Current Workload Distribution
        </CardTitle>
        <CardDescription>Current task assignments and priority distribution by team member</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {Array.isArray(workloadData) && workloadData.map((member: any, index: number) => (
            <div key={member.name} className="space-y-2">
              <div className="flex justify-between items-center">
                <div>
                  <span className="font-medium">{member.name}</span>
                  <Badge variant="outline" className="ml-2">{member.role}</Badge>
                </div>
                <span className="text-sm text-muted-foreground">
                  {member.pending_tasks || 0} pending, {member.active_tasks || 0} active
                </span>
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
                  <div className="font-medium">{member.overdue_tasks || 0}</div>
                  <div className="text-muted-foreground">Overdue</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}