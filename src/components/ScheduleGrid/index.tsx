"use client";
import { DndContext, DragEndEvent, closestCenter } from "@dnd-kit/core";
import React, { useState } from "react";
import { Employee, Activity } from "@/types/schedule";
import {
  restrictToParentElement,
  restrictToVerticalAxis,
} from "@dnd-kit/modifiers";
import { useSchedule } from "@/contexts/ScheduleContext";

interface ScheduleSlot {
  time: string;
  days: {
    [key: string]: {
      employee?: Employee;
      activity?: Activity;
    };
  };
}

export default function ScheduleGrid(): React.ReactElement {
  const [slots, setSlots] = useState<ScheduleSlot[]>([]);
  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  // Initialize with sample time slots
  const initSlots = () => {
    const times = [
      "08:00",
      "09:00",
      "10:00",
      "11:00",
      "12:00",
      "13:00",
      "14:00",
      "15:00",
      "16:00",
    ];
    return times.map((time) => ({
      time,
      days: Object.fromEntries(days.map((day) => [day, {}])),
    }));
  };

  const { activities } = useSchedule();

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    // Get the day and time from the drop target
    const day = over.data.current?.day;
    const time = over.data.current?.time;

    if (!day || !time) return;

    // Check if we're dragging an activity or employee
    if (!active.data.current) return;

    if (active.data.current.type === "activity") {
      const activity = activities.find((a) => a.id === active.id);
      if (!activity) return;

      // Update the schedule slot with this activity
      setSlots((prev) =>
        prev.map((slot) => {
          if (slot.time === time) {
            return {
              ...slot,
              days: {
                ...slot.days,
                [day]: {
                  ...slot.days[day],
                  activity,
                },
              },
            };
          }
          return slot;
        })
      );
    } else if (active.data.current.type === "employee") {
      const employee = active.data.current?.employee;
      if (!employee) return;

      // Update the schedule slot with this employee
      setSlots((prev) =>
        prev.map((slot) => {
          if (slot.time === time) {
            return {
              ...slot,
              days: {
                ...slot.days,
                [day]: {
                  ...slot.days[day],
                  employee,
                },
              },
            };
          }
          return slot;
        })
      );
    }
  };

  return (
    <DndContext
      onDragEnd={handleDragEnd}
      collisionDetection={closestCenter}
      modifiers={[restrictToParentElement, restrictToVerticalAxis]}>
      <div className="grid grid-cols-8 gap-px p-4 bg-gray-200">
        {/* Time column header */}
        <div className="font-bold p-2 bg-gray-100 border border-gray-300">
          Time
        </div>

        {/* Day headers */}
        {days.map((day) => (
          <div
            key={day}
            className="font-bold p-2 bg-gray-100 text-center border border-gray-300">
            {day}
          </div>
        ))}

        {/* Time slots */}
        {initSlots().map((slot, index) => (
          <div key={index} className="contents">
            {/* Time cell */}
            <div className="p-2 bg-gray-100 border border-gray-300">
              <input
                type="text"
                value={slot.time}
                onChange={(e) => {
                  const newSlots = [...slots];
                  newSlots[index].time = e.target.value;
                  setSlots(newSlots);
                }}
                className="w-full bg-transparent"
              />
            </div>

            {/* Day cells */}
            {days.map((day) => (
              <div
                key={day}
                className="p-2 min-h-12 bg-white border border-gray-300"
                data-day={day}
                data-time={slot.time}>
                {slots[index]?.days[day]?.activity && (
                  <div
                    className="p-1 rounded text-white text-xs font-medium text-center border border-white"
                    style={{
                      backgroundColor: slots[index].days[day].activity?.color,
                    }}>
                    {slots[index].days[day].activity?.name}
                  </div>
                )}
                {slots[index]?.days[day]?.employee && (
                  <div className="p-1 rounded bg-blue-100 text-blue-800 text-xs font-medium text-center border border-blue-200">
                    {slots[index].days[day].employee?.name}
                  </div>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </DndContext>
  );
}
