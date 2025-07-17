
"use client"

import { useState, useEffect } from "react"
import { Task, TaskPriority, TaskCategory, Competition, Activity } from "@/types"
import { Plus, Check, Trash2, X, Calendar, Tag, Loader2, Search, Trophy, Users, Link } from "lucide-react"
import { useCreateTask, useToggleTask, useDeleteTask } from "@/hooks/useTasks"
import { useCompetitions } from "@/hooks/useCompetitions"
import { useActivities } from "@/hooks/useActivities"
import { format } from "date-fns"

interface TaskListProps {
  tasks: Task[]
  selectedDate: Date | null
  onClearSelectedDate: () => void
  onRefreshNeeded?: () => void
}

interface CreateTaskData {
  title: string
  description: string
  dueDate: string
  priority: TaskPriority
  category: TaskCategory
  tags: string[]
  relatedCompetitionId?: string
  relatedActivityId?: string
}

export function TaskList({ 
  tasks, 
  selectedDate, 
  onClearSelectedDate, 
  onRefreshNeeded
}: TaskListProps) {
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [filter, setFilter] = useState<TaskCategory | "all">("all")
  const [showCompleted, setShowCompleted] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [refreshKey, setRefreshKey] = useState(0)
  
  // Load competitions and activities using hooks
  const { data: competitions = [], isLoading: competitionsLoading, error: competitionsError } = useCompetitions()
  const { data: activities = [], isLoading: activitiesLoading, error: activitiesError } = useActivities()
  
  // Task mutations
  const { mutate: createTask, isLoading: creatingTask } = useCreateTask()
  const { mutate: toggleTask } = useToggleTask()
  const { mutate: deleteTask, isLoading: deletingTask } = useDeleteTask()
  
  const [newTask, setNewTask] = useState<CreateTaskData>({
    title: "",
    description: "",
    dueDate: new Date().toISOString().split("T")[0],
    priority: "medium",
    category: "personal",
    tags: [],
    relatedCompetitionId: undefined,
    relatedActivityId: undefined
  })

  // Auto-update category when selecting competition/activity
  useEffect(() => {
    if (newTask.relatedCompetitionId) {
      setNewTask(prev => ({ ...prev, category: "competition" }))
    } else if (newTask.relatedActivityId) {
      setNewTask(prev => ({ ...prev, category: "activity" }))
    }
  }, [newTask.relatedCompetitionId, newTask.relatedActivityId])

  const handleCreateTask = async () => {
    if (!newTask.title.trim()) return
    
    // Prepare the task data
    const taskData: any = {
      title: newTask.title,
      description: newTask.description,
      dueDate: newTask.dueDate,
      priority: newTask.priority,
      category: newTask.category,
      tags: newTask.tags
    }

    // Only include related IDs if they're selected
    if (newTask.relatedCompetitionId) {
      taskData.relatedCompetitionId = newTask.relatedCompetitionId
    }
    if (newTask.relatedActivityId) {
      taskData.relatedActivityId = newTask.relatedActivityId
    }

    try {
      console.log('🔄 TaskList: Creating new task...')
      await createTask(taskData)
      console.log('✅ TaskList: Task created successfully')
      
      setShowCreateModal(false)
      resetNewTask()
      
      // Refresh tasks in parent component after creation
      if (onRefreshNeeded) {
        console.log('🔄 TaskList: Refreshing after task creation...')
        await onRefreshNeeded()
        console.log('✅ TaskList: Refresh after creation completed')
      }
      
      // Force component re-render
      setRefreshKey(prev => prev + 1)
      
    } catch (error) {
      console.error('❌ TaskList: Failed to create task:', error)
      alert('Failed to create task. Please try again.')
    }
  }

  const resetNewTask = () => {
    setNewTask({
      title: "",
      description: "",
      dueDate: new Date().toISOString().split("T")[0],
      priority: "medium",
      category: "personal",
      tags: [],
      relatedCompetitionId: undefined,
      relatedActivityId: undefined
    })
  }

  const handleToggleTask = async (taskId: string) => {
    console.log('🖱️ TaskList: Checkbox clicked for task:', taskId)
    
    try {
      console.log('🔄 TaskList: Calling toggleTask API...')
      await toggleTask(taskId)
      console.log('✅ TaskList: API call completed')
      
      // Refresh tasks in parent component - THIS IS CRITICAL
      if (onRefreshNeeded) {
        console.log('🔄 TaskList: Calling parent refresh...')
        await onRefreshNeeded()
        console.log('✅ TaskList: Parent refresh completed')
      } else {
        console.warn('⚠️ TaskList: No onRefreshNeeded callback provided!')
      }
      
      // Force component re-render
      setRefreshKey(prev => prev + 1)
      
    } catch (error) {
      console.error('❌ TaskList: Toggle failed:', error)
      alert('Failed to update task. Please try again.')
    }
  }
  
  const handleDeleteTask = async (taskId: string) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        console.log('🔄 TaskList: Deleting task:', taskId)
        await deleteTask(taskId)
        console.log('✅ TaskList: Task deleted successfully')
        
        // Refresh tasks in parent component after deletion
        if (onRefreshNeeded) {
          console.log('🔄 TaskList: Refreshing after task deletion...')
          await onRefreshNeeded()
          console.log('✅ TaskList: Refresh after deletion completed')
        }
        
        // Force component re-render
        setRefreshKey(prev => prev + 1)
        
      } catch (error) {
        console.error('❌ TaskList: Failed to delete task:', error)
        alert('Failed to delete task. Please try again.')
      }
    }
  }

  const clearSearch = () => {
    setSearchQuery("")
  }

  // Helper function to get competition/activity name
  const getRelatedItemName = (task: Task) => {
    if (task.relatedCompetitionId) {
      const competition = competitions.find(c => c.id === task.relatedCompetitionId)
      return competition ? { name: competition.name, type: 'competition' } : null
    }
    if (task.relatedActivityId) {
      const activity = activities.find(a => a.id === task.relatedActivityId)
      return activity ? { name: activity.name, type: 'activity' } : null
    }
    return null
  }

  // Filter tasks
  let filteredTasks = tasks
  
  if (searchQuery.trim()) {
    filteredTasks = filteredTasks.filter(task => 
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase()))
    )
  }
  
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

  // Show loading state if competitions or activities are loading
  const isLoadingRelatedData = competitionsLoading || activitiesLoading

  return (
    <div key={refreshKey} className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-slate-700">
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

      {/* Display loading/error state for related data */}
      {isLoadingRelatedData && (
        <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <div className="flex items-center gap-2">
            <Loader2 className="animate-spin" size={16} />
            <span className="text-sm text-blue-700 dark:text-blue-300">Loading competitions and activities...</span>
          </div>
        </div>
      )}

      {(competitionsError || activitiesError) && (
        <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <span className="text-sm text-red-700 dark:text-red-300">
            {competitionsError && "Failed to load competitions. "}
            {activitiesError && "Failed to load activities. "}
            Task linking may be limited.
          </span>
        </div>
      )}

      {/* Search Bar */}
      <div className="relative mb-4">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search size={20} className="text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search tasks by name or description..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-10 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        />
        {searchQuery && (
          <button
            onClick={clearSearch}
            className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-gray-700 dark:hover:text-gray-300"
          >
            <X size={20} className="text-gray-400" />
          </button>
        )}
      </div>

      {/* Active Filters Display */}
      <div className="flex flex-wrap gap-2 mb-4">
        {searchQuery && (
          <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm">
            <Search size={12} />
            <span>"{searchQuery}"</span>
            <button onClick={clearSearch} className="ml-1 hover:text-blue-900 dark:hover:text-blue-100">
              <X size={12} />
            </button>
          </div>
        )}
        
        {selectedDate && (
          <div className="flex items-center gap-2 px-3 py-1.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-sm">
            <Calendar size={12} />
            <span>{format(selectedDate, 'MMM d, yyyy')}</span>
            <button onClick={onClearSelectedDate} className="ml-1 hover:text-purple-900 dark:hover:text-purple-100">
              <X size={12} />
            </button>
          </div>
        )}
        
        {filter !== "all" && (
          <div className="flex items-center gap-2 px-3 py-1.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-sm">
            <Tag size={12} />
            <span>{filter}</span>
            <button onClick={() => setFilter("all")} className="ml-1 hover:text-green-900 dark:hover:text-green-100">
              <X size={12} />
            </button>
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
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
              ? "bg-gray-400 dark:bg-gray-700 text-gray-700 dark:text-gray-300" 
              : "bg-green-400 dark:bg-gray-600 text-gray-900 dark:text-white"
          }`}
        >
          <Check size={14} />
          <span>{showCompleted ? "Show To Do" : "Show All"}</span>
        </button>
      </div>

      {/* Search Results Summary */}
      {searchQuery && (
        <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
          Found {filteredTasks.length} task{filteredTasks.length !== 1 ? 's' : ''} matching "{searchQuery}"
        </div>
      )}

      {/* Tasks List */}
      <div className="space-y-4">
        {pendingTasks.length === 0 && completedTasks.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            {searchQuery ? (
              <div className="space-y-2">
                <p>No tasks found matching "{searchQuery}"</p>
                <button onClick={clearSearch} className="text-purple-600 dark:text-purple-400 hover:underline">
                  Clear search
                </button>
              </div>
            ) : selectedDate ? (
              "No tasks for this date"
            ) : (
              "No tasks yet. Create your first task!"
            )}
          </div>
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
                      isDeleting={deletingTask}
                      searchQuery={searchQuery}
                      relatedItemName={getRelatedItemName(task) as { name: string; type: 'competition' | 'activity' } | null }
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
                      isDeleting={deletingTask}
                      searchQuery={searchQuery}
                      relatedItemName={getRelatedItemName(task) as { name: string; type: 'competition' | 'activity' } | null}
                    />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Enhanced Create Task Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Create New Task</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Title *
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

              {/* Competition/Activity Selection with Loading States */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Link size={16} className="text-gray-500" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Link to Competition or Activity (Optional)
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                      Competition
                    </label>
                    <select
                      value={newTask.relatedCompetitionId || ""}
                      onChange={(e) => setNewTask({ 
                        ...newTask, 
                        relatedCompetitionId: e.target.value || undefined,
                        relatedActivityId: undefined // Clear activity when selecting competition
                      })}
                      disabled={competitionsLoading}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white text-sm disabled:opacity-50"
                    >
                      <option value="">
                        {competitionsLoading ? "Loading..." : "Select Competition"}
                      </option>
                      {!competitionsLoading && competitions.map((competition) => (
                        <option key={competition.id} value={competition.id}>
                          {competition.name}
                        </option>
                      ))}
                    </select>
                    {competitionsError && (
                      <p className="text-xs text-red-500 mt-1">Failed to load competitions</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                      Activity
                    </label>
                    <select
                      value={newTask.relatedActivityId || ""}
                      onChange={(e) => setNewTask({ 
                        ...newTask, 
                        relatedActivityId: e.target.value || undefined,
                        relatedCompetitionId: undefined // Clear competition when selecting activity
                      })}
                      disabled={activitiesLoading}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white text-sm disabled:opacity-50"
                    >
                      <option value="">
                        {activitiesLoading ? "Loading..." : "Select Activity"}
                      </option>
                      {!activitiesLoading && activities.map((activity) => (
                        <option key={activity.id} value={activity.id}>
                          {activity.name}
                        </option>
                      ))}
                    </select>
                    {activitiesError && (
                      <p className="text-xs text-red-500 mt-1">Failed to load activities</p>
                    )}
                  </div>
                </div>

                {/* Show selected item info */}
                {newTask.relatedCompetitionId && (
                  <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-3">
                    <div className="flex items-center gap-2">
                      <Trophy size={16} className="text-purple-600 dark:text-purple-400" />
                      <span className="text-sm font-medium text-purple-800 dark:text-purple-200">
                        Linked to Competition: {competitions.find(c => c.id === newTask.relatedCompetitionId)?.name || "Unknown"}
                      </span>
                    </div>
                  </div>
                )}

                {newTask.relatedActivityId && (
                  <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-3">
                    <div className="flex items-center gap-2">
                      <Users size={16} className="text-orange-600 dark:text-orange-400" />
                      <span className="text-sm font-medium text-orange-800 dark:text-orange-200">
                        Linked to Activity: {activities.find(a => a.id === newTask.relatedActivityId)?.name || "Unknown"}
                      </span>
                    </div>
                  </div>
                )}
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
                onClick={() => {
                  setShowCreateModal(false)
                  resetNewTask()
                }}
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

// Enhanced TaskItem component with related item display
interface TaskItemProps {
  task: Task
  onToggle: (taskId: string) => void
  onDelete: (taskId: string) => void
  priorityColors: Record<string, string>
  categoryColors: Record<string, string>
  isDeleting: boolean
  searchQuery?: string
  relatedItemName?: { name: string; type: 'competition' | 'activity' } | null
}

function highlightSearchTerm(text: string, searchQuery: string) {
  if (!searchQuery.trim()) return text
  
  const regex = new RegExp(`(${searchQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')
  const parts = text.split(regex)
  
  return parts.map((part, index) => 
    regex.test(part) ? (
      <mark key={index} className="bg-yellow-200 dark:bg-yellow-800 px-1 rounded">
        {part}
      </mark>
    ) : part
  )
}

function TaskItem({ task, onToggle, onDelete, priorityColors, categoryColors, isDeleting, searchQuery, relatedItemName }: TaskItemProps) {
  return (
    <div className={`flex items-start gap-3 p-4 rounded-lg border transition-all ${
      task.completed 
        ? "bg-gray-50 dark:bg-slate-700/50 border-gray-200 dark:border-gray-600" 
        : "bg-white dark:bg-slate-800 border-gray-200 dark:border-gray-700 hover:shadow-sm"
    }`}>
      <button
        onClick={() => onToggle(task.id)}
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
          {searchQuery ? highlightSearchTerm(task.title, searchQuery) : task.title}
        </h4>
        
        {task.description && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {searchQuery ? highlightSearchTerm(task.description, searchQuery) : task.description}
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
          
          {/* Show related competition/activity */}
          {relatedItemName && (
            <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
              {relatedItemName.type === 'competition' ? (
                <Trophy size={12} className="text-purple-500" />
              ) : (
                <Users size={12} className="text-orange-500" />
              )}
              <span>{relatedItemName.name}</span>
            </div>
          )}
          
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