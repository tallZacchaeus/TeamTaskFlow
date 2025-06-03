import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Users, Clock, TrendingUp, BarChart3, Target, User, Award, CheckCircle2 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import { type TaskWithDetails, type TeamMember, type Activity } from "@shared/schema";
import { format, subDays, isAfter, isBefore, startOfWeek, endOfWeek, eachDayOfInterval } from "date-fns";

const COLORS = ['#10B981', '#F59E0B', '#6B7280', '#EF4444', '#8B5CF6', '#3B82F6'];

export default function Reports() {
  const [selectedMember, setSelectedMember] = useState<string>("all");
  const [reportView, setReportView] = useState<"overview" | "member">("overview");

  const { data: tasks = [], isLoading: tasksLoading } = useQuery<TaskWithDetails[]>({
    queryKey: ["/api/tasks"],
  });

  const { data: teamMembers = [], isLoading: membersLoading } = useQuery<TeamMember[]>({
    queryKey: ["/api/team-members"],
  });

  const { data: activities = [], isLoading: activitiesLoading } = useQuery<Activity[]>({
    queryKey: ["/api/activities"],
  });

  if (tasksLoading || membersLoading || activitiesLoading) {
    return (
      <div className="flex-1 overflow-auto p-4 md:p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-slate-600">Loading reports...</p>
          </div>
        </div>
      </div>
    );
  }

  // Calculate report data
  const today = new Date();
  const weekStart = startOfWeek(today);
  const weekEnd = endOfWeek(today);
  const monthStart = subDays(today, 30);

  // Calculate member-specific metrics
  const getMemberMetrics = (memberId: number) => {
    const memberTasks = tasks.filter(t => t.assigneeId === memberId);
    const completedTasks = memberTasks.filter(t => t.status === 'completed');
    const inProgressTasks = memberTasks.filter(t => t.status === 'in_progress');
    const todoTasks = memberTasks.filter(t => t.status === 'todo');
    const overdueTasks = memberTasks.filter(t => 
      t.dueDate && new Date(t.dueDate) < today && t.status !== 'completed'
    );
    
    const completionRate = memberTasks.length > 0 ? (completedTasks.length / memberTasks.length) * 100 : 0;
    const avgEstimatedHours = memberTasks.length > 0 
      ? memberTasks.reduce((acc, task) => acc + (task.estimatedHours || 0), 0) / memberTasks.length 
      : 0;
    
    return {
      totalTasks: memberTasks.length,
      completed: completedTasks.length,
      inProgress: inProgressTasks.length,
      todo: todoTasks.length,
      overdue: overdueTasks.length,
      completionRate,
      avgEstimatedHours,
      memberActivities: activities.filter(a => a.memberId === memberId).length
    };
  };

  // Team member performance data
  const memberPerformanceData = teamMembers.map(member => {
    const metrics = getMemberMetrics(member.id);
    return {
      name: member.name,
      completed: metrics.completed,
      inProgress: metrics.inProgress,
      todo: metrics.todo,
      overdue: metrics.overdue,
      completionRate: metrics.completionRate,
      totalTasks: metrics.totalTasks
    };
  });

  // Tasks by status
  const tasksByStatus = [
    { name: 'Completed', value: tasks.filter(t => t.status === 'completed').length, color: '#10B981' },
    { name: 'In Progress', value: tasks.filter(t => t.status === 'in_progress').length, color: '#F59E0B' },
    { name: 'Todo', value: tasks.filter(t => t.status === 'todo').length, color: '#6B7280' },
    { name: 'Overdue', value: tasks.filter(t => t.dueDate && new Date(t.dueDate) < today && t.status !== 'completed').length, color: '#EF4444' }
  ];

  // Tasks by priority
  const tasksByPriority = [
    { name: 'Low', value: tasks.filter(t => t.priority === 'low').length },
    { name: 'Medium', value: tasks.filter(t => t.priority === 'medium').length },
    { name: 'High', value: tasks.filter(t => t.priority === 'high').length },
    { name: 'Urgent', value: tasks.filter(t => t.priority === 'urgent').length },
  ];

  // Weekly progress data
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });
  const weeklyProgress = weekDays.map(day => {
    const dayActivities = activities.filter(a => 
      a.createdAt && 
      format(new Date(a.createdAt), 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd')
    );
    return {
      day: format(day, 'EEE'),
      activities: dayActivities.length,
      completed: dayActivities.filter(a => a.type === 'completed').length,
    };
  });

  // Calculate summary metrics
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  const overdueTasks = tasks.filter(t => 
    t.dueDate && new Date(t.dueDate) < today && t.status !== 'completed'
  ).length;
  const totalActualHours = tasks.reduce((acc, task) => acc + (task.estimatedHours || 0), 0);
  const thisMonthActivities = activities.filter(a => 
    a.createdAt && 
    isAfter(new Date(a.createdAt), monthStart)
  );

  return (
    <div className="flex-1 overflow-auto p-4 md:p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Reports & Analytics</h1>
        <p className="text-slate-600">Track team performance and project insights</p>
        
        {/* Report Controls */}
        <div className="flex flex-col md:flex-row gap-4 mt-4">
          <div className="flex gap-2">
            <Button
              variant={reportView === "overview" ? "default" : "outline"}
              onClick={() => setReportView("overview")}
              size="sm"
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              Overview
            </Button>
            <Button
              variant={reportView === "member" ? "default" : "outline"}
              onClick={() => setReportView("member")}
              size="sm"
            >
              <User className="w-4 h-4 mr-2" />
              Team Members
            </Button>
          </div>
          
          {reportView === "member" && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-600">Filter by member:</span>
              <Select value={selectedMember} onValueChange={setSelectedMember}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Members</SelectItem>
                  {teamMembers.map(member => (
                    <SelectItem key={member.id} value={member.id.toString()}>
                      {member.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      </div>

      {reportView === "overview" ? (
        <>
          {/* Overview Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <Card className="shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600">Completion Rate</p>
                    <p className="text-2xl font-bold text-slate-900">{completionRate}%</p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <Target className="w-6 h-6 text-green-600" />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm">
                  <span className="text-green-600 font-medium">
                    {completedTasks}/{totalTasks} tasks
                  </span>
                  <span className="text-slate-500 ml-2">completed</span>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600">Overdue Tasks</p>
                    <p className="text-2xl font-bold text-slate-900">{overdueTasks}</p>
                  </div>
                  <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-red-600" />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm">
                  <span className="text-red-600 font-medium">
                    {totalTasks > 0 ? Math.round((overdueTasks / totalTasks) * 100) : 0}%
                  </span>
                  <span className="text-slate-500 ml-2">of total tasks</span>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600">Hours Logged</p>
                    <p className="text-2xl font-bold text-slate-900">{totalActualHours}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <Clock className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm">
                  <span className="text-blue-600 font-medium">
                    {Math.round(totalActualHours / Math.max(totalTasks, 1))} hrs
                  </span>
                  <span className="text-slate-500 ml-2">per task avg</span>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600">Team Activity</p>
                    <p className="text-2xl font-bold text-slate-900">{thisMonthActivities.length}</p>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm">
                  <span className="text-purple-600 font-medium">
                    {thisMonthActivities.length} activities
                  </span>
                  <span className="text-slate-500 ml-2">this month</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <Card>
              <CardHeader>
                <CardTitle>Task Status Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={tasksByStatus}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}`}
                    >
                      {tasksByStatus.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Priority Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={tasksByPriority}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#2563EB" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </>
      ) : (
        <div className="space-y-6">
          {selectedMember === "all" ? (
            /* All Members Performance */
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <Card>
                <CardHeader>
                  <CardTitle>Team Member Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={memberPerformanceData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="completed" fill="#10B981" name="Completed" />
                      <Bar dataKey="inProgress" fill="#F59E0B" name="In Progress" />
                      <Bar dataKey="todo" fill="#6B7280" name="Todo" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Completion Rates</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={memberPerformanceData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="completionRate" fill="#3B82F6" name="Completion %" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          ) : (
            /* Individual Member Report */
            (() => {
              const member = teamMembers.find(m => m.id === parseInt(selectedMember));
              const metrics = member ? getMemberMetrics(member.id) : null;
              const memberTasks = member ? tasks.filter(t => t.assigneeId === member.id) : [];
              
              if (!member || !metrics) return null;
              
              return (
                <div className="space-y-6">
                  {/* Member Header */}
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                          <User className="w-8 h-8 text-blue-600" />
                        </div>
                        <div>
                          <h2 className="text-2xl font-bold text-slate-900">{member.name}</h2>
                          <p className="text-slate-600">{member.email}</p>
                          <Badge variant="secondary" className="mt-2">{member.role}</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Member Metrics */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-slate-600">Total Tasks</p>
                            <p className="text-2xl font-bold text-slate-900">{metrics.totalTasks}</p>
                          </div>
                          <Target className="w-8 h-8 text-blue-600" />
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-slate-600">Completion Rate</p>
                            <p className="text-2xl font-bold text-slate-900">{Math.round(metrics.completionRate)}%</p>
                          </div>
                          <CheckCircle2 className="w-8 h-8 text-green-600" />
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-slate-600">Overdue Tasks</p>
                            <p className="text-2xl font-bold text-slate-900">{metrics.overdue}</p>
                          </div>
                          <Calendar className="w-8 h-8 text-red-600" />
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-slate-600">Activities</p>
                            <p className="text-2xl font-bold text-slate-900">{metrics.memberActivities}</p>
                          </div>
                          <Award className="w-8 h-8 text-purple-600" />
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Member Task Distribution */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Task Status Distribution</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                          <PieChart>
                            <Pie
                              data={[
                                { name: 'Completed', value: metrics.completed, color: '#10B981' },
                                { name: 'In Progress', value: metrics.inProgress, color: '#F59E0B' },
                                { name: 'Todo', value: metrics.todo, color: '#6B7280' },
                                { name: 'Overdue', value: metrics.overdue, color: '#EF4444' }
                              ]}
                              cx="50%"
                              cy="50%"
                              outerRadius={80}
                              fill="#8884d8"
                              dataKey="value"
                              label={({ name, value }) => `${name}: ${value}`}
                            >
                              {[
                                { name: 'Completed', value: metrics.completed, color: '#10B981' },
                                { name: 'In Progress', value: metrics.inProgress, color: '#F59E0B' },
                                { name: 'Todo', value: metrics.todo, color: '#6B7280' },
                                { name: 'Overdue', value: metrics.overdue, color: '#EF4444' }
                              ].map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Pie>
                            <Tooltip />
                          </PieChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Recent Tasks</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {memberTasks.slice(0, 5).map(task => (
                            <div key={task.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                              <div className="flex-1">
                                <p className="font-medium text-slate-900">{task.title}</p>
                                <p className="text-sm text-slate-600">{task.category?.name}</p>
                              </div>
                              <Badge 
                                variant={task.status === 'completed' ? 'default' : task.status === 'in_progress' ? 'secondary' : 'outline'}
                                className={
                                  task.status === 'completed' ? 'bg-green-100 text-green-800' :
                                  task.status === 'in_progress' ? 'bg-amber-100 text-amber-800' :
                                  'bg-gray-100 text-gray-800'
                                }
                              >
                                {task.status.replace('_', ' ')}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              );
            })()
          )}
        </div>
      )}
    </div>
  );
}