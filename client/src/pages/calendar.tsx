import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, User } from "lucide-react";
import { type TaskWithDetails } from "@shared/schema";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isToday, addMonths, subMonths } from "date-fns";

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const { data: tasks = [], isLoading } = useQuery<TaskWithDetails[]>({
    queryKey: ["/api/tasks"],
  });

  if (isLoading) {
    return (
      <div className="flex-1 overflow-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-slate-600">Loading calendar...</p>
          </div>
        </div>
      </div>
    );
  }

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Get tasks for a specific date
  const getTasksForDate = (date: Date) => {
    return tasks.filter(task => 
      task.dueDate && isSameDay(new Date(task.dueDate), date)
    );
  };

  // Get selected date tasks
  const selectedDateTasks = selectedDate ? getTasksForDate(selectedDate) : [];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-red-100 text-red-800";
      case "high":
        return "bg-orange-100 text-orange-800";
      case "medium":
        return "bg-blue-100 text-blue-800";
      case "low":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "in_progress":
        return "bg-yellow-100 text-yellow-800";
      case "todo":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => direction === 'prev' ? subMonths(prev, 1) : addMonths(prev, 1));
    setSelectedDate(null);
  };

  return (
    <div className="flex-1 overflow-auto p-4 md:p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Calendar View</h1>
          <p className="text-slate-600">Track tasks and deadlines by date</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => navigateMonth('prev')}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <h2 className="text-lg font-semibold text-slate-900 min-w-[200px] text-center">
              {format(currentDate, 'MMMM yyyy')}
            </h2>
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => navigateMonth('next')}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
          <Button 
            variant="outline"
            onClick={() => {
              setCurrentDate(new Date());
              setSelectedDate(new Date());
            }}
          >
            Today
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Calendar Grid */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarIcon className="w-5 h-5" />
                {format(currentDate, 'MMMM yyyy')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-1 mb-4">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="p-2 text-center text-sm font-medium text-slate-600">
                    {day}
                  </div>
                ))}
              </div>
              
              <div className="grid grid-cols-7 gap-1">
                {days.map((day, index) => {
                  const dayTasks = getTasksForDate(day);
                  const isSelected = selectedDate && isSameDay(day, selectedDate);
                  const isCurrentMonth = isSameMonth(day, currentDate);
                  const isTodayDate = isToday(day);
                  
                  return (
                    <div
                      key={index}
                      className={`
                        min-h-[100px] p-2 border rounded-lg cursor-pointer transition-colors
                        ${isSelected ? 'bg-primary-50 border-primary-200' : 'hover:bg-slate-50'}
                        ${!isCurrentMonth ? 'text-slate-400 bg-slate-50' : ''}
                        ${isTodayDate ? 'border-primary-300 bg-primary-25' : 'border-slate-200'}
                      `}
                      onClick={() => setSelectedDate(day)}
                    >
                      <div className={`
                        text-sm font-medium mb-1
                        ${isTodayDate ? 'text-primary-600' : ''}
                      `}>
                        {format(day, 'd')}
                      </div>
                      
                      {dayTasks.length > 0 && (
                        <div className="space-y-1">
                          {dayTasks.slice(0, 2).map((task) => (
                            <div
                              key={task.id}
                              className={`
                                text-xs p-1 rounded truncate
                                ${task.status === 'completed' ? 'bg-green-100 text-green-800' :
                                  task.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' :
                                  'bg-blue-100 text-blue-800'}
                              `}
                              title={task.title}
                            >
                              {task.title}
                            </div>
                          ))}
                          {dayTasks.length > 2 && (
                            <div className="text-xs text-slate-500">
                              +{dayTasks.length - 2} more
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Task Details Sidebar */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                {selectedDate ? format(selectedDate, 'MMM dd, yyyy') : 'Select a date'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedDate ? (
                selectedDateTasks.length > 0 ? (
                  <div className="space-y-4">
                    {selectedDateTasks.map((task) => (
                      <div key={task.id} className="border rounded-lg p-3">
                        <h4 className="font-medium text-slate-900 mb-2">{task.title}</h4>
                        
                        {task.description && (
                          <p className="text-sm text-slate-600 mb-3">{task.description}</p>
                        )}
                        
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Badge className={getStatusColor(task.status)}>
                              {task.status.replace('_', ' ')}
                            </Badge>
                            <Badge className={getPriorityColor(task.priority)}>
                              {task.priority}
                            </Badge>
                          </div>
                          
                          {task.assignee && (
                            <div className="flex items-center gap-2 text-sm text-slate-600">
                              <User className="w-4 h-4" />
                              {task.assignee.name}
                            </div>
                          )}
                          
                          {task.category && (
                            <div className="text-sm text-slate-600">
                              Category: {task.category.name}
                            </div>
                          )}
                          
                          {task.estimatedHours && (
                            <div className="text-sm text-slate-600">
                              Estimated: {task.estimatedHours}h
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <CalendarIcon className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                    <p className="text-slate-600">No tasks scheduled for this date</p>
                  </div>
                )
              ) : (
                <div className="text-center py-8">
                  <CalendarIcon className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                  <p className="text-slate-600">Click on a date to view tasks</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>This Month</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-slate-600">Total Tasks</span>
                  <span className="font-medium">
                    {tasks.filter(t => 
                      t.dueDate && 
                      isSameMonth(new Date(t.dueDate), currentDate)
                    ).length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Completed</span>
                  <span className="font-medium text-green-600">
                    {tasks.filter(t => 
                      t.dueDate && 
                      isSameMonth(new Date(t.dueDate), currentDate) &&
                      t.status === 'completed'
                    ).length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Overdue</span>
                  <span className="font-medium text-red-600">
                    {tasks.filter(t => 
                      t.dueDate && 
                      new Date(t.dueDate) < new Date() &&
                      t.status !== 'completed'
                    ).length}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}