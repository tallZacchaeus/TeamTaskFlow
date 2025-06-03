import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./databaseStorage";
import { setupAuth, isAuthenticated, requireRole } from "./auth";
import { 
  insertTeamMemberSchema,
  insertCategorySchema,
  insertTaskSchema,
  insertTimeEntrySchema,
} from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication
  setupAuth(app);

  // Team Members routes (Admin only for write operations)
  app.get("/api/team-members", isAuthenticated, async (req, res) => {
    try {
      const members = await storage.getTeamMembers();
      res.json(members);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch team members" });
    }
  });

  app.post("/api/team-members", requireRole(["admin", "super_admin"]), async (req, res) => {
    try {
      const data = insertTeamMemberSchema.parse(req.body);
      const member = await storage.createTeamMember(data);
      res.status(201).json(member);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create team member" });
      }
    }
  });

  app.put("/api/team-members/:id", requireRole(["admin"]), async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const data = insertTeamMemberSchema.partial().parse(req.body);
      const member = await storage.updateTeamMember(id, data);
      
      if (!member) {
        res.status(404).json({ message: "Team member not found" });
        return;
      }
      
      res.json(member);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to update team member" });
      }
    }
  });

  app.delete("/api/team-members/:id", requireRole(["admin"]), async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteTeamMember(id);
      
      if (!deleted) {
        res.status(404).json({ message: "Team member not found" });
        return;
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete team member" });
    }
  });

  // Categories routes  
  app.get("/api/categories", isAuthenticated, async (req, res) => {
    try {
      const categories = await storage.getCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });

  app.post("/api/categories", requireRole(["admin", "super_admin"]), async (req, res) => {
    try {
      const data = insertCategorySchema.parse(req.body);
      const category = await storage.createCategory(data);
      res.status(201).json(category);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create category" });
      }
    }
  });

  // Tasks routes (read access for all authenticated users)
  app.get("/api/tasks", isAuthenticated, async (req, res) => {
    try {
      const { status, assigneeId, categoryId } = req.query;
      
      let tasks;
      if (status) {
        tasks = await storage.getTasksByStatus(status as string);
      } else if (assigneeId) {
        tasks = await storage.getTasksByAssignee(parseInt(assigneeId as string));
      } else if (categoryId) {
        tasks = await storage.getTasksByCategory(parseInt(categoryId as string));
      } else {
        tasks = await storage.getTasks();
      }
      
      res.json(tasks);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch tasks" });
    }
  });

  app.get("/api/tasks/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const task = await storage.getTask(id);
      
      if (!task) {
        res.status(404).json({ message: "Task not found" });
        return;
      }
      
      res.json(task);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch task" });
    }
  });

  app.post("/api/tasks", requireRole(["admin"]), async (req, res) => {
    try {
      const data = insertTaskSchema.parse(req.body);
      const task = await storage.createTask(data);
      res.status(201).json(task);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create task" });
      }
    }
  });

  app.put("/api/tasks/:id", requireRole(["admin"]), async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const data = insertTaskSchema.partial().parse(req.body);
      const task = await storage.updateTask(id, data);
      
      if (!task) {
        res.status(404).json({ message: "Task not found" });
        return;
      }
      
      res.json(task);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to update task" });
      }
    }
  });

  app.delete("/api/tasks/:id", requireRole(["admin"]), async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteTask(id);
      
      if (!deleted) {
        res.status(404).json({ message: "Task not found" });
        return;
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete task" });
    }
  });

  // Time entries routes
  app.get("/api/time-entries", async (req, res) => {
    try {
      const { taskId } = req.query;
      const entries = await storage.getTimeEntries(taskId ? parseInt(taskId as string) : undefined);
      res.json(entries);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch time entries" });
    }
  });

  app.post("/api/time-entries", async (req, res) => {
    try {
      const data = insertTimeEntrySchema.parse(req.body);
      const entry = await storage.createTimeEntry(data);
      res.status(201).json(entry);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create time entry" });
      }
    }
  });

  // Activities routes
  app.get("/api/activities", async (req, res) => {
    try {
      const { limit } = req.query;
      const activities = await storage.getActivities(limit ? parseInt(limit as string) : undefined);
      res.json(activities);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch activities" });
    }
  });

  // Dashboard stats route
  app.get("/api/dashboard/stats", async (req, res) => {
    try {
      const tasks = await storage.getTasks();
      const totalTasks = tasks.length;
      const inProgress = tasks.filter(t => t.status === "in_progress").length;
      const completed = tasks.filter(t => t.status === "completed").length;
      const overdue = tasks.filter(t => 
        t.dueDate && new Date(t.dueDate) < new Date() && t.status !== "completed"
      ).length;

      res.json({
        totalTasks,
        inProgress,
        completed,
        overdue,
        todo: tasks.filter(t => t.status === "todo").length,
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch dashboard stats" });
    }
  });

  // Clear all data (Admin only)
  app.delete("/api/data/clear-all", requireRole(["admin"]), async (req, res) => {
    try {
      await storage.clearAllData();
      res.json({ success: true, message: "All data cleared successfully" });
    } catch (error) {
      console.error("Error clearing data:", error);
      res.status(500).json({ error: "Failed to clear data" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
