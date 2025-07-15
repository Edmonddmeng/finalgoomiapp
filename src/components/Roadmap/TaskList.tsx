
// "use client"

// import { useState } from "react"
// import { Task, TaskPriority, TaskCategory } from "@/types"
// import { Plus, Check, Trash2, X, Calendar, Tag, Loader2, Search } from "lucide-react"
// import { useCreateTask, useToggleTask, useDeleteTask } from "@/hooks/useTasks"
// import { format } from "date-fns"

// interface TaskListProps {
//   tasks: Task[]
//   selectedDate: Date | null
//   onClearSelectedDate: () => void
// }

// export function TaskList({ tasks, selectedDate, onClearSelectedDate }: TaskListProps) {
//   const [showCreateModal, setShowCreateModal] = useState(false)
//   const [filter, setFilter] = useState<TaskCategory | "all">("all")
//   const [showCompleted, setShowCompleted] = useState(true)
//   const [searchQuery, setSearchQuery] = useState("")
  
//   // Mutations
//   const { mutate: createTask, isLoading: creatingTask } = useCreateTask()
//   const { mutate: toggleTask } = useToggleTask() // Removed isLoading here
//   const { mutate: deleteTask, isLoading: deletingTask } = useDeleteTask()
  
//   const [newTask, setNewTask] = useState({
//     title: "",
//     description: "",
//     dueDate: new Date().toISOString().split("T")[0],
//     priority: "medium" as TaskPriority,
//     category: "personal" as TaskCategory,
//     tags: [] as string[]
//   })

//   const handleCreateTask = () => {
//     if (!newTask.title.trim()) return
    
//     createTask(newTask)
//     setShowCreateModal(false)
//     setNewTask({
//       title: "",
//       description: "",
//       dueDate: new Date().toISOString().split("T")[0],
//       priority: "medium",
//       category: "personal",
//       tags: []
//     })
//   }

//   const handleToggleTask = (taskId: string) => {
//     toggleTask(taskId)
//   }

//   const handleDeleteTask = (taskId: string) => {
//     if (window.confirm("Are you sure you want to delete this task?")) {
//       deleteTask(taskId)
//     }
//   }

//   const clearSearch = () => {
//     setSearchQuery("")
//   }

//   // Filter tasks
//   let filteredTasks = tasks
  
//   // Apply search filter
//   if (searchQuery.trim()) {
//     filteredTasks = filteredTasks.filter(task => 
//       task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase()))
//     )
//   }
  
//   // Apply date filter
//   if (selectedDate) {
//     const selectedDateStr = format(selectedDate, 'yyyy-MM-dd')
//     filteredTasks = filteredTasks.filter(task => 
//       task.dueDate && task.dueDate.startsWith(selectedDateStr)
//     )
//   }
  
//   // Apply category filter
//   if (filter !== "all") {
//     filteredTasks = filteredTasks.filter(task => task.category === filter)
//   }
  
//   // Apply completion filter
//   if (!showCompleted) {
//     filteredTasks = filteredTasks.filter(task => !task.completed)
//   }

//   const pendingTasks = filteredTasks.filter(task => !task.completed)
//   const completedTasks = filteredTasks.filter(task => task.completed)

//   const priorityColors = {
//     low: "bg-gray-100 text-gray-600",
//     medium: "bg-yellow-100 text-yellow-700",
//     high: "bg-red-100 text-red-700"
//   }

//   const categoryColors = {
//     academic: "bg-blue-50 text-blue-700 border-blue-200",
//     personal: "bg-green-50 text-green-700 border-green-200",
//     competition: "bg-purple-50 text-purple-700 border-purple-200",
//     activity: "bg-orange-50 text-orange-700 border-orange-200",
//     other: "bg-gray-50 text-gray-700 border-gray-200"
//   }

//   return (
//     <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-slate-700">
//       <div className="flex items-center justify-between mb-6">
//         <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Tasks</h2>
//         <button
//           onClick={() => setShowCreateModal(true)}
//           className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
//         >
//           <Plus size={20} />
//           <span>New Task</span>
//         </button>
//       </div>

//       {/* Search Bar */}
//       <div className="relative mb-4">
//         <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//           <Search size={20} className="text-gray-400" />
//         </div>
//         <input
//           type="text"
//           placeholder="Search tasks by name or description..."
//           value={searchQuery}
//           onChange={(e) => setSearchQuery(e.target.value)}
//           className="w-full pl-10 pr-10 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
//         />
//         {searchQuery && (
//           <button
//             onClick={clearSearch}
//             className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-gray-700 dark:hover:text-gray-300"
//           >
//             <X size={20} className="text-gray-400" />
//           </button>
//         )}
//       </div>

