import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import { type TaskWithDetails } from "@shared/schema";

const COLORS = ['#10B981', '#F59E0B', '#6B7280', '#EF4444'];

export default function ChartsSection() {
  const { data: tasks = [], isLoading } = useQuery<TaskWithDetails[]>({
    queryKey: ["/api/tasks"],
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card className="animate-pulse">
          <CardContent className="p-6">
            <div className="h-64 bg-slate-200 rounded"></div>
          </CardContent>
        </Card>
        <Card className="animate-pulse">
          <CardContent className="p-6">
            <div className="h-64 bg-slate-200 rounded"></div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Prepare data for status distribution
  const statusData = [
    { name: 'Completed', value: tasks.filter(t => t.status === 'completed').length },
    { name: 'In Progress', value: tasks.filter(t => t.status === 'in_progress').length },
    { name: 'Todo', value: tasks.filter(t => t.status === 'todo').length },
    { name: 'Overdue', value: tasks.filter(t => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'completed').length },
  ];

  // Prepare data for tasks by team member
  const memberData = tasks.reduce((acc, task) => {
    if (task.assignee) {
      const existingMember = acc.find(m => m.name === task.assignee!.name);
      if (existingMember) {
        existingMember.tasks += 1;
      } else {
        acc.push({ name: task.assignee.name, tasks: 1 });
      }
    }
    return acc;
  }, [] as { name: string; tasks: number }[]);

  // Prepare trend data (mock data for demonstration)
  const trendData = [
    { week: 'Week 1', completed: 12 },
    { week: 'Week 2', completed: 18 },
    { week: 'Week 3', completed: 15 },
    { week: 'Week 4', completed: 22 },
    { week: 'Week 5', completed: 19 },
    { week: 'Week 6', completed: 25 },
  ];

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Task Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tasks by Team Member</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={memberData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="tasks" fill="#2563EB" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Task Completion Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="completed" 
                stroke="#10B981" 
                strokeWidth={2}
                dot={{ fill: '#10B981' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </>
  );
}
