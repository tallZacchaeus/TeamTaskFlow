import {
  users,
  teamMembers,
  categories,
  tasks,
  timeEntries,
  activities,
  type User,
  type UpsertUser,
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
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
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
  
  // Data management
  clearAllData(): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async getTeamMembers(): Promise<TeamMember[]> {
    return await db.select().from(teamMembers);
  }

  async getTeamMember(id: number): Promise<TeamMember | undefined> {
    const [member] = await db.select().from(teamMembers).where(eq(teamMembers.id, id));
    return member;
  }

  async createTeamMember(member: InsertTeamMember): Promise<TeamMember> {
    const [newMember] = await db.insert(teamMembers).values(member).returning();
    return newMember;
  }

  async updateTeamMember(id: number, member: Partial<InsertTeamMember>): Promise<TeamMember | undefined> {
    const [updated] = await db
      .update(teamMembers)
      .set(member)
      .where(eq(teamMembers.id, id))
      .returning();
    return updated;
  }

  async deleteTeamMember(id: number): Promise<boolean> {
    const result = await db.delete(teamMembers).where(eq(teamMembers.id, id));
    return result.rowCount > 0;
  }

  async getCategories(): Promise<Category[]> {
    return await db.select().from(categories);
  }

  async getCategory(id: number): Promise<Category | undefined> {
    const [category] = await db.select().from(categories).where(eq(categories.id, id));
    return category;
  }

  async createCategory(category: InsertCategory): Promise<Category> {
    const [newCategory] = await db.insert(categories).values(category).returning();
    return newCategory;
  }

  async updateCategory(id: number, category: Partial<InsertCategory>): Promise<Category | undefined> {
    const [updated] = await db
      .update(categories)
      .set(category)
      .where(eq(categories.id, id))
      .returning();
    return updated;
  }

  async deleteCategory(id: number): Promise<boolean> {
    const result = await db.delete(categories).where(eq(categories.id, id));
    return result.rowCount > 0;
  }

  private async enrichTask(task: Task): Promise<TaskWithDetails> {
    const assignee = task.assigneeId 
      ? await this.getTeamMember(task.assigneeId)
      : undefined;
    const category = task.categoryId 
      ? await this.getCategory(task.categoryId)
      : undefined;

    return {
      ...task,
      assignee,
      category,
    };
  }

  async getTasks(): Promise<TaskWithDetails[]> {
    const allTasks = await db.select().from(tasks);
    return Promise.all(allTasks.map(task => this.enrichTask(task)));
  }

  async getTask(id: number): Promise<TaskWithDetails | undefined> {
    const [task] = await db.select().from(tasks).where(eq(tasks.id, id));
    return task ? this.enrichTask(task) : undefined;
  }

  async createTask(task: InsertTask): Promise<TaskWithDetails> {
    const [newTask] = await db.insert(tasks).values(task).returning();
    return this.enrichTask(newTask);
  }

  async updateTask(id: number, task: Partial<InsertTask>): Promise<TaskWithDetails | undefined> {
    const [updated] = await db
      .update(tasks)
      .set(task)
      .where(eq(tasks.id, id))
      .returning();
    return updated ? this.enrichTask(updated) : undefined;
  }

  async deleteTask(id: number): Promise<boolean> {
    const result = await db.delete(tasks).where(eq(tasks.id, id));
    return result.rowCount > 0;
  }

  async getTasksByStatus(status: string): Promise<TaskWithDetails[]> {
    const filteredTasks = await db.select().from(tasks).where(eq(tasks.status, status));
    return Promise.all(filteredTasks.map(task => this.enrichTask(task)));
  }

  async getTasksByAssignee(assigneeId: number): Promise<TaskWithDetails[]> {
    const filteredTasks = await db.select().from(tasks).where(eq(tasks.assigneeId, assigneeId));
    return Promise.all(filteredTasks.map(task => this.enrichTask(task)));
  }

  async getTasksByCategory(categoryId: number): Promise<TaskWithDetails[]> {
    const filteredTasks = await db.select().from(tasks).where(eq(tasks.categoryId, categoryId));
    return Promise.all(filteredTasks.map(task => this.enrichTask(task)));
  }

  async getTimeEntries(taskId?: number): Promise<TimeEntry[]> {
    if (taskId) {
      return await db.select().from(timeEntries).where(eq(timeEntries.taskId, taskId));
    }
    return await db.select().from(timeEntries);
  }

  async createTimeEntry(entry: InsertTimeEntry): Promise<TimeEntry> {
    const [newEntry] = await db.insert(timeEntries).values(entry).returning();
    return newEntry;
  }

  async getActivities(limit = 50): Promise<Activity[]> {
    return await db.select().from(activities).limit(limit);
  }

  async createActivity(activity: InsertActivity): Promise<Activity> {
    const [newActivity] = await db.insert(activities).values(activity).returning();
    return newActivity;
  }

  async clearAllData(): Promise<void> {
    // Clear all data except users and sessions
    await db.delete(timeEntries);
    await db.delete(activities);
    await db.delete(tasks);
    await db.delete(categories);
    await db.delete(teamMembers);
    
    // Re-add default team members
    await this.initializeDefaultTeamMembers();
  }

  async initializeDefaultTeamMembers(): Promise<void> {
    const defaultMembers = [
      { name: "Zacchaeus James", email: "zacchaeus@company.com", role: "Team Lead", avatarUrl: null },
      { name: "Glory Arogundade", email: "glory@company.com", role: "UI Designer", avatarUrl: null },
      { name: "Fiyinfoluwa Enis", email: "fiyinfoluwa@company.com", role: "Developer", avatarUrl: null },
      { name: "Joseph", email: "joseph@company.com", role: "Developer", avatarUrl: null }
    ];

    for (const member of defaultMembers) {
      await db.insert(teamMembers).values(member).onConflictDoNothing();
    }
  }
}

export const storage = new DatabaseStorage();