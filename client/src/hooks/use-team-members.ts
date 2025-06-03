import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { type TeamMember, type InsertTeamMember } from "@shared/schema";

export function useTeamMembers() {
  return useQuery<TeamMember[]>({
    queryKey: ["/api/team-members"],
  });
}

export function useTeamMember(id: number) {
  return useQuery<TeamMember>({
    queryKey: ["/api/team-members", id],
    enabled: !!id,
  });
}

export function useCreateTeamMember() {
  return useMutation({
    mutationFn: async (data: InsertTeamMember) => {
      const response = await apiRequest("POST", "/api/team-members", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/team-members"] });
    },
  });
}

export function useUpdateTeamMember() {
  return useMutation({
    mutationFn: async ({ id, updates }: { id: number; updates: Partial<InsertTeamMember> }) => {
      const response = await apiRequest("PUT", `/api/team-members/${id}`, updates);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/team-members"] });
    },
  });
}

export function useDeleteTeamMember() {
  return useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/team-members/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/team-members"] });
    },
  });
}
