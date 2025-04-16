export interface Employee {
  id: string;
  name: string;
  email: string;
  role: "employee" | "admin";
}

export interface Activity {
  id: string;
  name: string;
  description: string;
  color: string;
  defaultDuration: number; // minutes
}

export interface LeaveRequest {
  id: string;
  employeeId: string;
  startDate: Date;
  endDate: Date;
  status: "pending" | "approved" | "rejected";
  reason: string;
}

export interface ScheduleSlot {
  activityId: string;
  startTime: Date;
  endTime: Date;
  notes: string;
}

export interface Schedule {
  id: string;
  employeeId: string;
  weekStart: Date;
  slots: ScheduleSlot[];
}
