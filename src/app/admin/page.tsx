"use client";
import { useAuth } from "@/contexts/AuthContext";

export default function AdminDashboard() {
  const { user } = useAuth();

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      <p>Welcome, {user?.email}</p>
      <div className="mt-4 p-4 border rounded-lg">
        <p>Admin functionality will go here</p>
      </div>
    </div>
  );
}
