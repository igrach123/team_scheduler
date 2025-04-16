"use client";
import { createContext, useContext } from "react";
import { db } from "@/lib/firebase";
import { collection, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";

type FirebaseContextType = {
  db: typeof db;
  getEmployee: (id: string) => Promise<any>;
  updateEmployee: (id: string, data: any) => Promise<void>;
  getSchedule: (weekStart: string) => Promise<any>;
  updateSchedule: (weekStart: string, data: any) => Promise<void>;
  getActivity: (id: string) => Promise<any>;
  updateActivity: (id: string, data: any) => Promise<void>;
};

const FirebaseContext = createContext<FirebaseContextType>({
  db,
  getEmployee: async () => ({}),
  updateEmployee: async () => {},
  getSchedule: async () => ({}),
  updateSchedule: async () => {},
  getActivity: async () => ({}),
  updateActivity: async () => {},
});

export function FirebaseProvider({ children }: { children: React.ReactNode }) {
  const employeesRef = collection(db, "employees");
  const schedulesRef = collection(db, "schedules");
  const activitiesRef = collection(db, "activities");

  const getEmployee = async (id: string) => {
    const docRef = doc(employeesRef, id);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? docSnap.data() : null;
  };

  const updateEmployee = async (id: string, data: any) => {
    const docRef = doc(employeesRef, id);
    await setDoc(docRef, data, { merge: true });
  };

  const getSchedule = async (weekStart: string) => {
    const docRef = doc(schedulesRef, weekStart);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? docSnap.data() : null;
  };

  const updateSchedule = async (weekStart: string, data: any) => {
    const docRef = doc(schedulesRef, weekStart);
    await setDoc(docRef, data, { merge: true });
  };

  const getActivity = async (id: string) => {
    const docRef = doc(activitiesRef, id);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? docSnap.data() : null;
  };

  const updateActivity = async (id: string, data: any) => {
    const docRef = doc(activitiesRef, id);
    await setDoc(docRef, data, { merge: true });
  };

  return (
    <FirebaseContext.Provider
      value={{
        db,
        getEmployee,
        updateEmployee,
        getSchedule,
        updateSchedule,
        getActivity,
        updateActivity,
      }}>
      {children}
    </FirebaseContext.Provider>
  );
}

export const useFirebase = () => useContext(FirebaseContext);
