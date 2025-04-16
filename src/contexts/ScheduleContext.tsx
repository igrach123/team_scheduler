"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { Activity, Schedule } from "../types/schedule";
import { defaultActivities } from "../lib/defaultActivities";
import { auth } from "../lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { getActivities, initializeDefaultActivities } from "../lib/firestore";

interface ScheduleContextType {
  activities: Activity[];
  schedules: Schedule[];
  loading: boolean;
}

const ScheduleContext = createContext<ScheduleContextType>({
  activities: [],
  schedules: [],
  loading: true,
});

export function ScheduleProvider({ children }: { children: React.ReactNode }) {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        initializeDefaultActivities(defaultActivities)
          .then(() => getActivities())
          .then((activities) => {
            setActivities(activities);
            setLoading(false);
          });
      } else {
        setActivities([]);
        setSchedules([]);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <ScheduleContext.Provider value={{ activities, schedules, loading }}>
      {children}
    </ScheduleContext.Provider>
  );
}

export const useSchedule = () => useContext(ScheduleContext);
