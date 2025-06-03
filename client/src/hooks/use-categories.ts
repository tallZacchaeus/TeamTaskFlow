import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { type Category, type InsertCategory } from "@shared/schema";

export function useCategories() {
  return useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });
}

export function useCategory(id: number) {
  return useQuery<Category>({
    queryKey: ["/api/categories", id],
    enabled: !!id,
  });
}

export function useCreateCategory() {
  return useMutation({
    mutationFn: async (data: InsertCategory) => {
      const response = await apiRequest("POST", "/api/categories", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/categories"] });
    },
  });
}

export function useUpdateCategory() {
  return useMutation({
    mutationFn: async ({ id, updates }: { id: number; updates: Partial<InsertCategory> }) => {
      const response = await apiRequest("PUT", `/api/categories/${id}`, updates);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/categories"] });
    },
  });
}

export function useDeleteCategory() {
  return useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/categories/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/categories"] });
    },
  });
}
