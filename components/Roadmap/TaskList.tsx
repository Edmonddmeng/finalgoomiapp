"use client"

import { useState } from "react"
import type { Task } from "@/types"
import { Plus, Check, Trash2, ChevronDown, Filter } from "lucide-react"

interface TaskListProps {
  tasks: Task[]
  onTaskToggle: (taskId: string) => void
  onTaskCreate: (newTask: Omit<Task, "id">) => void
  onTaskDelete: (taskId: string) => void
}

export function TaskList({ tasks, onTaskToggle, onTaskCreate, onTaskDelete }: TaskListProps) {
  const [newTaskTitle, setNewTaskTitle] = useState("")
  const [filter, setFilter] = useState("all")
  const [showCompleted, setShowCompleted] = useState(true)

  const handleCreateTask = () => {
    if (!newTaskTitle.trim()) return
    onTaskCreate({
      title: newTaskTitle,
      description: "",
      dueDate: new Date().toISOString().split("T")[0],
      priority: "medium",
      category: "personal",
      completed: false,
      createdAt: new Date().toISOString(),
    })
    setNewTaskTitle("")
  }

  const filteredTasks = tasks.filter((task) => {
    if (filter !== "all" && task.category !== filter) return false
    if (!showCompleted && task.completed) return false
    return true
  })

  const incompleteTasks = filteredTasks.filter((t) => !t.completed)
  const completedTasks = filteredTasks.filter((t) => t.completed)

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-slate-700">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Task List</h3>
        <div className="flex items-center gap-2">
          <div className="relative">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="appearance-none bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 text-xs font-medium pl-3 pr-8 py-1.5 rounded-full focus:outline-none"
            >
              <option value="all">All Categories</option>
              <option value="academic">Academic</option>
              <option value="personal">Personal</option>
              <option value="extracurricular">Extracurricular</option>
            </select>
            <Filter
              size={12}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
            />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-4">
        <input
          type="text"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleCreateTask()}
          placeholder="Add a new task..."
          className="flex-1 p-2 border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        />
        <button
          onClick={handleCreateTask}
          className="p-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
        >
          <Plus size={20} />
        </button>
      </div>

      <div className="space-y-2">
        {incompleteTasks.map((task) => (
          <TaskItem key={task.id} task={task} onToggle={onTaskToggle} onDelete={onTaskDelete} />
        ))}
      </div>

      {completedTasks.length > 0 && (
        <div className="mt-6">
          <button
            onClick={() => setShowCompleted(!showCompleted)}
            className="flex items-center gap-2 text-sm font-medium text-gray-500 dark:text-gray-400 mb-2"
          >
            <ChevronDown size={16} className={`transition-transform ${showCompleted ? "" : "-rotate-90"}`} />
            Completed ({completedTasks.length})
          </button>
          {showCompleted && (
            <div className="space-y-2">
              {completedTasks.map((task) => (
                <TaskItem key={task.id} task={task} onToggle={onTaskToggle} onDelete={onTaskDelete} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

const TaskItem = ({
  task,
  onToggle,
  onDelete,
}: { task: Task; onToggle: (id: string) => void; onDelete: (id: string) => void }) => (
  <div className="group flex items-center gap-3 p-2 hover:bg-gray-50 dark:hover:bg-slate-700/50 rounded-lg">
    <button
      onClick={() => onToggle(task.id)}
      className={`w-5 h-5 border-2 rounded-md flex items-center justify-center transition-all ${
        task.completed ? "bg-purple-500 border-purple-500" : "border-gray-300 dark:border-slate-500"
      }`}
    >
      {task.completed && <Check size={14} className="text-white" />}
    </button>
    <span
      className={`flex-1 text-sm ${task.completed ? "text-gray-400 dark:text-gray-500 line-through" : "text-gray-800 dark:text-gray-200"}`}
    >
      {task.title}
    </span>
    <span className="text-xs text-gray-400 dark:text-gray-500 capitalize">{task.category}</span>
    <button
      onClick={() => onDelete(task.id)}
      className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500"
    >
      <Trash2 size={14} />
    </button>
  </div>
)
