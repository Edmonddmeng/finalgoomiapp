"use client"

import { useState } from "react"
import type { Event } from "@/types"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface CalendarProps {
  events: Event[]
}

export function Calendar({ events }: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date())

  const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
  const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)
  const startDay = startOfMonth.getDay()
  const daysInMonth = endOfMonth.getDate()

  const days: (number | null)[] = [
    ...Array.from({ length: startDay }, (): null => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]

  const changeMonth = (offset: number) => {
    setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + offset, 1))
  }

  const getEventsForDay = (day: number) => {
    return events.filter((event) => {
      const eventDate = new Date(event.date)
      return (
        eventDate.getFullYear() === currentDate.getFullYear() &&
        eventDate.getMonth() === currentDate.getMonth() &&
        eventDate.getDate() === day
      )
    })
  }

  const today = new Date()
  const isToday = (day: number) =>
    day === today.getDate() &&
    currentDate.getMonth() === today.getMonth() &&
    currentDate.getFullYear() === today.getFullYear()

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-slate-700">
      <div className="flex items-center justify-between mb-4">
        <button onClick={() => changeMonth(-1)} className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-full">
          <ChevronLeft size={20} className="text-gray-800 dark:text-gray-200" />
        </button>
        <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
          {currentDate.toLocaleString("default", { month: "long", year: "numeric" })}
        </h3>
        <button onClick={() => changeMonth(1)} className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-full">
          <ChevronRight size={20} className="text-gray-800 dark:text-gray-200" />
        </button>
      </div>
      <div className="grid grid-cols-7 text-center text-xs text-gray-500 dark:text-gray-400 font-medium mb-2">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day}>{day}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {days.map((day, index) => (
          <div
            key={index}
            className={`h-20 p-1 border border-gray-100 dark:border-slate-700 rounded-md ${day ? "bg-white dark:bg-slate-800" : "bg-gray-50 dark:bg-slate-800/50"}`}
          >
            {day && (
              <div
                className={`text-xs font-semibold ${isToday(day) ? "bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center" : "text-gray-800 dark:text-gray-200"}`}
              >
                {day}
              </div>
            )}
            {day &&
              getEventsForDay(day).map((event) => (
                <div
                  key={event.id}
                  className={`mt-1 w-full h-1.5 rounded-full ${
                    event.type === "competition"
                      ? "bg-yellow-400"
                      : event.type === "deadline"
                        ? "bg-red-400"
                        : "bg-blue-400"
                  }`}
                  title={event.title}
                ></div>
              ))}
          </div>
        ))}
      </div>
    </div>
  )
}