//       {/* Active Filters Display */}
//       <div className="flex flex-wrap gap-2 mb-4">
//         {searchQuery && (
//           <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm">
//             <Search size={12} />
//             <span>"{searchQuery}"</span>
//             <button
//               onClick={clearSearch}
//               className="ml-1 hover:text-blue-900 dark:hover:text-blue-100"
//             >
//               <X size={12} />
//             </button>
//           </div>
//         )}
        
//         {selectedDate && (
//           <div className="flex items-center gap-2 px-3 py-1.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-sm">
//             <Calendar size={12} />
//             <span>{format(selectedDate, 'MMM d, yyyy')}</span>
//             <button
//               onClick={onClearSelectedDate}
//               className="ml-1 hover:text-purple-900 dark:hover:text-purple-100"
//             >
//               <X size={12} />
//             </button>
//           </div>
//         )}
        
//         {filter !== "all" && (
//           <div className="flex items-center gap-2 px-3 py-1.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-sm">
//             <Tag size={12} />
//             <span>{filter}</span>
//             <button
//               onClick={() => setFilter("all")}
//               className="ml-1 hover:text-green-900 dark:hover:text-green-100"
//             >
//               <X size={12} />
//             </button>
//           </div>
//         )}
//       </div>

//       {/* Filters */}
//       <div className="flex flex-wrap gap-3 mb-6">
//         <select
//           value={filter}
//           onChange={(e) => setFilter(e.target.value as TaskCategory | "all")}
//           className="px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
//         >
//           <option value="all">All Categories</option>
//           <option value="academic">Academic</option>
//           <option value="personal">Personal</option>
//           <option value="competition">Competition</option>
//           <option value="activity">Activity</option>
//           <option value="other">Other</option>
//         </select>
        
//         <button
//           onClick={() => setShowCompleted(!showCompleted)}
//           className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors ${
//             showCompleted 
//               ? "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300" 
//               : "bg-gray-200 dark:bg-gray-600 text-gray-900 dark:text-white"
//           }`}
//         >
//           <Check size={14} />
//           <span>Show Completed</span>
//         </button>
//       </div>

//       {/* Search Results Summary */}
//       {searchQuery && (
//         <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
//           Found {filteredTasks.length} task{filteredTasks.length !== 1 ? 's' : ''} matching "{searchQuery}"
//         </div>
//       )}

//       {/* Tasks List */}
//       <div className="space-y-4">
//         {pendingTasks.length === 0 && completedTasks.length === 0 ? (
//           <div className="text-center py-8 text-gray-500 dark:text-gray-400">
//             {searchQuery ? (
//               <div className="space-y-2">
//                 <p>No tasks found matching "{searchQuery}"</p>
//                 <button
//                   onClick={clearSearch}
//                   className="text-purple-600 dark:text-purple-400 hover:underline"
//                 >
//                   Clear search
//                 </button>
//               </div>
//             ) : selectedDate ? (
//               "No tasks for this date"
//             ) : (
//               "No tasks yet. Create your first task!"
//             )}
//           </div>
//         ) : (
//           <>
//             {/* Pending Tasks */}
//             {pendingTasks.length > 0 && (
//               <div>
//                 <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-3">
//                   To Do ({pendingTasks.length})
//                 </h3>
//                 <div className="space-y-2">
//                   {pendingTasks.map((task) => (
//                     <TaskItem
//                       key={task.id}
//                       task={task}
//                       onToggle={handleToggleTask}
//                       onDelete={handleDeleteTask}
//                       priorityColors={priorityColors}
//                       categoryColors={categoryColors}
//                       isDeleting={deletingTask}
//                       searchQuery={searchQuery}
//                     />
//                   ))}
//                 </div>
//               </div>
//             )}

//             {/* Completed Tasks */}
//             {showCompleted && completedTasks.length > 0 && (
//               <div>
//                 <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-3">
//                   Completed ({completedTasks.length})
//                 </h3>
//                 <div className="space-y-2 opacity-75">
//                   {completedTasks.map((task) => (
//                     <TaskItem
//                       key={task.id}
//                       task={task}
//                       onToggle={handleToggleTask}
//                       onDelete={handleDeleteTask}
//                       priorityColors={priorityColors}
//                       categoryColors={categoryColors}
//                       isDeleting={deletingTask}
//                       searchQuery={searchQuery}
//                     />
//                   ))}
//                 </div>
//               </div>
//             )}
//           </>
//         )}
//       </div>

//       {/* Create Task Modal */}
//       {showCreateModal && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
//           <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 max-w-md w-full">
//             <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Create New Task</h3>
            
//             <div className="space-y-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//                   Title
//                 </label>
//                 <input
//                   type="text"
//                   value={newTask.title}
//                   onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
//                   className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
//                   placeholder="Enter task title"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//                   Description
//                 </label>
//                 <textarea
//                   value={newTask.description}
//                   onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
//                   className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
//                   rows={3}
//                   placeholder="Add description (optional)"
//                 />
//               </div>

