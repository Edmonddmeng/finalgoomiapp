"use client"
import { useState } from "react"
import type { User, Activity, Task } from "@/types"
import { ChevronLeft, Calendar, Clock, Briefcase, TrendingUp, BookOpen, Sparkles, Save } from "lucide-react"
import { useLocalStorage } from "@/hooks/useLocalStorage"

interface ActivityDetailsProps {
  user: User
  activity: Activity
  tasks: Task[]
  onBack: () => void
}

interface ActivityInsight {
  id: string
  activityId: string
  content: string
  timestamp: string
}

interface AIInsight {
  id: string
  activityId: string
  content: string
  timestamp: string
}

export function ActivityDetails({ user, activity, tasks, onBack }: ActivityDetailsProps) {
  const relatedTasks = tasks.filter((task) => 
    task.title.toLowerCase().includes(activity.name.toLowerCase()) ||
    task.category === activity.category
  )
  
  const completedTasks = relatedTasks.filter(task => task.completed).length
  const engagementLevel = relatedTasks.length > 0 
    ? Math.round((completedTasks / relatedTasks.length) * 100) 
    : 0

  const [personalInsights, setPersonalInsights] = useLocalStorage<ActivityInsight[]>(`insights-${activity.id}`, [])
  const [currentInsight, setCurrentInsight] = useState("")
  const [aiInsights, setAiInsights] = useLocalStorage<AIInsight[]>(`ai-insights-${activity.id}`, [])
  const [isGeneratingAI, setIsGeneratingAI] = useState(false)

  const handleSaveInsight = () => {
    if (currentInsight.trim()) {
      const newInsight: ActivityInsight = {
        id: Date.now().toString(),
        activityId: activity.id,
        content: currentInsight,
        timestamp: new Date().toISOString()
      }
      setPersonalInsights([...personalInsights, newInsight])
      setCurrentInsight("")
    }
  }

  const generateAIInsight = () => {
    setIsGeneratingAI(true)
    // Simulate AI generation
    setTimeout(() => {
      const insights = [
        `Based on your ${engagementLevel}% engagement rate, you're showing ${engagementLevel > 70 ? 'excellent' : engagementLevel > 40 ? 'good' : 'room for improvement in'} commitment to ${activity.name}. ${engagementLevel < 50 ? 'Consider setting more specific, achievable tasks to boost your involvement.' : 'Keep up the great work!'}`,
        `Your ${activity.hours} hours per week dedication to ${activity.name} demonstrates ${activity.hours > 10 ? 'significant' : activity.hours > 5 ? 'moderate' : 'light'} time investment. ${activity.hours < 5 ? 'Consider if you can allocate more time to maximize your learning.' : 'This level of commitment can lead to meaningful skill development.'}`,
        `Having started ${activity.name} on ${new Date(activity.startDate).toLocaleDateString()}, you've been engaged for ${Math.floor((Date.now() - new Date(activity.startDate).getTime()) / (1000 * 60 * 60 * 24 * 30))} months. This sustained involvement shows dedication to personal growth.`
      ]
      
      const newAIInsight: AIInsight = {
        id: Date.now().toString(),
        activityId: activity.id,
        content: insights[Math.floor(Math.random() * insights.length)],
        timestamp: new Date().toISOString()
      }
      setAiInsights([...aiInsights, newAIInsight])
      setIsGeneratingAI(false)
    }, 1500)
  }

  const getEngagementColor = (level: number) => {
    if (level >= 80) return "bg-green-500"
    if (level >= 60) return "bg-blue-500"
    if (level >= 40) return "bg-yellow-500"
    return "bg-red-500"
  }

  const getActivityColor = (category: string) => {
    const colors = {
      academic: "from-blue-500 to-indigo-600",
      extracurricular: "from-purple-500 to-pink-600",
      leadership: "from-amber-500 to-orange-600",
      volunteer: "from-green-500 to-teal-600",
      sports: "from-red-500 to-rose-600"
    }
    return colors[category as keyof typeof colors] || "from-gray-500 to-slate-600"
  }

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
      <div className={`bg-gradient-to-r ${getActivityColor(activity.category)} rounded-3xl p-8 text-white shadow-xl`}>
        <div className="flex items-start justify-between mb-6">
          <div>
            <p className="text-sm font-medium text-white/80 capitalize mb-1">{activity.category}</p>
            <h2 className="text-3xl font-bold mb-2">{activity.name}</h2>
            {activity.position && (
              <p className="text-white/90 flex items-center gap-2">
                <Briefcase size={16} />
                {activity.position}
              </p>
            )}
          </div>
          <span className="px-4 py-2 bg-white/20 backdrop-blur-sm text-white text-sm rounded-full font-medium">
            Activity
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <div className="flex items-center gap-3 mb-2">
              <Clock size={20} />
              <span className="text-lg font-semibold">{activity.hours} hours / week</span>
            </div>
            <p className="text-sm text-white/80">Time commitment</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <div className="flex items-center gap-3 mb-2">
              <Calendar size={20} />
              <span className="text-lg font-semibold">{new Date(activity.startDate).toLocaleDateString()}</span>
            </div>
            <p className="text-sm text-white/80">Started on</p>
          </div>
        </div>
      </div>

      {/* Engagement Level Tracker */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-slate-700">
        <div className="flex items-center gap-3 mb-4">
          <TrendingUp className="text-purple-600 dark:text-purple-400" size={24} />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Engagement Level</h3>
        </div>
        
        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600 dark:text-gray-300">Task Completion Rate</span>
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

      {/* Personal Insights Section */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-slate-700">
        <div className="flex items-center gap-3 mb-4">
          <BookOpen className="text-blue-600 dark:text-blue-400" size={24} />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Personal Insights</h3>
        </div>
        
        <div className="space-y-4">
          <div className="flex gap-3">
            <textarea
              value={currentInsight}
              onChange={(e) => setCurrentInsight(e.target.value)}
              placeholder="Record your thoughts, learnings, or reflections about this activity..."
              className="flex-1 p-3 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 resize-none"
              rows={3}
            />
            <button
              onClick={handleSaveInsight}
              disabled={!currentInsight.trim()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 dark:disabled:bg-gray-600 transition-colors flex items-center gap-2 h-fit"
            >
              <Save size={16} />
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
            <Sparkles className="text-purple-600 dark:text-purple-400" size={24} />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">AI Performance Insights</h3>
          </div>
          <button
            onClick={generateAIInsight}
            disabled={isGeneratingAI}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-300 dark:disabled:bg-gray-600 transition-colors flex items-center gap-2"
          >
            {isGeneratingAI ? (
              <>Generating...</>
            ) : (
              <>
                <Sparkles size={16} />
                Generate Insight
              </>
            )}
          </button>
        </div>
        
        {aiInsights.length > 0 ? (
          <div className="space-y-3">
            {aiInsights.map((insight) => (
              <div key={insight.id} className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                <p className="text-gray-800 dark:text-gray-200">{insight.content}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  Generated on {new Date(insight.timestamp).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400 mb-2">No AI insights generated yet</p>
            <p className="text-sm text-gray-400 dark:text-gray-500">Click the button above to get personalized insights about your activity performance</p>
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
          <p className="text-center text-gray-500 dark:text-gray-400 py-4">No tasks related to this activity.</p>
        )}
      </div>
    </div>
  )
}