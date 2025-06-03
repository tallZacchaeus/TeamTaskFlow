import { 
  users, 
  teamMembers,
  categories,
  tasks,
  timeEntries,
  activities,
  type User, 
  type InsertUser,
  type TeamMember,
  type InsertTeamMember,
  type Category,
  type InsertCategory,
  type Task,
  type InsertTask,
  type TimeEntry,
  type InsertTimeEntry,
  type Activity,
  type InsertActivity,
  type TaskWithDetails,
} from "@shared/schema";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Team Members
  getTeamMembers(): Promise<TeamMember[]>;
  getTeamMember(id: number): Promise<TeamMember | undefined>;
  createTeamMember(member: InsertTeamMember): Promise<TeamMember>;
  updateTeamMember(id: number, member: Partial<InsertTeamMember>): Promise<TeamMember | undefined>;
  deleteTeamMember(id: number): Promise<boolean>;
  
  // Categories
  getCategories(): Promise<Category[]>;
  getCategory(id: number): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  updateCategory(id: number, category: Partial<InsertCategory>): Promise<Category | undefined>;
  deleteCategory(id: number): Promise<boolean>;
  
  // Tasks
  getTasks(): Promise<TaskWithDetails[]>;
  getTask(id: number): Promise<TaskWithDetails | undefined>;
  createTask(task: InsertTask): Promise<TaskWithDetails>;
  updateTask(id: number, task: Partial<InsertTask>): Promise<TaskWithDetails | undefined>;
  deleteTask(id: number): Promise<boolean>;
  getTasksByStatus(status: string): Promise<TaskWithDetails[]>;
  getTasksByAssignee(assigneeId: number): Promise<TaskWithDetails[]>;
  getTasksByCategory(categoryId: number): Promise<TaskWithDetails[]>;
  
  // Time Entries
  getTimeEntries(taskId?: number): Promise<TimeEntry[]>;
  createTimeEntry(entry: InsertTimeEntry): Promise<TimeEntry>;
  
  // Activities
  getActivities(limit?: number): Promise<Activity[]>;
  createActivity(activity: InsertActivity): Promise<Activity>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private teamMembers: Map<number, TeamMember>;
  private categories: Map<number, Category>;
  private tasks: Map<number, Task>;
  private timeEntries: Map<number, TimeEntry>;
  private activities: Map<number, Activity>;
  private currentId: { [key: string]: number };

  constructor() {
    this.users = new Map();
    this.teamMembers = new Map();
    this.categories = new Map();
    this.tasks = new Map();
    this.timeEntries = new Map();
    this.activities = new Map();
    this.currentId = {
      users: 1,
      teamMembers: 1,
      categories: 1,
      tasks: 1,
      timeEntries: 1,
      activities: 1,
    };

    // Initialize with some default data
    this.initializeDefaultData();
  }

  private initializeDefaultData() {
    // Create default team members
    const defaultMembers = [
      { name: "Alex Chen", email: "alex@company.com", role: "Team Lead", avatarUrl: null },
      { name: "Sarah Johnson", email: "sarah@company.com", role: "Marketing Manager", avatarUrl: null },
      { name: "Mike Chen", email: "mike@company.com", role: "Developer", avatarUrl: null },
      { name: "Lisa Wang", email: "lisa@company.com", role: "Designer", avatarUrl: null },
    ];

    defaultMembers.forEach(member => {
      const id = this.currentId.teamMembers++;
      this.teamMembers.set(id, { ...member, id });
    });

    // Create default categories
    const defaultCategories = [
      { name: "Marketing", parentId: null, color: "#3b82f6" },
      { name: "Development", parentId: null, color: "#10b981" },
      { name: "Design", parentId: null, color: "#8b5cf6" },
      { name: "Analytics", parentId: null, color: "#f59e0b" },
    ];

    defaultCategories.forEach(category => {
      const id = this.currentId.categories++;
      this.categories.set(id, { ...category, id });
    });

    // Create some sample tasks to demonstrate the application
    const sampleTasks = [
      {
        title: "Redesign landing page",
        description: "Update the main landing page with new branding and improved UX",
        status: "in_progress",
        priority: "high",
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        estimatedHours: 20,
        assigneeId: 4, // Lisa Wang (Designer)
        categoryId: 3, // Design
        position: 0
      },
      {
        title: "Implement user authentication",
        description: "Add login and registration functionality with JWT tokens",
        status: "todo",
        priority: "urgent",
        dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
        estimatedHours: 16,
        assigneeId: 3, // Mike Chen (Developer)
        categoryId: 2, // Development
        position: 0
      },
      {
        title: "Social media campaign launch",
        description: "Coordinate the launch of Q1 social media campaign across all platforms",
        status: "completed",
        priority: "medium",
        dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        estimatedHours: 12,
        assigneeId: 2, // Sarah Johnson (Marketing Manager)
        categoryId: 1, // Marketing
        position: 0
      },
      {
        title: "Set up analytics dashboard",
        description: "Configure Google Analytics and create custom dashboard for tracking KPIs",
        status: "todo",
        priority: "medium",
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
        estimatedHours: 8,
        assigneeId: 1, // Alex Chen (Team Lead)
        categoryId: 4, // Analytics
        position: 1
      }
    ];

    sampleTasks.forEach(task => {
      const id = this.currentId.tasks++;
      const now = new Date();
      const newTask: Task = {
        id,
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        dueDate: task.dueDate,
        estimatedHours: task.estimatedHours,
        actualHours: task.status === "completed" ? task.estimatedHours : Math.floor(task.estimatedHours * 0.3),
        assigneeId: task.assigneeId,
        categoryId: task.categoryId,
        createdAt: now,
        updatedAt: now,
        position: task.position
      };
      this.tasks.set(id, newTask);

      // Create activity for each task
      const activityId = this.currentId.activities++;
      const activity: Activity = {
        id: activityId,
        type: "created",
        taskId: id,
        memberId: task.assigneeId,
        description: `Task "${task.title}" was created`,
        createdAt: now
      };
      this.activities.set(activityId, activity);
    });
  }

  // Users
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId.users++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Team Members
  async getTeamMembers(): Promise<TeamMember[]> {
    return Array.from(this.teamMembers.values());
  }

  async getTeamMember(id: number): Promise<TeamMember | undefined> {
    return this.teamMembers.get(id);
  }

  async createTeamMember(member: InsertTeamMember): Promise<TeamMember> {
    const id = this.currentId.teamMembers++;
    const newMember: TeamMember = { ...member, id, avatarUrl: member.avatarUrl || null };
    this.teamMembers.set(id, newMember);
    return newMember;
  }

  async updateTeamMember(id: number, member: Partial<InsertTeamMember>): Promise<TeamMember | undefined> {
    const existing = this.teamMembers.get(id);
    if (!existing) return undefined;

    const updated = { ...existing, ...member };
    this.teamMembers.set(id, updated);
    return updated;
  }

  async deleteTeamMember(id: number): Promise<boolean> {
    return this.teamMembers.delete(id);
  }

  // Categories
  async getCategories(): Promise<Category[]> {
    return Array.from(this.categories.values());
  }

  async getCategory(id: number): Promise<Category | undefined> {
    return this.categories.get(id);
  }

  async createCategory(category: InsertCategory): Promise<Category> {
    const id = this.currentId.categories++;
    const newCategory: Category = { ...category, id };
    this.categories.set(id, newCategory);
    return newCategory;
  }

  async updateCategory(id: number, category: Partial<InsertCategory>): Promise<Category | undefined> {
    const existing = this.categories.get(id);
    if (!existing) return undefined;

    const updated: Category = { ...existing, ...category };
    this.categories.set(id, updated);
    return updated;
  }

  async deleteCategory(id: number): Promise<boolean> {
    return this.categories.delete(id);
  }

  // Tasks
  private enrichTask(task: Task): TaskWithDetails {
    const assignee = task.assigneeId ? this.teamMembers.get(task.assigneeId) : undefined;
    const category = task.categoryId ? this.categories.get(task.categoryId) : undefined;
    return { ...task, assignee, category };
  }

  async getTasks(): Promise<TaskWithDetails[]> {
    return Array.from(this.tasks.values()).map(task => this.enrichTask(task));
  }

  async getTask(id: number): Promise<TaskWithDetails | undefined> {
    const task = this.tasks.get(id);
    return task ? this.enrichTask(task) : undefined;
  }

  async createTask(task: InsertTask): Promise<TaskWithDetails> {
    const id = this.currentId.tasks++;
    const now = new Date();
    const newTask: Task = { 
      id, 
      title: task.title,
      description: task.description || null,
      status: task.status || "todo",
      priority: task.priority || "medium",
      dueDate: task.dueDate || null,
      estimatedHours: task.estimatedHours || null,
      actualHours: 0,
      assigneeId: task.assigneeId || null,
      categoryId: task.categoryId || null,
      createdAt: now, 
      updatedAt: now,
      position: task.position || 0,
    };
    this.tasks.set(id, newTask);

    // Create activity
    await this.createActivity({
      type: "created",
      taskId: id,
      memberId: task.assigneeId || null,
      description: `Task "${task.title}" was created`,
    });

    return this.enrichTask(newTask);
  }

  async updateTask(id: number, task: Partial<InsertTask>): Promise<TaskWithDetails | undefined> {
    const existing = this.tasks.get(id);
    if (!existing) return undefined;

    const updated = { ...existing, ...task, updatedAt: new Date() };
    this.tasks.set(id, updated);

    // Create activity for status changes
    if (task.status && task.status !== existing.status) {
      await this.createActivity({
        type: "updated",
        taskId: id,
        memberId: updated.assigneeId || null,
        description: `Task status changed to ${task.status}`,
      });
    }

    return this.enrichTask(updated);
  }

  async deleteTask(id: number): Promise<boolean> {
    return this.tasks.delete(id);
  }

  async getTasksByStatus(status: string): Promise<TaskWithDetails[]> {
    return Array.from(this.tasks.values())
      .filter(task => task.status === status)
      .map(task => this.enrichTask(task));
  }

  async getTasksByAssignee(assigneeId: number): Promise<TaskWithDetails[]> {
    return Array.from(this.tasks.values())
      .filter(task => task.assigneeId === assigneeId)
      .map(task => this.enrichTask(task));
  }

  async getTasksByCategory(categoryId: number): Promise<TaskWithDetails[]> {
    return Array.from(this.tasks.values())
      .filter(task => task.categoryId === categoryId)
      .map(task => this.enrichTask(task));
  }

  // Time Entries
  async getTimeEntries(taskId?: number): Promise<TimeEntry[]> {
    const entries = Array.from(this.timeEntries.values());
    return taskId ? entries.filter(entry => entry.taskId === taskId) : entries;
  }

  async createTimeEntry(entry: InsertTimeEntry): Promise<TimeEntry> {
    const id = this.currentId.timeEntries++;
    const newEntry: TimeEntry = { 
      ...entry, 
      id, 
      date: new Date(),
      description: entry.description || null
    };
    this.timeEntries.set(id, newEntry);

    // Update task actual hours
    const task = this.tasks.get(entry.taskId);
    if (task) {
      const updated = { ...task, actualHours: (task.actualHours || 0) + entry.hours };
      this.tasks.set(entry.taskId, updated);
    }

    return newEntry;
  }

  // Activities
  async getActivities(limit = 50): Promise<Activity[]> {
    return Array.from(this.activities.values())
      .sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime())
      .slice(0, limit);
  }

  async createActivity(activity: InsertActivity): Promise<Activity> {
    const id = this.currentId.activities++;
    const newActivity: Activity = { 
      id,
      type: activity.type,
      taskId: activity.taskId || null,
      memberId: activity.memberId || null,
      description: activity.description,
      createdAt: new Date()
    };
    this.activities.set(id, newActivity);
    return newActivity;
  }
}

export const storage = new MemStorage();
