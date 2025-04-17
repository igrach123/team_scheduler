import { db } from "./firebase";
import {
  collection,
  doc,
  getDocs,
  setDoc,
  deleteDoc,
  query,
} from "firebase/firestore";
import { Activity, Employee } from "@/types/schedule";

const ACTIVITIES_COLLECTION = "activities";
const EMPLOYEES_COLLECTION = "employees";

export async function getActivities(): Promise<Activity[]> {
  const q = query(collection(db, ACTIVITIES_COLLECTION));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Activity[];
}

export async function saveActivity(activity: Activity): Promise<void> {
  await setDoc(doc(db, ACTIVITIES_COLLECTION, activity.id), activity);
}

export async function initializeDefaultActivities(
  defaultActivities: Activity[]
): Promise<void> {
  const existingActivities = await getActivities();
  if (existingActivities.length === 0) {
    await Promise.all(
      defaultActivities.map((activity) => saveActivity(activity))
    );
  }
}

export async function getEmployees(): Promise<Employee[]> {
  const q = query(collection(db, EMPLOYEES_COLLECTION));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Employee[];
}

export async function addEmployee(
  employee: Omit<Employee, "id">
): Promise<string> {
  try {
    const docRef = doc(collection(db, EMPLOYEES_COLLECTION));
    await setDoc(docRef, employee);
    return docRef.id;
  } catch (error) {
    console.error("Error adding employee:", error);
    throw new Error("Failed to add employee. Check Firestore permissions.");
  }
}

export async function updateEmployee(employee: Employee): Promise<void> {
  try {
    await setDoc(doc(db, EMPLOYEES_COLLECTION, employee.id), employee);
  } catch (error) {
    console.error("Error updating employee:", error);
    throw new Error("Failed to update employee. Check Firestore permissions.");
  }
}

export async function deleteEmployee(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, EMPLOYEES_COLLECTION, id));
  } catch (error) {
    console.error("Error deleting employee:", error);
    throw new Error("Failed to delete employee. Check Firestore permissions.");
  }
}

export async function deleteActivity(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, ACTIVITIES_COLLECTION, id));
  } catch (error) {
    console.error("Error deleting activity:", error);
    throw new Error("Failed to delete activity. Check Firestore permissions.");
  }
}
