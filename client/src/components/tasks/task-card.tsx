import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, User, Calendar } from "lucide-react";
import { type TaskWithDetails } from "@shared/schema";
import { format } from "date-fns";

interface TaskCardProps {
  task: TaskWithDetails;
}

export default function TaskCard({ task }: TaskCardProps) {
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== "completed";
  
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

  const getCategoryColor = (categoryName?: string) => {
    if (!categoryName) return "bg-gray-100 text-gray-800";
    
    const colors: Record<string, string> = {
      "Marketing": "bg-blue-100 text-blue-800",
      "Development": "bg-green-100 text-green-800",
      "Design": "bg-purple-100 text-purple-800",
      "Analytics": "bg-yellow-100 text-yellow-800",
    };
    
    return colors[categoryName] || "bg-gray-100 text-gray-800";
  };

  return (
    <Card className={`hover:shadow-md transition-shadow cursor-pointer ${task.status === "completed" ? "opacity-75" : ""}`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h4 className={`font-medium text-slate-900 text-sm ${task.status === "completed" ? "line-through" : ""}`}>
            {task.title}
          </h4>
          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
            <MoreHorizontal className="w-3 h-3" />
          </Button>
        </div>
        
        {task.description && (
          <p className="text-xs text-slate-600 mb-3 line-clamp-2">
            {task.description}
          </p>
        )}

        {task.status === "in_progress" && task.estimatedHours && (
          <div className="w-full bg-slate-200 rounded-full h-1.5 mb-3">
            <div 
              className="bg-amber-600 h-1.5 rounded-full" 
              style={{ width: `${Math.min((task.actualHours || 0) / task.estimatedHours * 100, 100)}%` }}
            ></div>
          </div>
        )}

        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            {task.category && (
              <Badge className={getCategoryColor(task.category.name)}>
                {task.category.name}
              </Badge>
            )}
            <Badge className={getPriorityColor(task.priority)}>
              {task.priority}
            </Badge>
          </div>
          
          <div className="flex items-center gap-2">
            {task.dueDate && (
              <div className={`flex items-center gap-1 ${isOverdue ? "text-red-600" : "text-slate-500"}`}>
                <Calendar className="w-3 h-3" />
                <span>{format(new Date(task.dueDate), "MMM dd")}</span>
              </div>
            )}
            {task.assignee && (
              <div className="flex items-center gap-1 text-slate-500" title={task.assignee.name}>
                <User className="w-3 h-3" />
                <span className="truncate max-w-20">{task.assignee.name.split(' ')[0]}</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
