import { db } from "./firebase";
import { collection, doc, getDocs, setDoc, query } from "firebase/firestore";
import { Activity } from "@/types/schedule";

const ACTIVITIES_COLLECTION = "activities";

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
