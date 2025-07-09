import { TownVisualization } from "./TownVisualization"
import { TaskList } from "./TaskList"
import { Calendar } from "./Calendar"
import type { Task, Event } from "@/types"

interface RoadmapProps {
  progressLevel: number
  tasks: Task[]
  events: Event[]
  onTaskToggle: (taskId: string) => void
  onTaskCreate: (newTask: Omit<Task, "id">) => void
  onTaskDelete: (taskId: string) => void
}

export function Roadmap({ progressLevel, tasks, events, onTaskToggle, onTaskCreate, onTaskDelete }: RoadmapProps) {
  const completedTasks = tasks.filter(task => task.completed).length
  const totalTasks = tasks.length
  const upcomingEvents = events.filter(event => new Date(event.date) > new Date()).length

  return (
    <div className="space-y-8">
      {/* Title Card Section */}
      <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-3xl p-8 text-white shadow-xl">
        <div className="max-w-4xl">
          <h1 className="text-4xl font-bold mb-3">Your College Readiness Roadmap</h1>
          <p className="text-lg text-white/90 leading-relaxed">
            Visualize your journey, manage your tasks, and stay on track. Every step forward 
            brings you closer to your college dreams.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-4">
            <div className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2 border border-white/30">
              <span className="text-2xl font-bold">{progressLevel}%</span>
              <span className="text-sm ml-2 text-white/90">Progress</span>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2 border border-white/30">
              <span className="text-2xl font-bold">{completedTasks}/{totalTasks}</span>
              <span className="text-sm ml-2 text-white/90">Tasks Complete</span>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2 border border-white/30">
              <span className="text-2xl font-bold">{upcomingEvents}</span>
              <span className="text-sm ml-2 text-white/90">Upcoming Events</span>
            </div>
          </div>
        </div>
      </div>

      <TownVisualization progressLevel={progressLevel} />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <TaskList tasks={tasks} onTaskToggle={onTaskToggle} onTaskCreate={onTaskCreate} onTaskDelete={onTaskDelete} />
        </div>
        <div className="lg:col-span-1">
          <Calendar events={events} />
        </div>
      </div>
    </div>
  )
}
