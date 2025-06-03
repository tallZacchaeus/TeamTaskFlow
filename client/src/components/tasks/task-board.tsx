import { useQuery, useMutation } from "@tanstack/react-query";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import TaskCard from "./task-card";
import { Badge } from "@/components/ui/badge";
import { type TaskWithDetails } from "@shared/schema";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface TaskBoardProps {
  filters: {
    category: string;
    assignee: string;
    status: string;
    startDate: string;
    endDate: string;
  };
  onNewTask: () => void;
}

export default function TaskBoard({ filters }: TaskBoardProps) {
  const { toast } = useToast();

  const { data: allTasks = [], isLoading } = useQuery<TaskWithDetails[]>({
    queryKey: ["/api/tasks"],
  });

  const updateTaskMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: number; updates: Partial<TaskWithDetails> }) => {
      const response = await apiRequest("PUT", `/api/tasks/${id}`, updates);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update task",
        variant: "destructive",
      });
    },
  });

  // Filter tasks based on filters
  const filteredTasks = allTasks.filter((task) => {
    if (filters.category && task.categoryId?.toString() !== filters.category) return false;
    if (filters.assignee && task.assigneeId?.toString() !== filters.assignee) return false;
    if (filters.status && task.status !== filters.status) return false;
    if (filters.startDate && task.dueDate && new Date(task.dueDate) < new Date(filters.startDate)) return false;
    if (filters.endDate && task.dueDate && new Date(task.dueDate) > new Date(filters.endDate)) return false;
    return true;
  });

  const todoTasks = filteredTasks.filter(task => task.status === "todo");
  const inProgressTasks = filteredTasks.filter(task => task.status === "in_progress");
  const completedTasks = filteredTasks.filter(task => task.status === "completed");

  const handleDragEnd = (result: any) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      return;
    }

    const taskId = parseInt(draggableId);
    let newStatus = destination.droppableId;

    updateTaskMutation.mutate({
      id: taskId,
      updates: { status: newStatus },
    });
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-slate-100 rounded-xl p-4 animate-pulse">
            <div className="h-6 bg-slate-200 rounded mb-4"></div>
            <div className="space-y-3">
              {[...Array(2)].map((_, j) => (
                <div key={j} className="h-32 bg-slate-200 rounded"></div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  const columns = [
    { id: "todo", title: "Todo", tasks: todoTasks, bgColor: "bg-slate-100", badgeColor: "bg-slate-200 text-slate-600" },
    { id: "in_progress", title: "In Progress", tasks: inProgressTasks, bgColor: "bg-amber-50", badgeColor: "bg-amber-200 text-amber-800" },
    { id: "completed", title: "Completed", tasks: completedTasks, bgColor: "bg-green-50", badgeColor: "bg-green-200 text-green-800" },
  ];

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {columns.map((column) => (
          <div key={column.id} className={`${column.bgColor} rounded-xl p-4`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-slate-900">{column.title}</h3>
              <Badge className={column.badgeColor}>{column.tasks.length}</Badge>
            </div>
            
            <Droppable droppableId={column.id}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`space-y-3 min-h-[200px] ${
                    snapshot.isDraggingOver ? "bg-white/50 rounded-lg" : ""
                  }`}
                >
                  {column.tasks.map((task, index) => (
                    <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={snapshot.isDragging ? "transform rotate-3" : ""}
                        >
                          <TaskCard task={task} />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        ))}
      </div>
    </DragDropContext>
  );
}
