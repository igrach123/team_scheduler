"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { Activity, Schedule } from "../types/schedule";
import { auth, db } from "../lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
// Removed: import { initializeDefaultActivities } from "../lib/firestore";
import {
  collection,
  query,
  getDocs,
  onSnapshot,
  DocumentData,
  DocumentSnapshot,
} from "firebase/firestore";

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
  const [loading, setLoading] = useState(true); // Keep track of loading state

  useEffect(() => {
    setLoading(true); // Set loading true when the effect runs
    console.log("ScheduleContext useEffect mounting...");

    let activitiesUnsub: (() => void) | null = null; // Variable to hold the listener unsubscribe function

    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      // Clean up previous listener if auth state changes or user logs out
      if (activitiesUnsub) {
        console.log(
          "Auth changed/User logged out: Unsubscribing from previous activities listener."
        );
        activitiesUnsub();
        activitiesUnsub = null;
      }
      // Reset state on auth change
      setActivities([]);
      setSchedules([]);
      setLoading(true); // Start loading for the new state

      if (user) {
        console.log("User authenticated:", user.uid);
        try {
          // Removed default activities initialization
          // console.log("1. Initializing default activities (if needed)...");
          // await initializeDefaultActivities(defaultActivities);
          // console.log("1.1 Default activities check complete.");

          const activitiesRef = collection(db, "activities");
          const q = query(activitiesRef);
          console.log("2. Setting up new activities listener...");
          console.log("2.1 Database reference:", db.app.options);
          console.log("2.2 Collection path:", activitiesRef.path);

          // Setup real-time listener
          activitiesUnsub = onSnapshot(
            // Assign the unsubscribe function
            q,
            (snapshot) => {
              console.log(
                "3. Activities snapshot received:",
                snapshot.docs.length,
                "docs. Has pending writes:",
                snapshot.metadata.hasPendingWrites
              );
              console.log("3.1 Snapshot metadata:", snapshot.metadata);
              const updatedActivities = snapshot.docs.map((doc) => {
                console.log("3.2 Processing doc:", doc.id, doc.data());
                return {
                  id: doc.id,
                  ...doc.data(),
                } as Activity;
              });
              console.log("3.2 Setting activities state."); // Removed full log to avoid large console output
              setActivities(updatedActivities);
              setLoading(false); // Set loading false after first successful snapshot
            },
            (error) => {
              console.error("4. Firestore listener error:", error);
              setActivities([]); // Clear activities on error
              setLoading(false); // Set loading false on error
            }
          );
          console.log("2.1 New activities listener attached.");
        } catch (error) {
          console.error("5. Error during activities setup:", error);
          setActivities([]); // Clear activities on setup error
          setLoading(false);
        }
      } else {
        console.log("6. No user authenticated. State cleared.");
        // State already cleared above
        setLoading(false); // Set loading false if no user
      }
    });

    // Cleanup function for the useEffect hook
    return () => {
      console.log(
        "7. ScheduleContext useEffect cleanup: Unsubscribing from auth and activities listeners."
      );
      unsubscribeAuth(); // Unsubscribe from auth state changes
      if (activitiesUnsub) {
        // Unsubscribe from Firestore listener if it exists
        console.log("7.1 Unsubscribing from active activities listener.");
        activitiesUnsub();
      }
    };
  }, []); // Empty dependency array ensures this runs only once on mount and cleans up on unmount

  return (
    <ScheduleContext.Provider
      value={{ activities, schedules, loading, setActivities }}>
      {children}
    </ScheduleContext.Provider>
  );
}

export const useSchedule = () => useContext(ScheduleContext);
