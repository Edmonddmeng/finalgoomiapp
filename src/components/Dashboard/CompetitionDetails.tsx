"use client"
import type { User, Competition, Task, ActivityCategory } from "@/types"
import { ChevronLeft, Trophy, Calendar } from "lucide-react"
import { categoryDisplayNames, categoryColors, categoryBgColors } from "@/lib/categoryHelpers"

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

      {/* Hero Section with consistent styling */}
      <div className={`bg-gradient-to-r ${categoryColors[competition.category]} rounded-3xl p-8 text-white shadow-xl`}>
        <div className="flex items-start justify-between mb-6">
          <div>
            <p className="text-sm font-medium text-white/80 mb-1">
              {categoryDisplayNames[competition.category]}
            </p>
            <h2 className="text-3xl font-bold mb-2">{competition.name}</h2>
          </div>
          <span className="px-4 py-2 bg-white/20 backdrop-blur-sm text-white text-sm rounded-full font-medium">
            Competition
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <div className="flex items-center gap-3 mb-2">
              <Trophy size={20} />
              <span className="text-lg font-semibold">{competition.placement}</span>
            </div>
            <p className="text-sm text-white/80">Competition Result</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <div className="flex items-center gap-3 mb-2">
              <Calendar size={20} />
              <span className="text-lg font-semibold">{new Date(competition.date).toLocaleDateString()}</span>
            </div>
            <p className="text-sm text-white/80">Competition Date</p>
          </div>
        </div>
      </div>

      {/* Details Section */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-slate-700">
        <div className="mb-4">
          <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${categoryBgColors[competition.category]}`}>
            {categoryDisplayNames[competition.category]}
          </span>
        </div>

        {competition.description && (
          <div>
            <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Description</h3>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{competition.description}</p>
          </div>
        )}

        {competition.notes && (
          <div className="mt-4">
            <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Additional Notes</h3>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{competition.notes}</p>
          </div>
        )}
      </div>

      {/* Related Tasks Section */}
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