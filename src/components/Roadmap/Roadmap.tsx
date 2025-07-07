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
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Your College Readiness Roadmap</h1>
        <p className="text-gray-600 dark:text-gray-300">
          Visualize your journey, manage your tasks, and stay on track.
        </p>
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
