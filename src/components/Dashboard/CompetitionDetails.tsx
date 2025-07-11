"use client"
import { useState } from "react"
import { Competition, Task } from "@/types"
import { ChevronLeft, Trophy, Calendar, TrendingUp, BookOpen, Sparkles, Save, Loader2 } from "lucide-react"
import { categoryDisplayNames, competitionCategoryColors, categoryBgColors } from "@/lib/categoryHelpers"
import { competitionService } from "@/services/competitionService"
import { useApiQuery, useApiMutation } from "@/hooks/useApiQuery"

interface CompetitionDetailsProps {
  competition: Competition
  tasks: Task[]
  onBack: () => void
}

export function CompetitionDetails({ competition, tasks, onBack }: CompetitionDetailsProps) {
  const relatedTasks = tasks.filter((task) => 
    task.relatedCompetitionId === competition.id ||
    task.title.toLowerCase().includes(competition.name.toLowerCase())
  )
  
  const completedTasks = relatedTasks.filter(task => task.completed).length
  const engagementLevel = relatedTasks.length > 0 
    ? Math.round((completedTasks / relatedTasks.length) * 100) 
    : 0

  const [currentInsight, setCurrentInsight] = useState("")

  // Fetch insights
  const { data: insights, isLoading: insightsLoading, refetch: refetchInsights } = useApiQuery(
    () => competitionService.getInsights(competition.id),
    [competition.id]
  )

  // Add personal insight mutation
  const { mutate: addInsight, isLoading: addingInsight } = useApiMutation(
    (content: string) => competitionService.addPersonalInsight(competition.id, content),
    {
      onSuccess: () => {
        setCurrentInsight("")
        refetchInsights()
      }
    }
  )

  // Generate AI insight mutation
  const { mutate: generateAI, isLoading: generatingAI } = useApiMutation(
    () => competitionService.generateAIInsight(competition.id),
    {
      onSuccess: () => {
        refetchInsights()
      }
    }
  )

  const handleSaveInsight = () => {
    if (currentInsight.trim()) {
      addInsight(currentInsight)
    }
  }

  const getEngagementColor = (level: number) => {
    if (level >= 80) return "bg-green-500"
    if (level >= 60) return "bg-blue-500"
    if (level >= 40) return "bg-yellow-500"
    return "bg-red-500"
  }

  if (insightsLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="animate-spin h-8 w-8 text-purple-600" />
      </div>
    )
  }

  const personalInsights = insights?.personalInsights || []
  const aiInsights = insights?.aiInsights || []

  return (
    <div className="space-y-6">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors font-medium"
      >
        <ChevronLeft size={20} />
        <span>Back to Dashboard</span>
      </button>

      {/* Hero Section */}
      <div className={`bg-gradient-to-r ${competitionCategoryColors[competition.category]} rounded-3xl p-8 text-white shadow-xl`}>
        <div className="flex items-start justify-between mb-6">
          <div>
            <p className="text-sm font-medium text-white/80 mb-1">
              {categoryDisplayNames[competition.category]}
            </p>
            <h2 className="text-3xl font-bold mb-2">{competition.name}</h2>
          </div>
          <span className="px-4 py-2 bg-white/20 backdrop-blur-sm text-white text-sm rounded-full font-medium border border-white/30">
            Competition
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-black/20 backdrop-blur-sm rounded-xl p-4 border border-white/20">
            <div className="flex items-center gap-3 mb-2">
              <Trophy size={20} />
              <span className="text-lg font-semibold">{competition.placement}</span>
            </div>
            <p className="text-sm text-white/90">Competition Result</p>
          </div>
          <div className="bg-black/20 backdrop-blur-sm rounded-xl p-4 border border-white/20">
            <div className="flex items-center gap-3 mb-2">
              <Calendar size={20} />
              <span className="text-lg font-semibold">{new Date(competition.date).toLocaleDateString()}</span>
            </div>
            <p className="text-sm text-white/90">Competition Date</p>
          </div>
        </div>
      </div>

      {/* Engagement Level Tracker */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-slate-700">
        <div className="flex items-center gap-3 mb-4">
          <TrendingUp className="text-yellow-600 dark:text-yellow-400" size={24} />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Preparation & Engagement</h3>
        </div>
        
        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600 dark:text-gray-300">Related Task Completion</span>
              <span className="text-lg font-bold text-gray-900 dark:text-white">{engagementLevel}%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
              <div 
                className={`h-full ${getEngagementColor(engagementLevel)} transition-all duration-500`}
                style={{ width: `${engagementLevel}%` }}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="text-center p-3 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{completedTasks}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Tasks Completed</p>
            </div>
            <div className="text-center p-3 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{relatedTasks.length}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Tasks</p>
            </div>
          </div>
        </div>
      </div>

      {/* Related Tasks Section */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-slate-700">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Related Preparation Tasks</h3>
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
          <p className="text-center text-gray-500 dark:text-gray-400 py-4">No preparation tasks found for this competition.</p>
        )}
      </div>

      {/* Personal Insights Section */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-slate-700">
        <div className="flex items-center gap-3 mb-4">
          <BookOpen className="text-blue-600 dark:text-blue-400" size={24} />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Competition Reflections</h3>
        </div>
        
        <div className="space-y-4">
          <div className="flex gap-3">
            <textarea
              value={currentInsight}
              onChange={(e) => setCurrentInsight(e.target.value)}
              placeholder="Record your experience, learnings, or reflections from this competition..."
              className="flex-1 p-3 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 resize-none"
              rows={3}
            />
            <button
              onClick={handleSaveInsight}
              disabled={!currentInsight.trim() || addingInsight}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 dark:disabled:bg-gray-600 transition-colors flex items-center gap-2 h-fit"
            >
              {addingInsight ? (
                <Loader2 className="animate-spin" size={16} />
              ) : (
                <Save size={16} />
              )}
              Save
            </button>
          </div>
          
          {personalInsights.length > 0 && (
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {personalInsights.map((insight) => (
                <div key={insight.id} className="p-3 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
                  <p className="text-gray-800 dark:text-gray-200">{insight.content}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {new Date(insight.timestamp).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* AI Insights Section */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-slate-700">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Sparkles className="text-yellow-600 dark:text-yellow-400" size={24} />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">AI Competition Analysis</h3>
          </div>
          <button
            onClick={() => generateAI()}
            disabled={generatingAI}
            className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 disabled:bg-gray-300 dark:disabled:bg-gray-600 transition-colors flex items-center gap-2"
          >
            {generatingAI ? (
              <>
                <Loader2 className="animate-spin" size={16} />
                Analyzing...
              </>
            ) : (
              <>
                <Sparkles size={16} />
                Generate Analysis
              </>
            )}
          </button>
        </div>
        
        {aiInsights.length > 0 ? (
          <div className="space-y-3">
            {aiInsights.map((insight) => (
              <div key={insight.id} className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                <p className="text-gray-800 dark:text-gray-200">{insight.content}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  Generated on {new Date(insight.generatedAt).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400 mb-2">No AI analysis generated yet</p>
            <p className="text-sm text-gray-400 dark:text-gray-500">Click the button above to get insights about your competition performance and future strategies</p>
          </div>
        )}
      </div>

      {/* Competition Details Section */}
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

        {competition.satisfaction && (
          <div className="mt-4">
            <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Satisfaction Level</h3>
            <div className="flex items-center gap-2">
              <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                <div 
                  className="h-full bg-yellow-500 transition-all duration-500"
                  style={{ width: `${competition.satisfaction * 20}%` }}
                />
              </div>
              <span className="text-sm text-gray-600 dark:text-gray-400">{competition.satisfaction}/5</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}