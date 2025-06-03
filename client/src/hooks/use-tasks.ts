import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { type TaskWithDetails, type InsertTask } from "@shared/schema";

export function useTasks() {
  return useQuery<TaskWithDetails[]>({
    queryKey: ["/api/tasks"],
  });
}

export function useTask(id: number) {
  return useQuery<TaskWithDetails>({
    queryKey: ["/api/tasks", id],
    enabled: !!id,
  });
}

export function useCreateTask() {
  return useMutation({
    mutationFn: async (data: InsertTask) => {
      const response = await apiRequest("POST", "/api/tasks", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/stats"] });
      queryClient.invalidateQueries({ queryKey: ["/api/activities"] });
    },
  });
}

export function useUpdateTask() {
  return useMutation({
    mutationFn: async ({ id, updates }: { id: number; updates: Partial<InsertTask> }) => {
      const response = await apiRequest("PUT", `/api/tasks/${id}`, updates);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/stats"] });
      queryClient.invalidateQueries({ queryKey: ["/api/activities"] });
    },
  });
}

export function useDeleteTask() {
  return useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/tasks/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/stats"] });
      queryClient.invalidateQueries({ queryKey: ["/api/activities"] });
    },
  });
}
