"use client"

import { useState } from "react"
import type { Task } from "@/types"
import { ChevronLeft, ChevronRight, Check } from "lucide-react"

interface CalendarProps {
  tasks: Task[]
  upcomingEvents?: Task[]
  selectedDate: Date | null
  onDateSelect: (date: Date | null) => void
}

export function Calendar({ tasks, upcomingEvents, selectedDate, onDateSelect }: CalendarProps) {
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
    if (!upcomingEvents) return []
    return upcomingEvents.filter((task) => {
      if (!task.dueDate) return false
      const taskDate = new Date(task.dueDate)
      return (
        taskDate.getFullYear() === currentDate.getFullYear() &&
        taskDate.getMonth() === currentDate.getMonth() &&
        taskDate.getDate() === day
      )
    })
  }

  const getTasksForDay = (day: number) => {
    return tasks.filter((task) => {
      if (!task.dueDate) return false
      const taskDate = new Date(task.dueDate)
      return (
        taskDate.getFullYear() === currentDate.getFullYear() &&
        taskDate.getMonth() === currentDate.getMonth() &&
        taskDate.getDate() === day
      )
    })
  }

  const handleDateClick = (day: number) => {
    const clickedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
    // If clicking the same date, deselect it
    if (selectedDate && 
        selectedDate.getFullYear() === clickedDate.getFullYear() &&
        selectedDate.getMonth() === clickedDate.getMonth() &&
        selectedDate.getDate() === clickedDate.getDate()) {
      onDateSelect(null)
    } else {
      onDateSelect(clickedDate)
    }
  }

  const isSelectedDate = (day: number) => {
    if (!selectedDate) return false
    return (
      selectedDate.getFullYear() === currentDate.getFullYear() &&
      selectedDate.getMonth() === currentDate.getMonth() &&
      selectedDate.getDate() === day
    )
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
        {days.map((day, index) => {
          const dayTasks = day ? getTasksForDay(day) : []
          const completedTasks = dayTasks.filter(t => t.completed).length
          const incompleteTasks = dayTasks.length - completedTasks
          
          return (
            <div
              key={index}
              onClick={() => day && handleDateClick(day)}
              className={`h-20 p-1 border rounded-md transition-all ${
                day 
                  ? isSelectedDate(day)
                    ? "bg-purple-100 dark:bg-purple-900/30 border-purple-500 dark:border-purple-400"
                    : "bg-white dark:bg-slate-800 border-gray-100 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700/50 cursor-pointer"
                  : "bg-gray-50 dark:bg-slate-800/50 border-gray-100 dark:border-slate-700"
              }`}
            >
              {day && (
                <div className="flex flex-col h-full">
                  <div className="flex justify-between items-start">
                    <div
                      className={`text-xs font-semibold ${
                        isToday(day) 
                          ? "bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center" 
                          : isSelectedDate(day)
                          ? "text-purple-700 dark:text-purple-300"
                          : "text-gray-800 dark:text-gray-200"
                      }`}
                    >
                      {day}
                    </div>
                    {dayTasks.length > 0 && (
                      <div className="flex items-center gap-0.5">
                        {incompleteTasks > 0 && (
                          <span className="text-[10px] bg-orange-100 dark:bg-orange-900/50 text-orange-700 dark:text-orange-300 px-1 rounded">
                            {incompleteTasks}
                          </span>
                        )}
                        {completedTasks > 0 && (
                          <span className="text-[10px] bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 px-1 rounded flex items-center gap-0.5">
                            <Check size={8} />
                            {completedTasks}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                  {getEventsForDay(day).map((task) => (
                    <div
                      key={task.id}
                      className={`mt-1 w-full h-1 rounded-full ${
                        task.category === "competition"
                          ? "bg-yellow-400"
                          : task.priority === "high"
                            ? "bg-red-400"
                            : "bg-blue-400"
                      }`}
                      title={task.title}
                    />
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
