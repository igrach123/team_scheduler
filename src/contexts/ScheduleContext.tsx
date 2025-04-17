"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { Activity, Schedule } from "../types/schedule";
import { defaultActivities } from "../lib/defaultActivities";
import { auth, db } from "../lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { initializeDefaultActivities } from "../lib/firestore";
import { collection, onSnapshot, DocumentData } from "firebase/firestore";

interface ScheduleContextType {
  activities: Activity[];
  schedules: Schedule[];
  loading: boolean;
  setActivities: React.Dispatch<React.SetStateAction<Activity[]>>;
}

const ScheduleContext = createContext<ScheduleContextType>({
  activities: [],
  schedules: [],
  loading: true,
  setActivities: () => {},
});

export function ScheduleProvider({ children }: { children: React.ReactNode }) {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          await initializeDefaultActivities(defaultActivities);
          const q = collection(db, "activities");
          const activitiesUnsub = onSnapshot(
            q,
            (snapshot) => {
              console.log(
                "Activities snapshot:",
                snapshot.docs.length,
                "activities"
              );
              const activities = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
              })) as Activity[];
              setActivities(activities);
              setLoading(false);
            },
            (error) => {
              console.error("Firestore error:", error);
              setLoading(false);
            }
          );
          return activitiesUnsub;
        } catch (error) {
          console.error("Initialization error:", error);
          setLoading(false);
        }
      } else {
        setActivities([]);
        setSchedules([]);
        setLoading(false);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  return (
    <ScheduleContext.Provider
      value={{ activities, schedules, loading, setActivities }}>
      {children}
    </ScheduleContext.Provider>
  );
}

export const useSchedule = () => useContext(ScheduleContext);
