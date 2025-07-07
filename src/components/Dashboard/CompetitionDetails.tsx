"use client"
import type { User, Competition, Task } from "@/types"
import { ChevronLeft, Trophy, Calendar } from "lucide-react"

interface CompetitionDetailsProps {
  user: User
  competition: Competition
  tasks: Task[]
  onBack: () => void
}

export function CompetitionDetails({ user, competition, tasks, onBack }: CompetitionDetailsProps) {
  const relatedTasks = tasks.filter((task) => task.title.toLowerCase().includes(competition.name.toLowerCase()))

  return (
    <div className="space-y-6">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors font-medium"
      >
        <ChevronLeft size={20} />
        <span>Back to Dashboard</span>
      </button>

      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-slate-700">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-sm font-medium text-yellow-600">{competition.category}</p>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{competition.name}</h2>
          </div>
          <span className="px-3 py-1 bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-300 text-xs rounded-full font-medium">
            Competition
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 text-sm text-gray-800 dark:text-gray-300">
          <div className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
            <Trophy size={16} className="text-gray-500 dark:text-gray-400" />
            <span>
              Result: <span className="font-semibold text-gray-800 dark:text-gray-200">{competition.placement}</span>
            </span>
          </div>
          <div className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
            <Calendar size={16} className="text-gray-500 dark:text-gray-400" />
            <span>Date: {new Date(competition.date).toLocaleDateString()}</span>
          </div>
        </div>

        {competition.description && (
          <div>
            <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Description</h3>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{competition.description}</p>
          </div>
        )}
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-slate-700">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Related Tasks</h3>
        {relatedTasks.length > 0 ? (
          <ul className="space-y-2">
            {relatedTasks.map((task) => (
              <li
                key={task.id}
                className={`p-3 rounded-lg flex items-center gap-3 ${task.completed ? "bg-green-50 dark:bg-green-900/20 text-gray-500 dark:text-gray-400 line-through" : "bg-gray-50 dark:bg-slate-700/50"}`}
              >
                <div className={`w-2 h-2 rounded-full ${task.completed ? "bg-green-400" : "bg-yellow-400"}`}></div>
                <span className="dark:text-gray-300">{task.title}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-gray-500 dark:text-gray-400 py-4">No tasks related to this competition.</p>
        )}
      </div>
    </div>
  )
}
