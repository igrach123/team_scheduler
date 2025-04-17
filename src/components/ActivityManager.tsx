"use client";
import { useState, useEffect } from "react";
import { useSchedule } from "../contexts/ScheduleContext";
import { saveActivity } from "../lib/firestore";

export default function ActivityManager() {
  const { activities, loading } = useSchedule();
  const [newActivity, setNewActivity] = useState({
    name: "",
    description: "",
    color: "#4cc9f0",
    defaultDuration: 60,
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const activity = editingId
      ? { ...newActivity, id: editingId }
      : {
          ...newActivity,
          id: newActivity.name.toLowerCase().replace(/\s+/g, "-"),
        };

    await saveActivity(activity);
    setNewActivity({
      name: "",
      description: "",
      color: "#4cc9f0",
      defaultDuration: 60,
    });
    setEditingId(null);
  };

  const handleEdit = (activity: any) => {
    setNewActivity(activity);
    setEditingId(activity.id);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Manage Activities</h2>

      <form onSubmit={handleSubmit} className="mb-8 p-4 bg-gray-50 rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Activity Name
            </label>
            <input
              type="text"
              value={newActivity.name}
              onChange={(e) =>
                setNewActivity({ ...newActivity, name: e.target.value })
              }
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Duration (minutes)
            </label>
            <input
              type="number"
              value={newActivity.defaultDuration}
              onChange={(e) =>
                setNewActivity({
                  ...newActivity,
                  defaultDuration: parseInt(e.target.value),
                })
              }
              className="w-full p-2 border rounded"
              min="15"
              step="15"
              required
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            value={newActivity.description}
            onChange={(e) =>
              setNewActivity({ ...newActivity, description: e.target.value })
            }
            className="w-full p-2 border rounded"
            rows={3}
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Color</label>
          <input
            type="color"
            value={newActivity.color}
            onChange={(e) =>
              setNewActivity({ ...newActivity, color: e.target.value })
            }
            className="w-16 h-10"
          />
        </div>

        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          {editingId ? "Update Activity" : "Add Activity"}
        </button>
        {editingId && (
          <button
            type="button"
            onClick={() => {
              setNewActivity({
                name: "",
                description: "",
                color: "#4cc9f0",
                defaultDuration: 60,
              });
              setEditingId(null);
            }}
            className="ml-2 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600">
            Cancel
          </button>
        )}
      </form>

      <div className="border rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Color
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Duration
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {activities.map((activity) => (
              <tr key={activity.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div
                    className="w-6 h-6 rounded-full"
                    style={{ backgroundColor: activity.color }}
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="font-medium">{activity.name}</div>
                  <div className="text-sm text-gray-500">
                    {activity.description}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {activity.defaultDuration} min
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => handleEdit(activity)}
                    className="text-blue-600 hover:text-blue-900 mr-4">
                    Edit
                  </button>
                  <button className="text-red-600 hover:text-red-900">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
