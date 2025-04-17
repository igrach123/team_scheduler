export interface Employee {
  id: string;
  name: string;
  role: "employee" | "admin";
  // Removed email since all employees will be managed under one admin account
}

export interface Activity {
  id: string;
  name: string;
  description: string;
  color: string;
  defaultDuration: number; // minutes
  startTime?: string;
  endTime?: string;
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