//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//                     Due Date
//                   </label>
//                   <input
//                     type="date"
//                     value={newTask.dueDate}
//                     onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
//                     className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//                     Priority
//                   </label>
//                   <select
//                     value={newTask.priority}
//                     onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as TaskPriority })}
//                     className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
//                   >
//                     <option value="low">Low</option>
//                     <option value="medium">Medium</option>
//                     <option value="high">Medium</option>
//                     <option value="high">High</option>
//                   </select>
//                 </div>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//                   Category
//                 </label>
//                 <select
//                   value={newTask.category}
//                   onChange={(e) => setNewTask({ ...newTask, category: e.target.value as TaskCategory })}
//                   className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
//                 >
//                   <option value="academic">Academic</option>
//                   <option value="personal">Personal</option>
//                   <option value="competition">Competition</option>
//                   <option value="activity">Activity</option>
//                   <option value="other">Other</option>
//                 </select>
//               </div>
//             </div>

//             <div className="flex gap-3 mt-6">
//               <button
//                 onClick={handleCreateTask}
//                 disabled={!newTask.title.trim() || creatingTask}
//                 className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-300 dark:disabled:bg-gray-600 transition-colors"
//               >
//                 {creatingTask ? (
//                   <Loader2 className="animate-spin" size={20} />
//                 ) : (
//                   <>
//                     <Plus size={20} />
//                     <span>Create Task</span>
//                   </>
//                 )}
//               </button>
//               <button
//                 onClick={() => setShowCreateModal(false)}
//                 className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
//               >
//                 Cancel
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }

// // Task Item Component with improved checkbox handling
// interface TaskItemProps {
//   task: Task
//   onToggle: (taskId: string) => void
//   onDelete: (taskId: string) => void
//   priorityColors: Record<string, string>
//   categoryColors: Record<string, string>
//   isDeleting: boolean
//   searchQuery?: string
// }

// // Helper function to highlight search terms
// function highlightSearchTerm(text: string, searchQuery: string) {
//   if (!searchQuery.trim()) return text
  
//   const regex = new RegExp(`(${searchQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')
//   const parts = text.split(regex)
  
//   return parts.map((part, index) => 
//     regex.test(part) ? (
//       <mark key={index} className="bg-yellow-200 dark:bg-yellow-800 px-1 rounded">
//         {part}
//       </mark>
//     ) : part
//   )
// }

// function TaskItem({ task, onToggle, onDelete, priorityColors, categoryColors, isDeleting, searchQuery }: TaskItemProps) {
//   return (
//     <div className={`flex items-start gap-3 p-4 rounded-lg border transition-all ${
//       task.completed 
//         ? "bg-gray-50 dark:bg-slate-700/50 border-gray-200 dark:border-gray-600" 
//         : "bg-white dark:bg-slate-800 border-gray-200 dark:border-gray-700 hover:shadow-sm"
//     }`}>
//       <button
//         onClick={() => onToggle(task.id)}
//         className={`mt-0.5 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
//           task.completed
//             ? "bg-green-500 border-green-500"
//             : "border-gray-300 dark:border-gray-600 hover:border-purple-500"
//         }`}
//       >
//         {task.completed && <Check size={12} className="text-white" />}
//       </button>
      
//       <div className="flex-1">
//         <h4 className={`font-medium ${
//           task.completed 
//             ? "text-gray-500 dark:text-gray-400 line-through" 
//             : "text-gray-900 dark:text-white"
//         }`}>
//           {searchQuery ? highlightSearchTerm(task.title, searchQuery) : task.title}
//         </h4>
        
//         {task.description && (
//           <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
//             {searchQuery ? highlightSearchTerm(task.description, searchQuery) : task.description}
//           </p>
//         )}
        
//         <div className="flex flex-wrap items-center gap-3 mt-2">
//           {task.dueDate && (
//             <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
//               <Calendar size={12} />
//               <span>{format(new Date(task.dueDate), 'MMM d')}</span>
//             </div>
//           )}
          
//           <span className={`text-xs px-2 py-0.5 rounded-full ${priorityColors[task.priority]}`}>
//             {task.priority}
//           </span>
          
//           <span className={`text-xs px-2 py-0.5 rounded-full border ${categoryColors[task.category]}`}>
//             {task.category}
//           </span>
          
//           {task.tags && task.tags.length > 0 && (
//             <div className="flex items-center gap-1">
//               <Tag size={12} className="text-gray-400" />
//               {task.tags.map((tag, index) => (
//                 <span key={index} className="text-xs text-gray-500 dark:text-gray-400">
//                   {tag}
//                 </span>
//               ))}
//             </div>
//           )}
//         </div>
//       </div>
      
