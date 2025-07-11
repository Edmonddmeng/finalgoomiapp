import { useState } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { useTasks } from "@/hooks/useTasks"
import { SimplePixelVisualization } from "./SimplePixelVisualization"
import { TaskList } from "./TaskList"
import { Calendar } from "./Calendar"
import { Loader2 } from "lucide-react"

export function Roadmap() {
  const { user } = useAuth()
  const { data: tasksData, isLoading } = useTasks({ status: 'all' })
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  
  const tasks = tasksData?.items || []
  const completedTasks = tasks.filter(task => task.completed).length
  const totalTasks = tasks.length
  const upcomingTasks = tasks.filter(task => {
    if (!task.dueDate) return false
    return new Date(task.dueDate) > new Date()
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-3">
          <Loader2 className="animate-spin h-12 w-12 text-purple-600 mx-auto" />
          <p className="text-gray-500 dark:text-gray-400">Loading your roadmap...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Title Card Section */}
      <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-3xl p-8 text-white shadow-xl">
        <div className="max-w-4xl">
          <h1 className="text-4xl font-bold mb-3">Your Achievement Roadmap</h1>
          <p className="text-lg text-white/90 leading-relaxed">
            Visualize your growth journey, manage your goals, and track your progress. Every task completed 
            helps you grow stronger and reach new heights.
          </p>
        </div>
      </div>

      <SimplePixelVisualization completedTasks={completedTasks} totalTasks={totalTasks} />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <TaskList 
            tasks={tasks}
            selectedDate={selectedDate}
            onClearSelectedDate={() => setSelectedDate(null)}
          />
        </div>
        <div className="lg:col-span-1">
          <Calendar 
            tasks={tasks}
            upcomingEvents={upcomingTasks}
            selectedDate={selectedDate}
            onDateSelect={setSelectedDate}
          />
        </div>
      </div>
    </div>
  )
}