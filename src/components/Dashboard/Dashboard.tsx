"use client"

import { useState } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { useDashboardStats } from "@/hooks/useUser"
import { useTasks } from "@/hooks/useTasks"
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
  const { data: tasksData, isLoading: tasksLoading } = useTasks({ status: 'all' })
  const [selectedDetail, setSelectedDetail] = useState<DetailView>(null)
  const [selectedCompetition, setSelectedCompetition] = useState<any>(null)
  const [selectedActivity, setSelectedActivity] = useState<any>(null)

  const isLoading = userLoading || statsLoading || tasksLoading

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

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-gray-500 dark:text-gray-400">Please log in to view your dashboard</p>
      </div>
    )
  }

  const tasks = tasksData?.items || []

  const handleBackFromDetail = () => {
    setSelectedDetail(null)
    setSelectedCompetition(null)
    setSelectedActivity(null)
  }

  if (selectedDetail === "competition") {
    if (selectedCompetition) {
      return (
        <CompetitionDetails
          competition={selectedCompetition}
          tasks={tasks}
          onBack={handleBackFromDetail}
        />
      )
    }
    return (
      <CompetitionsList 
        onBack={handleBackFromDetail}
        onSelectCompetition={setSelectedCompetition}
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
            Welcome back, {user.name.split(' ')[0]}!
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
        onCompetitionSelect={setSelectedCompetition}
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