//       <button
//         onClick={() => onDelete(task.id)}
//         disabled={isDeleting}
//         className="text-gray-400 hover:text-red-500 transition-colors"
//       >
//         <Trash2 size={16} />
//       </button>
//     </div>
//   )
// }



// Option 1: Add a refresh state to your TaskList component
"use client"

import { useState } from "react"
import { Task, TaskPriority, TaskCategory } from "@/types"
import { Plus, Check, Trash2, X, Calendar, Tag, Loader2, Search } from "lucide-react"
import { useCreateTask, useToggleTask, useDeleteTask } from "@/hooks/useTasks"
import { format } from "date-fns"

interface TaskListProps {
  tasks: Task[]
  selectedDate: Date | null
  onClearSelectedDate: () => void
  onRefreshNeeded?: () => void
}

export function TaskList({ tasks, selectedDate, onClearSelectedDate, onRefreshNeeded }: TaskListProps) {
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [filter, setFilter] = useState<TaskCategory | "all">("all")
  const [showCompleted, setShowCompleted] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [refreshKey, setRefreshKey] = useState(0) // Add this line
  
  // Mutations
  const { mutate: createTask, isLoading: creatingTask } = useCreateTask()
  const { mutate: toggleTask } = useToggleTask()
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

  // Modified handleToggleTask to force component refresh
  // const handleToggleTask = async (taskId: string) => {
  //   await toggleTask(taskId)
  //   // Force component to re-render by changing the key
  //   setRefreshKey(prev => prev + 1)
  // }

  const handleToggleTask = async (taskId: string) => {
    console.log('🖱️ Checkbox clicked for task:', taskId)
    
    try {
      console.log('🔄 Calling toggleTask API...')
      await toggleTask(taskId)
      console.log('✅ API call completed')
      
      // Instead of refreshing this component, refresh the parent
      if (onRefreshNeeded) {
        console.log('🔄 Calling parent refresh...')
        onRefreshNeeded()
      } else {
        console.log('⚠️ No onRefreshNeeded prop provided')
      }

      window.location.reload()
      
    } catch (error) {
      console.error('❌ Toggle failed:', error)
    }
  }
  
  const handleDeleteTask = (taskId: string) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      deleteTask(taskId)
    }
  }

  const clearSearch = () => {
    setSearchQuery("")
  }

  // Filter tasks
  let filteredTasks = tasks
  
  // Apply search filter
  if (searchQuery.trim()) {
    filteredTasks = filteredTasks.filter(task => 
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase()))
    )
  }
  
  // Apply date filter
  if (selectedDate) {
    const selectedDateStr = format(selectedDate, 'yyyy-MM-dd')
    filteredTasks = filteredTasks.filter(task => 
      task.dueDate && task.dueDate.startsWith(selectedDateStr)
    )
  }
  
  // Apply category filter
  if (filter !== "all") {
    filteredTasks = filteredTasks.filter(task => task.category === filter)
  }
  
  // Apply completion filter
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
    // Add the refreshKey to force re-render
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

      {/* Rest of your component remains exactly the same... */}
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
            <button
              onClick={clearSearch}
              className="ml-1 hover:text-blue-900 dark:hover:text-blue-100"
            >
              <X size={12} />
            </button>
          </div>
        )}
        
        {selectedDate && (
          <div className="flex items-center gap-2 px-3 py-1.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-sm">
            <Calendar size={12} />
            <span>{format(selectedDate, 'MMM d, yyyy')}</span>
            <button
              onClick={onClearSelectedDate}
              className="ml-1 hover:text-purple-900 dark:hover:text-purple-100"
            >
              <X size={12} />
            </button>
          </div>
        )}
        
        {filter !== "all" && (
          <div className="flex items-center gap-2 px-3 py-1.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-sm">
            <Tag size={12} />
            <span>{filter}</span>
            <button
              onClick={() => setFilter("all")}
              className="ml-1 hover:text-green-900 dark:hover:text-green-100"
            >
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
              ? "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300" 
              : "bg-gray-200 dark:bg-gray-600 text-gray-900 dark:text-white"
          }`}
        >
          <Check size={14} />
          <span>Show Completed</span>
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
                <button
                  onClick={clearSearch}
                  className="text-purple-600 dark:text-purple-400 hover:underline"
                >
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

// TaskItem component remains the same
interface TaskItemProps {
  task: Task
  onToggle: (taskId: string) => void
  onDelete: (taskId: string) => void
  priorityColors: Record<string, string>
  categoryColors: Record<string, string>
  isDeleting: boolean
  searchQuery?: string
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

function TaskItem({ task, onToggle, onDelete, priorityColors, categoryColors, isDeleting, searchQuery }: TaskItemProps) {
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