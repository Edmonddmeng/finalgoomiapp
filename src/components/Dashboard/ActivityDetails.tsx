
"use client"
import { useState } from "react"
import { Activity, Task } from "@/types"
import { ChevronLeft, Calendar, Clock, Briefcase, TrendingUp, BookOpen, Sparkles, Save, Loader2, Trash2, X, Check, Tag, ExternalLink } from "lucide-react"
import { activityService } from "@/services/activityService"
import { useApiQuery, useApiMutation } from "@/hooks/useApiQuery"
import { useToggleTask } from "@/hooks/useTasks"
import { format } from "date-fns"
import { useConfirm } from "@/components/Utils/ConfirmDialog"

interface ActivityDetailsProps {
  activity: Activity
  tasks: Task[]
  onBack: () => void
  onTaskUpdate?: () => void // Callback to refresh tasks
}

export function ActivityDetails({ activity, tasks, onBack, onTaskUpdate }: ActivityDetailsProps) {
  console.log('Start Date:', activity)
  console.log('Hours per week:', activity.hoursPerWeek)
  console.log('Activity object:', activity)
  const { confirm } = useConfirm()
  
  // Recalculate related tasks and engagement level whenever tasks change
  const relatedTasks = tasks.filter((task) => 
    task.relatedActivityId === activity.id ||
    task.title.toLowerCase().includes(activity.name.toLowerCase())
  )
  
  const completedTasks = relatedTasks.filter(task => task.completed).length
  const engagementLevel = relatedTasks.length > 0 
    ? Math.round((completedTasks / relatedTasks.length) * 100) 
    : 0

  const [currentInsight, setCurrentInsight] = useState("")
  const [deletingInsightId, setDeletingInsightId] = useState<string | null>(null)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [togglingTaskId, setTogglingTaskId] = useState<string | null>(null)
  const [refreshKey, setRefreshKey] = useState(0) // Add refresh key for re-rendering

  // Task toggle mutation
  const { mutate: toggleTask } = useToggleTask()

  // Fetch insights
  const { data: insights, isLoading: insightsLoading, refetch: refetchInsights } = useApiQuery(
    () => activityService.getInsights(activity.id),
    [activity.id]
  )

  // Add personal insight mutation
  const { mutate: addInsight, isLoading: addingInsight } = useApiMutation(
    (content: string) => activityService.addPersonalInsight(activity.id, content),
    {
      onSuccess: () => {
        setCurrentInsight("")
        refetchInsights()
      }
    }
  )

  // Generate AI insight mutation
  const { mutate: generateAI, isLoading: generatingAI } = useApiMutation(
    () => activityService.generateAIInsight(activity.id),
    {
      onSuccess: () => {
        refetchInsights()
      }
    }
  )

  // Delete insight mutation
  const { mutate: deleteInsight } = useApiMutation(
    (insightId: string) => activityService.deleteInsight(activity.id, insightId),
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

  const handleDeleteInsight = async (insightId: string) => {
    const confirmed = await confirm({
      title: "Delete Insight",
      message: `Are you sure you want to delete this insight?`,
      confirmText: "Delete",
      cancelText: "Cancel",
      type: "danger"
    })
    if (confirmed) {
      setDeletingInsightId(insightId)
      deleteInsight(insightId)
    }
  }

  const handleToggleTask = async (taskId: string) => {
    setTogglingTaskId(taskId)
    try {
      console.log('🔄 Toggling task:', taskId)
      await toggleTask(taskId)
      console.log('✅ Task toggled successfully')
      
      // Refresh tasks in parent component - THIS IS CRITICAL
      if (onTaskUpdate) {
        console.log('🔄 Calling parent refresh...')
        await onTaskUpdate()
        console.log('✅ Parent refresh completed')
      }
      
      // Force a complete re-render of this component by updating a key
      setRefreshKey(prev => prev + 1)
      
      // Close task details modal if it's open for the toggled task
      if (selectedTask?.id === taskId) {
        setSelectedTask(null)
      }
      
    } catch (error) {
      console.error('❌ Failed to toggle task:', error)
      alert('Failed to update task. Please try again.')
    } finally {
      setTogglingTaskId(null)
    }
  }

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task)
  }

  const handleCloseTaskDetails = () => {
    setSelectedTask(null)
  }

  const getDuration = () => {
    if (!activity.endDate) return "Ongoing"
    const start = new Date(activity.startDate)
    const end = new Date(activity.endDate)
    const months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth())
    return `${months} months`
  }

  const getCategoryColor = () => {
    const colors: Record<string, string> = {
      sports: "from-blue-500 to-indigo-600",
      arts: "from-purple-500 to-pink-600",
      volunteer: "from-green-500 to-teal-600",
      leadership: "from-orange-500 to-red-600",
      academic: "from-indigo-500 to-purple-600",
      professional: "from-gray-600 to-gray-800",
      hobby: "from-yellow-500 to-orange-600"
    }
    return colors[activity.category] || "from-gray-500 to-gray-700"
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

  const getCategoryColorForTask = (category: string) => {
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
    <div key={refreshKey} className="space-y-6">{/* Add key prop for forced re-render */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors font-medium"
      >
        <ChevronLeft size={20} />
        <span>Back to Dashboard</span>
      </button>

      {/* Hero Section */}
      <div className={`bg-gradient-to-r ${getCategoryColor()} rounded-3xl p-8 text-white shadow-xl`}>
        <div className="flex items-start justify-between mb-6">
          <div>
            <p className="text-sm font-medium text-white/80 mb-1 capitalize">
              {activity.category} Activity
            </p>
            <h2 className="text-3xl font-bold mb-2">{activity.name}</h2>
            {activity.role && (
              <p className="text-lg text-white/90">{activity.role}</p>
            )}
          </div>
          <span className="px-4 py-2 bg-white/20 backdrop-blur-sm text-white text-sm rounded-full font-medium border border-white/30">
            {activity.endDate && new Date(activity.endDate) < new Date()
              ? "Completed"
              : "Active"}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-black/20 backdrop-blur-sm rounded-xl p-4 border border-white/20">
            <div className="flex items-center gap-3 mb-2">
              <Calendar size={20} />
              <span className="text-sm font-semibold">Duration</span>
            </div>
            <p className="text-lg">{getDuration()}</p>
          </div>
          <div className="bg-black/20 backdrop-blur-sm rounded-xl p-4 border border-white/20">
            <div className="flex items-center gap-3 mb-2">
              <Clock size={20} />
              <span className="text-sm font-semibold">Weekly Commitment</span>
            </div>
            <p className="text-lg">{activity.hoursPerWeek || 0} hours</p>
          </div>
          <div className="bg-black/20 backdrop-blur-sm rounded-xl p-4 border border-white/20">
            <div className="flex items-center gap-3 mb-2">
              <Briefcase size={20} />
              <span className="text-sm font-semibold">Start Date</span>
            </div>
            <p className="text-lg">{new Date(activity.startDate).toLocaleDateString()}</p>
          </div>
        </div>
      </div>

      {/* Engagement Level Tracker */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-slate-700">
        <div className="flex items-center gap-3 mb-4">
          <TrendingUp className="text-yellow-600 dark:text-yellow-400" size={24} />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Activity Engagement</h3>
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

      {/* Achievements Section */}
      {activity.achievements && activity.achievements.length > 0 && (
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-slate-700">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Key Achievements</h3>
          <ul className="space-y-2">
            {activity.achievements.map((achievement, index) => (
              <li key={index} className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-yellow-500 mt-2"></div>
                <span className="text-gray-700 dark:text-gray-300">{achievement}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Enhanced Related Tasks Section */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-slate-700">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Related Activity Tasks</h3>
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
                        
                        <span className={`text-xs px-2 py-0.5 rounded-full border ${getCategoryColorForTask(task.category)}`}>
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
          <p className="text-center text-gray-500 dark:text-gray-400 py-4">No related tasks found for this activity.</p>
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
                    <span className={`inline-block mt-1 px-2 py-1 rounded-full text-xs border ${getCategoryColorForTask(selectedTask.category)}`}>
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
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Activity Reflections</h3>
        </div>
        
        <div className="space-y-4">
          <div className="flex gap-3">
            <textarea
              value={currentInsight}
              onChange={(e) => setCurrentInsight(e.target.value)}
              placeholder="Share your experiences, growth, or impact from this activity..."
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
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">AI Activity Analysis</h3>
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
            <p className="text-sm text-gray-400 dark:text-gray-500">Click the button above to get insights about your activity impact and growth opportunities</p>
          </div>
        )}
      </div>

      {/* Activity Details Section */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-slate-700">
        {activity.description && (
          <div>
            <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Description</h3>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{activity.description}</p>
          </div>
        )}
      </div>
    </div>
  )
}