
"use client"
import { useState } from "react"
import { Competition, Task } from "@/types"
import { 
  ChevronLeft, 
  Trophy, 
  Calendar, 
  TrendingUp, 
  BookOpen, 
  Sparkles, 
  Save, 
  Loader2, 
  Trash2, 
  X, 
  Check, 
  Clock, 
  Tag, 
  Edit2, 
  ExternalLink,
  CheckCircle,
  Circle
} from "lucide-react"
import { categoryDisplayNames, competitionCategoryColors, categoryBgColors } from "@/lib/categoryHelpers"
import { competitionService } from "@/services/competitionService"
import { useApiQuery, useApiMutation } from "@/hooks/useApiQuery"
import { useToggleTask } from "@/hooks/useTasks"
import { useCompleteCompetition, useUncompleteCompetition } from "@/hooks/useCompetitions"
import { format, isAfter, startOfDay } from "date-fns"

interface CompetitionDetailsProps {
  competition: Competition
  tasks: Task[]
  onBack: () => void
  onTaskUpdate?: () => void // Callback to refresh tasks
  onCompetitionUpdate?: () => void // Callback to refresh competition
}


// Fix for CompetitionDetails.tsx - Add proper null checks and loading state

export function CompetitionDetails({ 
  competition, 
  tasks, 
  onBack, 
  onTaskUpdate, 
  onCompetitionUpdate 
}: CompetitionDetailsProps) {
  
  // Add early return if competition is not loaded yet
  if (!competition || !competition.id || !competition.name) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-3">
          <Loader2 className="animate-spin h-12 w-12 text-purple-600 mx-auto" />
          <p className="text-gray-500 dark:text-gray-400">Loading competition details...</p>
        </div>
      </div>
    )
  }

  // Safe filtering with null checks
  const relatedTasks = tasks.filter((task) => {
    if (!task || !task.title) return false
    
    return task.relatedCompetitionId === competition.id ||
           task.title.toLowerCase().includes(competition.name.toLowerCase())
  })  
  const completedTasks = relatedTasks.filter(task => task.completed).length
  const engagementLevel = relatedTasks.length > 0 
    ? Math.round((completedTasks / relatedTasks.length) * 100) 
    : 0

  const [currentInsight, setCurrentInsight] = useState("")
  const [deletingInsightId, setDeletingInsightId] = useState<string | null>(null)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [togglingTaskId, setTogglingTaskId] = useState<string | null>(null)

  // Competition completion hooks
  const { mutateAsync: completeCompetition, isLoading: completing } = useCompleteCompetition()
  const { mutateAsync: uncompleteCompetition, isLoading: uncompleting } = useUncompleteCompetition()

  // Check if competition can be completed (date is not in future)
  const canCompleteCompetition = () => {
    const competitionDate = new Date(competition.date)
    const today = startOfDay(new Date())
    return !isAfter(competitionDate, today)
  }

  // Task toggle mutation
  const { mutate: toggleTask } = useToggleTask()

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

  // Delete insight mutation
  const { mutate: deleteInsight } = useApiMutation(
    (insightId: string) => competitionService.deleteInsight(competition.id, insightId),
    {
      onSuccess: () => {
        setDeletingInsightId(null)
        refetchInsights()
      },
      onError: (error) => {
        console.error('Failed to delete insight:', error)
        setDeletingInsightId(null)
      }
    }
  )

  const handleSaveInsight = () => {
    if (currentInsight.trim()) {
      addInsight(currentInsight)
    }
  }

  const handleDeleteInsight = (insightId: string) => {
    if (window.confirm('Are you sure you want to delete this insight?')) {
      setDeletingInsightId(insightId)
      deleteInsight(insightId)
    }
  }

  const handleToggleTask = async (taskId: string) => {
    setTogglingTaskId(taskId)
    try {
      await toggleTask(taskId)
      // Refresh tasks in parent component
      if (onTaskUpdate) {
        onTaskUpdate()
      }
    } catch (error) {
      console.error('Failed to toggle task:', error)
    } finally {
      setTogglingTaskId(null)
    }
  }

  const handleCompleteCompetition = async () => {
    try {
      if (competition.completed) {
        await uncompleteCompetition(competition.id)
      } else {
        await completeCompetition(competition.id)
      }
      
      // Refresh the current competition data
      if (onCompetitionUpdate) {
        await onCompetitionUpdate()
      }
    } catch (error) {
      console.error('Failed to update competition status:', error)
    }
  }

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task)
  }

  const handleCloseTaskDetails = () => {
    setSelectedTask(null)
  }

  const getEngagementColor = (level: number) => {
    if (level >= 80) return "bg-green-500"
    if (level >= 60) return "bg-blue-500"
    if (level >= 40) return "bg-yellow-500"
    return "bg-red-500"
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-700 border-red-200'
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200'
      case 'low': return 'bg-green-100 text-green-700 border-green-200'
      default: return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  const getCategoryColor = (category: string) => {
    const colors = {
      academic: 'bg-blue-100 text-blue-700 border-blue-200',
      personal: 'bg-purple-100 text-purple-700 border-purple-200',
      competition: 'bg-orange-100 text-orange-700 border-orange-200',
      activity: 'bg-green-100 text-green-700 border-green-200',
      other: 'bg-gray-100 text-gray-700 border-gray-200'
    }
    return colors[category as keyof typeof colors] || colors.other
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
      {/* Header with Back Button and Completion Button */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors font-medium"
        >
          <ChevronLeft size={20} />
          <span>Back to Dashboard</span>
        </button>

        {/* Competition Completion Button */}
        {canCompleteCompetition() && (
          <button
            onClick={handleCompleteCompetition}
            disabled={completing || uncompleting}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              competition.completed
                ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300'
                : 'bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-300'
            } disabled:opacity-50`}
          >
            {completing || uncompleting ? (
              <Loader2 className="animate-spin" size={16} />
            ) : competition.completed ? (
              <>
                <Circle size={16} />
                <span>Mark Incomplete</span>
              </>
            ) : (
              <>
                <CheckCircle size={16} />
                <span>Mark Complete</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* Hero Section */}
      <div
        className={`
          relative overflow-hidden rounded-3xl p-10 shadow-2xl
          ${competition.completed 
            ? 'bg-gradient-to-br from-green-700 via-emerald-500 to-teal-400 dark:from-green-900 dark:via-emerald-700 dark:to-teal-600' 
            : 'bg-gradient-to-br from-purple-700 via-pink-500 to-yellow-400 dark:from-purple-900 dark:via-pink-700 dark:to-yellow-600'
          }
          border-2 border-white/20
        `}
        style={{
          boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.25)",
        }}
      >
        <div className="absolute -top-10 -left-10 w-48 h-48 bg-pink-400/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -right-16 w-64 h-64 bg-yellow-300/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 w-40 h-40 bg-purple-500/20 rounded-full blur-2xl pointer-events-none -translate-x-1/2 -translate-y-1/2" />

        <div className="relative flex items-start justify-between mb-8 z-10">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <p className="text-base font-semibold uppercase tracking-widest text-white/80 drop-shadow">
                {categoryDisplayNames[competition.category]}
              </p>
              {competition.completed && (
                <div className="flex items-center gap-1 px-2 py-1 bg-green-500/30 backdrop-blur-sm rounded-full border border-green-400/50">
                  <CheckCircle size={14} className="text-green-200" />
                  <span className="text-xs text-green-100 font-medium">Completed</span>
                </div>
              )}
            </div>
            <h2 className="text-5xl md:text-6xl font-extrabold mb-3 bg-gradient-to-r from-yellow-300 via-pink-400 to-purple-500 bg-clip-text text-transparent drop-shadow-2xl flex items-center gap-3">
              {competition.name}
            </h2>
            {competition.completedAt && (
              <p className="text-white/80 text-sm">
                Completed on {format(new Date(competition.completedAt), 'MMMM d, yyyy')}
              </p>
            )}
          </div>
          <span className="px-5 py-2 bg-white/30 backdrop-blur-md text-purple-900 dark:text-white text-base rounded-full font-bold border border-white/40 shadow-lg tracking-wide">
            Competition
          </span>
        </div>

        <div className="relative grid grid-cols-1 md:grid-cols-2 gap-8 z-10">
          <div className="bg-white/20 dark:bg-black/30 backdrop-blur-lg rounded-2xl p-6 border border-white/30 shadow-md flex flex-col items-center">
            <div className="flex items-center gap-3 mb-2">
              <Trophy size={28} className="text-yellow-300 drop-shadow" />
              <span className="text-2xl font-bold text-white drop-shadow">{competition.placement}</span>
            </div>
            <p className="text-base text-white/90 font-medium tracking-wide">Competition Result</p>
          </div>
          <div className="bg-white/20 dark:bg-black/30 backdrop-blur-lg rounded-2xl p-6 border border-white/30 shadow-md flex flex-col items-center">
            <div className="flex items-center gap-3 mb-2">
              <Calendar size={26} className="text-pink-200 drop-shadow" />
              <span className="text-2xl font-bold text-white drop-shadow">
                {format(new Date(competition.date), 'MMM d, yyyy')}
              </span>
            </div>
            <p className="text-base text-white/90 font-medium tracking-wide">Competition Date</p>
          </div>
        </div>

        {/* Show completion notice if competition is in future */}
        {!canCompleteCompetition() && (
          <div className="relative mt-6 p-4 bg-blue-500/20 backdrop-blur-sm rounded-lg border border-blue-400/50 z-10">
            <div className="flex items-center gap-2 text-blue-100">
              <Clock size={16} />
              <span className="text-sm font-medium">
                Competition completion will be available after {format(new Date(competition.date), 'MMMM d, yyyy')}
              </span>
            </div>
          </div>
        )}
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

      {/* Enhanced Related Tasks Section */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-slate-700">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Related Preparation Tasks</h3>
        {relatedTasks.length > 0 ? (
          <div className="space-y-3">
            {relatedTasks.map((task) => (
              <div
                key={task.id}
                className={`group p-4 rounded-lg border transition-all cursor-pointer hover:shadow-md ${
                  task.completed 
                    ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800" 
                    : "bg-gray-50 dark:bg-slate-700/50 border-gray-200 dark:border-gray-600 hover:border-purple-300 dark:hover:border-purple-700"
                }`}
                onClick={() => handleTaskClick(task)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    {/* Task completion toggle */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleToggleTask(task.id)
                      }}
                      disabled={togglingTaskId === task.id}
                      className={`mt-1 w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                        task.completed
                          ? "bg-green-500 border-green-500"
                          : "border-gray-300 dark:border-gray-600 hover:border-purple-500"
                      } ${togglingTaskId === task.id ? 'opacity-50' : ''}`}
                    >
                      {togglingTaskId === task.id ? (
                        <Loader2 className="animate-spin" size={10} />
                      ) : (
                        task.completed && <Check size={12} className="text-white" />
                      )}
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
                      
                      <div className="flex flex-wrap items-center gap-2 mt-2">
                        {task.dueDate && (
                          <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                            <Clock size={12} />
                            <span>{format(new Date(task.dueDate), 'MMM d')}</span>
                          </div>
                        )}
                        
                        <span className={`text-xs px-2 py-0.5 rounded-full border ${getPriorityColor(task.priority)}`}>
                          {task.priority}
                        </span>
                        
                        <span className={`text-xs px-2 py-0.5 rounded-full border ${getCategoryColor(task.category)}`}>
                          {task.category}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ExternalLink size={16} className="text-gray-400" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 dark:text-gray-400 py-4">No preparation tasks found for this competition.</p>
        )}
      </div>

      {/* Task Details Modal */}
      {selectedTask && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Task Details</h3>
                <button
                  onClick={handleCloseTaskDetails}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-full transition-colors"
                >
                  <X size={20} className="text-gray-600 dark:text-gray-300" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h4 className={`text-lg font-semibold ${
                    selectedTask.completed 
                      ? "text-gray-500 dark:text-gray-400 line-through" 
                      : "text-gray-900 dark:text-white"
                  }`}>
                    {selectedTask.title}
                  </h4>
                  
                  {selectedTask.description && (
                    <p className="text-gray-600 dark:text-gray-400 mt-2">
                      {selectedTask.description}
                    </p>
                  )}
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Priority</label>
                    <span className={`inline-block mt-1 px-2 py-1 rounded-full text-xs border ${getPriorityColor(selectedTask.priority)}`}>
                      {selectedTask.priority}
                    </span>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Category</label>
                    <span className={`inline-block mt-1 px-2 py-1 rounded-full text-xs border ${getCategoryColor(selectedTask.category)}`}>
                      {selectedTask.category}
                    </span>
                  </div>
                </div>
                
                {selectedTask.dueDate && (
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Due Date</label>
                    <div className="flex items-center gap-2 mt-1">
                      <Calendar size={16} className="text-gray-500" />
                      <span className="text-gray-900 dark:text-white">
                        {format(new Date(selectedTask.dueDate), 'MMMM d, yyyy')}
                      </span>
                    </div>
                  </div>
                )}
                
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
                  <div className="flex items-center gap-2 mt-1">
                    <div className={`w-2 h-2 rounded-full ${selectedTask.completed ? 'bg-green-500' : 'bg-yellow-500'}`} />
                    <span className="text-gray-900 dark:text-white">
                      {selectedTask.completed ? 'Completed' : 'Pending'}
                    </span>
                  </div>
                </div>
                
                {selectedTask.tags && selectedTask.tags.length > 0 && (
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Tags</label>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {selectedTask.tags.map((tag, index) => (
                        <span key={index} className="flex items-center gap-1 px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-xs">
                          <Tag size={10} />
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => handleToggleTask(selectedTask.id)}
                  disabled={togglingTaskId === selectedTask.id}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    selectedTask.completed
                      ? 'bg-yellow-600 hover:bg-yellow-700 text-white'
                      : 'bg-green-600 hover:bg-green-700 text-white'
                  } disabled:opacity-50`}
                >
                  {togglingTaskId === selectedTask.id ? (
                    <Loader2 className="animate-spin" size={16} />
                  ) : (
                    <>
                      <Check size={16} />
                      <span>{selectedTask.completed ? 'Mark Incomplete' : 'Mark Complete'}</span>
                    </>
                  )}
                </button>
                
                <button
                  onClick={handleCloseTaskDetails}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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
                <div key={insight.id} className="group p-3 bg-gray-50 dark:bg-slate-700/50 rounded-lg relative">
                  <p className="text-gray-800 dark:text-gray-200 pr-8">{insight.content}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {new Date(insight.timestamp).toLocaleString()}
                  </p>
                  <button
                    onClick={() => handleDeleteInsight(insight.id)}
                    disabled={deletingInsightId === insight.id}
                    className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-500 transition-all duration-200 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20"
                    title="Delete insight"
                  >
                    {deletingInsightId === insight.id ? (
                      <Loader2 className="animate-spin" size={14} />
                    ) : (
                      <Trash2 size={14} />
                    )}
                  </button>
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
              <div key={insight.id} className="group p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800 relative">
                <p className="text-gray-800 dark:text-gray-200 pr-8">{insight.content}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  Generated on {new Date(insight.generatedAt).toLocaleString()}
                </p>
                <button
                  onClick={() => handleDeleteInsight(insight.id)}
                  disabled={deletingInsightId === insight.id}
                  className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-500 transition-all duration-200 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20"
                  title="Delete AI insight"
                >
                  {deletingInsightId === insight.id ? (
                    <Loader2 className="animate-spin" size={14} />
                  ) : (
                    <X size={14} />
                  )}
                </button>
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
                  style={{ width: `${(competition.satisfaction || 0) * 20}%` }}
                />
              </div>
              <span className="text-sm text-gray-600 dark:text-gray-400">{competition.satisfaction || 0}/5</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}