import { db } from "./firebaseConfig";
import { collection, doc, setDoc, updateDoc, addDoc, query, getDocs, deleteDoc, serverTimestamp, orderBy } from "firebase/firestore";
import { Task } from "../type";

// Firestore Service Class
class FirestoreService {
  
  /**
   * Save user details in Firestore
   */
  async addUser(userId: string, userData: object) {
    try {
      await setDoc(doc(db, "users", userId), userData, { merge: true });
      console.log("✅ User added successfully");
    } catch (error) {
      console.error("🔥 Error adding user:", error);
    }
  }

  /**
   * Add a new task under a user
   */
  async addTask(userId: string | null, taskData: Partial<Task>) {
    if (!userId) {
      console.error("🚨 User not authenticated.");
      return { success: false, message: "User not authenticated." };
    }
  
    console.log(`👤 Adding task for user ID: ${userId}`);
  
    try {
      const userTasksCollection = collection(db, "users", userId, "tasks");
      const validStatuses = ["todo", "in-progress", "completed"] as const;
      const docRef = await addDoc(userTasksCollection, {
        ...taskData,
        status: validStatuses.includes(taskData.status as any) ? taskData.status : "todo", // Default to "todo"
        dueDate: taskData.dueDate ? new Date(taskData.dueDate).toISOString().split("T")[0] : null,
        createdAt: serverTimestamp(),
      });
  
      console.log(`✅ Task added successfully with ID: ${docRef.id}`);
      return { success: true, message: "Task added successfully", taskId: docRef.id };
    } catch (error: any) {
      console.error("🔥 Error adding task:", error.message);
      return { success: false, message: error.message };
    }
  }

  /**
   * Fetch tasks for a specific user
   */
  async getUserTasks(userId: string): Promise<Task[]> {
    if (!userId) {
      console.error("🚨 User not authenticated.");
      return [];
    }
  
    try {
      const tasksCollection = collection(db, "users", userId, "tasks");
      const q = query(tasksCollection, orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      const validStatuses = ["todo", "in-progress", "completed"] as const;
      const tasks: Task[] = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          title: data.title || "Untitled Task",
          description: data.description || "No description",
          category: data.category || "Uncategorized",
          dueDate: data.dueDate ? new Date(data.dueDate).toISOString() : "", // Convert to ISO
          status: validStatuses.includes(data.status) ? data.status : "todo",
        };
      });
  
      console.log("✅ Retrieved tasks from Firestore:", tasks);
      return tasks;
    } catch (error: any) {
      console.error("🔥 Error fetching tasks:", error.message);
      return [];
    }
  }

  /**
   * Update the details of a task
   */
  async updateTask(userId: string, taskId: string, updatedData: Partial<Task>) {
    if (!userId) {
      console.error("🚨 User not authenticated.");
      return { success: false, message: "User not authenticated." };
    }
  
    try {
      const taskDoc = doc(db, "users", userId, "tasks", taskId);
      await updateDoc(taskDoc, updatedData);
      console.log("✅ Task updated successfully");
      return { success: true };
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("🔥 Error updating task:", error.message);
        return { success: false, message: error.message };
      } else {
        console.error("🔥 Unknown error:", error);
        return { success: false, message: "An unknown error occurred." };
      }
    }
  }
  

  /**
   * Delete a task
   */
  async deleteTask(userId: string | null, taskId: string) {
    if (!userId) {
      console.error("🚨 User not authenticated.");
      return { success: false, message: "User not authenticated." };
    }

    try {
      await deleteDoc(doc(db, "users", userId, "tasks", taskId));
      console.log("✅ Task deleted successfully");
      return { success: true };
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("🔥 Error deleting task:", error.message);
        return { success: false, message: error.message };
      }
      console.error("🔥 Unknown error:", error);
      return { success: false, message: "An unknown error occurred." };
    }
  }
}

export const firestoreService = new FirestoreService();
