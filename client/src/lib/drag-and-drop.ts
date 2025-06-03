import { type TaskWithDetails } from "@shared/schema";

export interface DragResult {
  source: {
    droppableId: string;
    index: number;
  };
  destination: {
    droppableId: string;
    index: number;
  } | null;
  draggableId: string;
}

export function reorderTasks(
  tasks: TaskWithDetails[],
  sourceIndex: number,
  destinationIndex: number
): TaskWithDetails[] {
  const result = Array.from(tasks);
  const [removed] = result.splice(sourceIndex, 1);
  result.splice(destinationIndex, 0, removed);

  return result.map((task, index) => ({
    ...task,
    position: index,
  }));
}

export function moveBetweenColumns(
  source: TaskWithDetails[],
  destination: TaskWithDetails[],
  sourceIndex: number,
  destinationIndex: number,
  newStatus: string
): {
  newSource: TaskWithDetails[];
  newDestination: TaskWithDetails[];
} {
  const sourceClone = Array.from(source);
  const destClone = Array.from(destination);
  const [removed] = sourceClone.splice(sourceIndex, 1);

  // Update the task status
  const updatedTask = {
    ...removed,
    status: newStatus,
    position: destinationIndex,
  };

  destClone.splice(destinationIndex, 0, updatedTask);

  return {
    newSource: sourceClone.map((task, index) => ({
      ...task,
      position: index,
    })),
    newDestination: destClone.map((task, index) => ({
      ...task,
      position: index,
    })),
  };
}

export function getTasksByStatus(tasks: TaskWithDetails[], status: string): TaskWithDetails[] {
  return tasks
    .filter(task => task.status === status)
    .sort((a, b) => (a.position || 0) - (b.position || 0));
}
