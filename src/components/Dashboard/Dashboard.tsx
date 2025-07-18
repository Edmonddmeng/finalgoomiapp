
"use client"

import { useState, useCallback } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { useDashboardStats } from "@/hooks/useUser"
import { useTasks } from "@/hooks/useTasks"
import { useCompetition } from "@/hooks/useCompetitions"
import { StatsCards } from "./StatsCards"
import { AcademicDetails } from "./AcademicDetails"
import { CompetitionDetails } from "./CompetitionDetails"
import { ActivityDetails } from "./ActivityDetails"
import { CompetitionsList } from "./CompetitionsList"
import { ActivitiesList } from "./ActivitiesList"
import { RecentComments } from "./RecentComments"
import { Loader2 } from "lucide-react"

type DetailView = "academic" | "competition" | "activity" | null

export function Dashboard() {
  const { user, isLoading: userLoading } = useAuth()

  const { data: stats, isLoading: statsLoading } = useDashboardStats()
  const { 
    data: tasksData, 
    isLoading: tasksLoading, 
    refetch: refetchTasks 
  } = useTasks({ status: 'all' })
  
  const [selectedDetail, setSelectedDetail] = useState<DetailView>(null)
  const [selectedCompetitionId, setSelectedCompetitionId] = useState<string | null>(null)
  const [selectedActivity, setSelectedActivity] = useState<any>(null)

  // Fetch the selected competition data (only if we have an ID)
  const { 
    data: selectedCompetitionData, 
    isLoading: competitionLoading,
    refetch: refetchSelectedCompetition 
  } = useCompetition(selectedCompetitionId || '')

  const isLoading = userLoading || statsLoading || tasksLoading

  // Enhanced task update handler
  const handleTaskUpdate = useCallback(async () => {
    console.log('🔄 Dashboard: Task update requested, refreshing tasks...')
    try {
      await refetchTasks()
      console.log('✅ Dashboard: Tasks refreshed successfully')
    } catch (error) {
      console.error('❌ Dashboard: Failed to refresh tasks:', error)
    }
  }, [refetchTasks])

  // Competition update handler
  const handleCompetitionUpdate = useCallback(async () => {
    console.log('🔄 Dashboard: Competition update requested, refreshing competition...')
    try {
      await refetchSelectedCompetition()
      console.log('✅ Dashboard: Competition refreshed successfully')
    } catch (error) {
      console.error('❌ Dashboard: Failed to refresh competition:', error)
    }
  }, [refetchSelectedCompetition])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-3">
          <Loader2 className="animate-spin h-12 w-12 text-purple-600 mx-auto" />
          <p className="text-gray-500 dark:text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  console.log("user details are: ", localStorage.getItem("goomi_user"));
  console.log("user details are updated: ", user);
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        {typeof window !== "undefined" && (window.location.href = "/login")}
      </div>
    )
  }

  const tasks = tasksData || []

  const handleBackFromDetail = () => {
    setSelectedDetail(null)
    setSelectedCompetitionId(null)
    setSelectedActivity(null)
  }

  // Handle competition selection - now stores ID instead of object
  const handleCompetitionSelect = (competition: any) => {
    setSelectedCompetitionId(competition.id)
  }

  if (selectedDetail === "competition") {
    if (selectedCompetitionId) {
      // Show loading state while competition is being fetched
      if (competitionLoading) {
        return (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center space-y-3">
              <Loader2 className="animate-spin h-12 w-12 text-purple-600 mx-auto" />
              <p className="text-gray-500 dark:text-gray-400">Loading competition...</p>
            </div>
          </div>
        )
      }

    // Show error state if competition couldn't be loaded or is incomplete
    if (!selectedCompetitionData || !selectedCompetitionData.id || !selectedCompetitionData.name) {
      return (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center space-y-3">
            <p className="text-gray-500 dark:text-gray-400">Competition not found or failed to load</p>
            <button
              onClick={handleBackFromDetail}
              className="text-sm text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300"
            >
              ← Back to Competitions
            </button>
          </div>
        </div>
      )
    }

      return (
        <CompetitionDetails
          competition={selectedCompetitionData}
          tasks={tasks}
          onBack={handleBackFromDetail}
          onTaskUpdate={handleTaskUpdate}
          onCompetitionUpdate={handleCompetitionUpdate}
        />
      )
    }
    return (
      <CompetitionsList 
        onBack={handleBackFromDetail}
        onSelectCompetition={handleCompetitionSelect}
      />
    )
  }

  if (selectedDetail === "activity") {
    if (selectedActivity) {
      return (
        <ActivityDetails
          activity={selectedActivity}
          tasks={tasks}
          onBack={handleBackFromDetail}
          onTaskUpdate={handleTaskUpdate}
        />
      )
    }
    return (
      <ActivitiesList 
        onBack={handleBackFromDetail}
        onSelectActivity={setSelectedActivity}
      />
    )
  }

  if (selectedDetail === "academic") {
    return <AcademicDetails onBack={handleBackFromDetail} />
  }

  // Array of inspiring quotes
  const inspiringQuotes = [
    "Success is not final, failure is not fatal: it is the courage to continue that counts.",
    "The future belongs to those who believe in the beauty of their dreams.",
    "Education is the most powerful weapon which you can use to change the world.",
    "The only way to do great work is to love what you do.",
    "Believe you can and you're halfway there.",
    "Your limitation—it's only your imagination.",
    "Great things never come from comfort zones.",
    "Dream it. Wish it. Do it."
  ]
  
  // Select a quote based on the current day
  const quoteIndex = new Date().getDate() % inspiringQuotes.length
  const todaysQuote = inspiringQuotes[quoteIndex]

  return (
    <div className="space-y-8">
      {/* Hero Section with Quote and Streak */}
      <div className="relative p-8 rounded-3xl bg-gradient-to-br from-orange-500 to-amber-600 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10">
          <h1 className="text-3xl font-bold mb-4">
            Welcome back, {user.username.split(' ')[0]}!
          </h1>
          
          {/* Inspiring Quote */}
          <div className="mb-6">
            <p className="text-lg italic opacity-90">"{todaysQuote}"</p>
          </div>
          
          {/* Streak Display */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
              <span className="text-2xl">🔥</span>
              <span className="font-semibold">{user.currentStreak || 0} Day Streak!</span>
            </div>
            <p className="text-sm opacity-75 ml-2">Keep up the amazing work!</p>
          </div>
        </div>
      </div>

      {/* Stats Cards - 2x2 Grid */}
      <StatsCards
        stats={stats}
        user={user}
        onDetailClick={setSelectedDetail}
        onCompetitionSelect={handleCompetitionSelect} // Updated to use the new handler
        onActivitySelect={setSelectedActivity}
      />

      {/* Section Headers for Details - Original Ordering */}
      <div className="space-y-6">
        {/* Academic Details */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Academic Details</h2>
            <button
              onClick={() => setSelectedDetail("academic")}
              className="text-sm text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300"
            >
              View All →
            </button>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Track your academic progress and course performance
          </p>
        </div>

        {/* Activities */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Activities</h2>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  // For now, go to activity details where we can add the create functionality
                  setSelectedDetail("activity")
                }}
                className="text-sm bg-orange-600 text-white px-3 py-1 rounded-lg hover:bg-orange-700 transition-colors"
              >
                + Add Activity
              </button>
              <button
                onClick={() => setSelectedDetail("activity")}
                className="text-sm text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300"
              >
                View All →
              </button>
            </div>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Your extracurricular activities and community involvement
          </p>
        </div>

        {/* Competitions */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Competitions</h2>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  // For now, go to competition details where we can add the create functionality
                  setSelectedDetail("competition")
                }}
                className="text-sm bg-purple-600 text-white px-3 py-1 rounded-lg hover:bg-purple-700 transition-colors"
              >
                + Add Competition
              </button>
              <button
                onClick={() => setSelectedDetail("competition")}
                className="text-sm text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300"
              >
                View All →
              </button>
            </div>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Academic competitions and achievements
          </p>
        </div>
      </div>

      <RecentComments comments={[]} />
    </div>
  )
}