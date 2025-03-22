// src/type.ts
export interface Task {
    id: string;
    title: string;
    description: string;
    category: string;
    dueDate: string;
    status: "todo" | "in-progress" | "completed";
    createdAt?: Date; // Ensure strict typing
  }
  