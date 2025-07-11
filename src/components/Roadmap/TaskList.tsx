"use client"

import { useState } from "react"
import { Task, TaskPriority, TaskCategory } from "@/types"
import { Plus, Check, Trash2, ChevronDown, Filter, X, Calendar, Clock, Tag, Loader2 } from "lucide-react"
import { useCreateTask, useToggleTask, useDeleteTask } from "@/hooks/useTasks"
import { format } from "date-fns"

interface TaskListProps {
  tasks: Task[]
  selectedDate: Date | null
  onClearSelectedDate: () => void
}

export function TaskList({ tasks, selectedDate, onClearSelectedDate }: TaskListProps) {
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [filter, setFilter] = useState<TaskCategory | "all">("all")
  const [showCompleted, setShowCompleted] = useState(true)
  
  // Mutations
  const { mutate: createTask, isLoading: creatingTask } = useCreateTask()
  const { mutate: toggleTask, isLoading: togglingTask } = useToggleTask()
  const { mutate: deleteTask, isLoading: deletingTask } = useDeleteTask()
  
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    dueDate: new Date().toISOString().split("T")[0],
    priority: "medium" as TaskPriority,
    category: "personal" as TaskCategory,
    tags: [] as string[]
  })

  const handleCreateTask = () => {
    if (!newTask.title.trim()) return
    
    createTask(newTask)
    setShowCreateModal(false)
    setNewTask({
      title: "",
      description: "",
      dueDate: new Date().toISOString().split("T")[0],
      priority: "medium",
      category: "personal",
      tags: []
    })
  }

  const handleToggleTask = (taskId: string) => {
    toggleTask(taskId)
  }

  const handleDeleteTask = (taskId: string) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      deleteTask(taskId)
    }
  }

  // Filter tasks
  let filteredTasks = tasks
  
  if (selectedDate) {
    const selectedDateStr = format(selectedDate, 'yyyy-MM-dd')
    filteredTasks = filteredTasks.filter(task => 
      task.dueDate && task.dueDate.startsWith(selectedDateStr)
    )
  }
  
  if (filter !== "all") {
    filteredTasks = filteredTasks.filter(task => task.category === filter)
  }
  
  if (!showCompleted) {
    filteredTasks = filteredTasks.filter(task => !task.completed)
  }

  const pendingTasks = filteredTasks.filter(task => !task.completed)
  const completedTasks = filteredTasks.filter(task => task.completed)

  const priorityColors = {
    low: "bg-gray-100 text-gray-600",
    medium: "bg-yellow-100 text-yellow-700",
    high: "bg-red-100 text-red-700"
  }

  const categoryColors = {
    academic: "bg-blue-50 text-blue-700 border-blue-200",
    personal: "bg-green-50 text-green-700 border-green-200",
    competition: "bg-purple-50 text-purple-700 border-purple-200",
    activity: "bg-orange-50 text-orange-700 border-orange-200",
    other: "bg-gray-50 text-gray-700 border-gray-200"
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-slate-700">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Tasks</h2>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          <Plus size={20} />
          <span>New Task</span>
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        {selectedDate && (
          <div className="flex items-center gap-2 px-3 py-1.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-sm">
            <Calendar size={14} />
            <span>{format(selectedDate, 'MMM d, yyyy')}</span>
            <button
              onClick={onClearSelectedDate}
              className="ml-1 hover:text-purple-900 dark:hover:text-purple-100"
            >
              <X size={14} />
            </button>
          </div>
        )}
        
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as TaskCategory | "all")}
          className="px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
        >
          <option value="all">All Categories</option>
          <option value="academic">Academic</option>
          <option value="personal">Personal</option>
          <option value="competition">Competition</option>
          <option value="activity">Activity</option>
          <option value="other">Other</option>
        </select>
        
        <button
          onClick={() => setShowCompleted(!showCompleted)}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors ${
            showCompleted 
              ? "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300" 
              : "bg-gray-200 dark:bg-gray-600 text-gray-900 dark:text-white"
          }`}
        >
          <Check size={14} />
          <span>Show Completed</span>
        </button>
      </div>

      {/* Tasks List */}
      <div className="space-y-4">
        {pendingTasks.length === 0 && completedTasks.length === 0 ? (
          <p className="text-center py-8 text-gray-500 dark:text-gray-400">
            {selectedDate ? "No tasks for this date" : "No tasks yet. Create your first task!"}
          </p>
        ) : (
          <>
            {/* Pending Tasks */}
            {pendingTasks.length > 0 && (
              <div>
                <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-3">
                  To Do ({pendingTasks.length})
                </h3>
                <div className="space-y-2">
                  {pendingTasks.map((task) => (
                    <TaskItem
                      key={task.id}
                      task={task}
                      onToggle={handleToggleTask}
                      onDelete={handleDeleteTask}
                      priorityColors={priorityColors}
                      categoryColors={categoryColors}
                      isToggling={togglingTask}
                      isDeleting={deletingTask}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Completed Tasks */}
            {showCompleted && completedTasks.length > 0 && (
              <div>
                <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Completed ({completedTasks.length})
                </h3>
                <div className="space-y-2 opacity-75">
                  {completedTasks.map((task) => (
                    <TaskItem
                      key={task.id}
                      task={task}
                      onToggle={handleToggleTask}
                      onDelete={handleDeleteTask}
                      priorityColors={priorityColors}
                      categoryColors={categoryColors}
                      isToggling={togglingTask}
                      isDeleting={deletingTask}
                    />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Create Task Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Create New Task</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                  placeholder="Enter task title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description
                </label>
                <textarea
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                  rows={3}
                  placeholder="Add description (optional)"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={newTask.dueDate}
                    onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Priority
                  </label>
                  <select
                    value={newTask.priority}
                    onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as TaskPriority })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Category
                </label>
                <select
                  value={newTask.category}
                  onChange={(e) => setNewTask({ ...newTask, category: e.target.value as TaskCategory })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                >
                  <option value="academic">Academic</option>
                  <option value="personal">Personal</option>
                  <option value="competition">Competition</option>
                  <option value="activity">Activity</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleCreateTask}
                disabled={!newTask.title.trim() || creatingTask}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-300 dark:disabled:bg-gray-600 transition-colors"
              >
                {creatingTask ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <>
                    <Plus size={20} />
                    <span>Create Task</span>
                  </>
                )}
              </button>
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Task Item Component
interface TaskItemProps {
  task: Task
  onToggle: (taskId: string) => void
  onDelete: (taskId: string) => void
  priorityColors: Record<string, string>
  categoryColors: Record<string, string>
  isToggling: boolean
  isDeleting: boolean
}

function TaskItem({ task, onToggle, onDelete, priorityColors, categoryColors, isToggling, isDeleting }: TaskItemProps) {
  return (
    <div className={`flex items-start gap-3 p-4 rounded-lg border transition-all ${
      task.completed 
        ? "bg-gray-50 dark:bg-slate-700/50 border-gray-200 dark:border-gray-600" 
        : "bg-white dark:bg-slate-800 border-gray-200 dark:border-gray-700 hover:shadow-sm"
    }`}>
      <button
        onClick={() => onToggle(task.id)}
        disabled={isToggling}
        className={`mt-0.5 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
          task.completed
            ? "bg-green-500 border-green-500"
            : "border-gray-300 dark:border-gray-600 hover:border-purple-500"
        }`}
      >
        {task.completed && <Check size={12} className="text-white" />}
      </button>
      
      <div className="flex-1">
        <h4 className={`font-medium ${
          task.completed 
            ? "text-gray-500 dark:text-gray-400 line-through" 
            : "text-gray-900 dark:text-white"
        }`}>
          {task.title}
        </h4>
        
        {task.description && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {task.description}
          </p>
        )}
        
        <div className="flex flex-wrap items-center gap-3 mt-2">
          {task.dueDate && (
            <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
              <Calendar size={12} />
              <span>{format(new Date(task.dueDate), 'MMM d')}</span>
            </div>
          )}
          
          <span className={`text-xs px-2 py-0.5 rounded-full ${priorityColors[task.priority]}`}>
            {task.priority}
          </span>
          
          <span className={`text-xs px-2 py-0.5 rounded-full border ${categoryColors[task.category]}`}>
            {task.category}
          </span>
          
          {task.tags && task.tags.length > 0 && (
            <div className="flex items-center gap-1">
              <Tag size={12} className="text-gray-400" />
              {task.tags.map((tag, index) => (
                <span key={index} className="text-xs text-gray-500 dark:text-gray-400">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
      
      <button
        onClick={() => onDelete(task.id)}
        disabled={isDeleting}
        className="text-gray-400 hover:text-red-500 transition-colors"
      >
        <Trash2 size={16} />
      </button>
    </div>
  )
}