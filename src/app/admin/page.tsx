"use client";
import { useAuth } from "@/contexts/AuthContext";
import { useState, FormEvent, useEffect } from "react";
import { useSchedule } from "@/contexts/ScheduleContext";
import { defaultActivities } from "@/lib/defaultActivities";
import { Activity } from "@/types/schedule";
import {
  getEmployees,
  addEmployee,
  updateEmployee,
  deleteEmployee,
  saveActivity,
} from "@/lib/firestore";

interface FormEmployee {
  id: string;
  name: string;
  role: "employee" | "admin";
}

export default function AdminDashboard() {
  const { user } = useAuth();
  const [employeeName, setEmployeeName] = useState("");
  const [employeeRole, setEmployeeRole] = useState<"employee" | "admin">(
    "employee"
  );
  const [employees, setEmployees] = useState<FormEmployee[]>([]);
  const [activities, setActivities] = useState<Activity[]>(defaultActivities);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingActivityId, setEditingActivityId] = useState<string | null>(
    null
  );
  const [newActivity, setNewActivity] = useState<Omit<Activity, "id">>({
    name: "",
    description: "",
    color: "#000000",
    defaultDuration: 30,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadEmployees = async () => {
      try {
        console.log("1. Starting employee load...");
        const fetchedEmployees = await getEmployees();
        console.log("2. Employees loaded:", fetchedEmployees);
        if (!fetchedEmployees) {
          console.warn("3. No employees returned from Firestore");
        }
        setEmployees(fetchedEmployees || []);
        console.log("4. Employees state updated");
      } catch (error: unknown) {
        console.error("5. Load error:", error);
        const message =
          error instanceof Error ? error.message : "Unknown error";
        alert(`Error loading employees: ${message}`);
      } finally {
        console.log("6. Setting loading to false");
        setLoading(false);
      }
    };
    console.log("0. Mounting admin page - starting load");
    loadEmployees();
    return () => console.log("7. Unmounting admin page");
  }, []);

  const handleSubmitEmployee = async (e: FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (editingId) {
        const updatedEmployee = {
          id: editingId,
          name: employeeName,
          role: employeeRole,
        };
        await updateEmployee(updatedEmployee);
        setEmployees(
          employees.map((emp) => (emp.id === editingId ? updatedEmployee : emp))
        );
        setEditingId(null);
      } else {
        const newEmployee = {
          name: employeeName,
          role: employeeRole,
        };
        const id = await addEmployee(newEmployee);
        setEmployees([...employees, { id, ...newEmployee }]);
      }
      setEmployeeName("");
      setEmployeeRole("employee");
    } catch (error) {
      console.error("Error saving employee:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEmployee = async (id: string) => {
    try {
      setLoading(true);
      await deleteEmployee(id);
      setEmployees(employees.filter((emp) => emp.id !== id));
    } catch (error) {
      console.error("Error deleting employee:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditEmployee = (employee: FormEmployee) => {
    setEmployeeName(employee.name);
    setEmployeeRole(employee.role);
    setEditingId(employee.id);
  };

  const handleAddActivity = async () => {
    try {
      setLoading(true);
      const id = Date.now().toString();
      const activity = { id, ...newActivity };
      setActivities([...activities, activity]);
      setNewActivity({
        name: "",
        description: "",
        color: "#000000",
        defaultDuration: 30,
      });
    } catch (error) {
      console.error("Error adding activity:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      <p>Welcome, {user?.email}</p>

      {/* Employee Form Section */}
      <div className="mt-6 p-4 border rounded-lg bg-white shadow-sm">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">
          Employee Management
        </h2>
        {loading ? (
          <div className="text-center py-4 text-black">
            Loading employees...
          </div>
        ) : (
          <>
            <form onSubmit={handleSubmitEmployee} className="space-y-4 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input
                  type="text"
                  value={employeeName}
                  onChange={(e) => setEmployeeName(e.target.value)}
                  placeholder="Full name"
                  className="p-2 border rounded focus:ring-2 focus:ring-blue-300 text-black"
                  required
                />
                <select
                  value={employeeRole}
                  onChange={(e) =>
                    setEmployeeRole(e.target.value as "employee" | "admin")
                  }
                  className="p-2 border rounded focus:ring-2 focus:ring-blue-300 text-black">
                  <option value="employee">Employee</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full md:w-auto px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-300 transition-colors">
                {editingId ? "Update Employee" : "Add Employee"}
              </button>
            </form>

            <div className="space-y-2">
              {employees.map((emp) => (
                <div
                  key={emp.id}
                  className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border">
                  <div>
                    <p className="font-medium text-gray-800">{emp.name}</p>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        emp.role === "admin"
                          ? "bg-purple-100 text-purple-800"
                          : "bg-green-100 text-green-800"
                      }`}>
                      {emp.role}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditEmployee(emp)}
                      className="text-blue-600 hover:text-blue-800 px-2 py-1">
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteEmployee(emp.id)}
                      className="text-red-600 hover:text-red-800 px-2 py-1">
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Activities Management Section */}
      <div className="mt-8 p-4 border rounded-lg bg-white shadow-sm">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">
          Activity Management
        </h2>
        <form className="space-y-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input
              type="text"
              value={newActivity.name}
              onChange={(e) =>
                setNewActivity({ ...newActivity, name: e.target.value })
              }
              placeholder="Activity name"
              className="p-2 border rounded focus:ring-2 focus:ring-blue-300 text-black"
              required
            />
            <input
              type="text"
              value={newActivity.description}
              onChange={(e) =>
                setNewActivity({ ...newActivity, description: e.target.value })
              }
              placeholder="Description"
              className="p-2 border rounded focus:ring-2 focus:ring-blue-300 text-black"
              required
            />
            <input
              type="color"
              value={newActivity.color}
              onChange={(e) =>
                setNewActivity({ ...newActivity, color: e.target.value })
              }
              className="p-1 h-10 border rounded focus:ring-2 focus:ring-blue-300"
            />
            <input
              type="number"
              value={newActivity.defaultDuration}
              onChange={(e) =>
                setNewActivity({
                  ...newActivity,
                  defaultDuration: parseInt(e.target.value),
                })
              }
              placeholder="Duration (mins)"
              className="p-2 border rounded focus:ring-2 focus:ring-blue-300 text-black"
              required
              min="1"
            />
          </div>
          <button
            type="button"
            onClick={handleAddActivity}
            className="w-full md:w-auto px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors">
            Add Activity
          </button>
        </form>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className="p-3 rounded-lg border"
              style={{ backgroundColor: activity.color }}>
              <h3 className="font-medium text-white">{activity.name}</h3>
              <p className="text-white text-sm">{activity.description}</p>
              <p className="text-white text-xs mt-1">
                Duration: {activity.defaultDuration} mins
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
