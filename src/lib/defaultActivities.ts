import { Activity } from "../types/schedule";

export const defaultActivities: Activity[] = [
  {
    id: "meeting",
    name: "Meeting",
    description: "Team or client meetings",
    color: "#4cc9f0",
    defaultDuration: 60,
  },
  {
    id: "project-work",
    name: "Project Work",
    description: "Working on assigned projects",
    color: "#4895ef",
    defaultDuration: 120,
  },
  {
    id: "break",
    name: "Break",
    description: "Coffee or lunch break",
    color: "#f72585",
    defaultDuration: 30,
  },
  {
    id: "training",
    name: "Training",
    description: "Learning sessions",
    color: "#3f37c9",
    defaultDuration: 90,
  },
  {
    id: "support",
    name: "Support",
    description: "Customer/team support",
    color: "#7209b7",
    defaultDuration: 60,
  },
];

export const getActivityById = (id: string, activities: Activity[]) => {
  return activities.find((activity) => activity.id === id);
};
