
"use client"

import { useState, useCallback, useEffect } from "react"
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
import { 
  calculateStreak, 
  getStreakMessage, 
  getStreakColor, 
  updateUserStreak,
  type StreakUpdateResult 
} from "@/components/Utils/streakCalculator"
import { apiClient } from "@/lib/apiClient"

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
  const [streakData, setStreakData] = useState<StreakUpdateResult | null>(null)
  const [isUpdatingStreak, setIsUpdatingStreak] = useState(false)

  // Fetch the selected competition data (only if we have an ID)
  const { 
    data: selectedCompetitionData, 
    isLoading: competitionLoading,
    refetch: refetchSelectedCompetition 
  } = useCompetition(selectedCompetitionId || '')

  // 🔧 NEW: Fetch and update streak using dedicated API
  useEffect(() => {
    if (user && !isUpdatingStreak) {
      const fetchAndUpdateStreak = async () => {
        try {
          setIsUpdatingStreak(true)
          
          const token = localStorage.getItem("goomi_token") || localStorage.getItem("authToken") || localStorage.getItem("token")
          
          if (!token) {
            console.warn('⚠️ No authentication token found')
            return
          }

          console.log('🔄 Fetching current streak data from API...')
          
          // Step 1: Fetch current streak data from dedicated API
          const streakResponse = await apiClient.get('/users/streak')
          
          if (streakResponse.status !== 200) {
            throw new Error(`Failed to fetch streak data: ${streakResponse.status}`)
          }

          const currentStreakApiData = streakResponse.data
          console.log('✅ Current streak data from API:', currentStreakApiData)

          // Step 2: Convert API response to format expected by calculateStreak
          const currentStreakData = {
            current_streak: currentStreakApiData.current_streak || 0,
            streak_date: currentStreakApiData.streak_date || '',
            streak_high: currentStreakApiData.streak_high || 0
          }

          console.log('🔍 Mapped currentStreakData:', currentStreakData)

          // Step 3: Calculate new streak
          const streakResult = calculateStreak(currentStreakData)
          console.log('📈 Calculated streakResult:', streakResult)
          
          setStreakData(streakResult)

          // Step 4: Update streak in database if changed
          if (streakResult.current_streak !== currentStreakData.current_streak || 
              streakResult.streak_date !== currentStreakData.streak_date) {
            
            console.log('💾 Streak changed - updating database...', {
              old: currentStreakData,
              new: streakResult
            })
            
            await updateUserStreak(token, currentStreakData)
            console.log('✅ Streak updated successfully!')
          } else {
            console.log('🔄 No streak changes detected - skipping update')
          }

        } catch (error) {
          console.error('❌ Failed to fetch/update streak:', error)
          
          // Fallback: Try to use user object data if API fails
          console.log('🔄 Falling back to user object data...')
          const fallbackStreakData = {
            current_streak: user.currentStreak ?? 0,
            streak_date: user.streakDate ?? '',
            streak_high: user.streakHigh ?? 0
          }
          
          if (fallbackStreakData.current_streak > 0 || fallbackStreakData.streak_date) {
            const fallbackResult = calculateStreak(fallbackStreakData)
            setStreakData(fallbackResult)
            console.log('⚠️ Using fallback streak data:', fallbackResult)
          }
        } finally {
          setIsUpdatingStreak(false)
        }
      }

      fetchAndUpdateStreak()
    }
  }, [user?.id])

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

  // Get current streak value from calculated streak data
  const currentStreak = streakData?.current_streak ?? 0
  const streakMessage = streakData ? getStreakMessage(streakData) : { message: "Keep up the amazing work!", emoji: "🔥" }
  const streakColorClasses = getStreakColor(currentStreak)

  return (
    <div className="space-y-8">
      {/* Hero Section with Quote and Streak */}
      <div className={`relative p-8 rounded-3xl bg-gradient-to-br ${streakColorClasses} text-white overflow-hidden`}>
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10">
          <h1 className="text-3xl font-bold mb-4">
            Welcome back, {user.username.split(' ')[0]}!
          </h1>
          
          {/* Inspiring Quote */}
          <div className="mb-6">
            <p className="text-lg italic opacity-90">"{todaysQuote}"</p>
          </div>
          
          {/* Enhanced Streak Display */}
          <div className="space-y-4">
            {/* Main Streak Stats */}
            <div className="flex items-center gap-4">
              {/* Current Streak */}
              <div className="flex items-center gap-3 bg-white/20 backdrop-blur-sm rounded-2xl px-6 py-3 border border-white/20">
                <div className="flex items-center justify-center w-12 h-12 bg-white/20 rounded-full">
                  <span className="text-2xl">{streakMessage.emoji}</span>
                </div>
                <div className="text-left">
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold">{currentStreak}</span>
                    <span className="text-sm font-medium opacity-90">days</span>
                  </div>
                  <p className="text-xs opacity-75">Current Streak</p>
                </div>
              </div>

              {/* Best Streak - Only show if there's a record */}
              {streakData && streakData.streak_high > 0 && (
                <div className="flex items-center gap-3 bg-white/15 backdrop-blur-sm rounded-2xl px-6 py-3 border border-white/10">
                  <div className="flex items-center justify-center w-12 h-12 bg-amber-400/20 rounded-full">
                    <span className="text-2xl">🏆</span>
                  </div>
                  <div className="text-left">
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-bold text-amber-100">{streakData.streak_high}</span>
                      <span className="text-sm font-medium opacity-75">days</span>
                    </div>
                    <p className="text-xs opacity-75">Personal Best</p>
                  </div>
                  {/* New Record Badge */}
                  {streakData.isNewRecord && (
                    <div className="ml-2 px-2 py-1 bg-amber-400/30 rounded-full">
                      <span className="text-xs font-semibold text-amber-100">NEW!</span>
                    </div>
                  )}
                </div>
              )}

              {/* Loading State */}
              {isUpdatingStreak && (
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                  <Loader2 className="animate-spin h-4 w-4" />
                  <span className="text-sm">Updating...</span>
                </div>
              )}
            </div>
            
            {/* Streak Message */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3 border border-white/10">
              <p className="text-sm opacity-90 font-medium">
                {streakMessage.message}
              </p>
            </div>
            
            {/* Progress & Milestones */}
            {currentStreak > 0 && (
              <div className="bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3 border border-white/10">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium opacity-90">Progress to Next Milestone</span>
                  <span className="text-xs opacity-75">
                    {currentStreak < 7 ? `${7 - currentStreak} days to 1 week` :
                     currentStreak < 30 ? `${30 - currentStreak} days to 1 month` :
                     currentStreak < 100 ? `${100 - currentStreak} days to 100 days` :
                     "Streak Master! 🏆"}
                  </span>
                </div>
                
                {/* Progress Bar */}
                {currentStreak < 100 && (
                  <div className="w-full bg-white/20 rounded-full h-2">
                    <div 
                      className="bg-white/60 h-2 rounded-full transition-all duration-500 ease-out"
                      style={{ 
                        width: `${currentStreak < 7 ? (currentStreak / 7) * 100 :
                                 currentStreak < 30 ? (currentStreak / 30) * 100 :
                                 (currentStreak / 100) * 100}%` 
                      }}
                    ></div>
                  </div>
                )}

                {/* Achievement Badges */}
                <div className="flex items-center gap-2 mt-3">
                  <span className="text-xs opacity-75">Achievements:</span>
                  <div className="flex gap-1">
                    {/* Week Badge */}
                    <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs ${
                      currentStreak >= 7 ? 'bg-green-400/30 text-green-100' : 'bg-white/20 text-white/50'
                    }`}>
                      <span>🗓️</span>
                      <span>Week</span>
                    </div>
                    
                    {/* Month Badge */}
                    <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs ${
                      currentStreak >= 30 ? 'bg-blue-400/30 text-blue-100' : 'bg-white/20 text-white/50'
                    }`}>
                      <span>📅</span>
                      <span>Month</span>
                    </div>
                    
                    {/* Century Badge */}
                    <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs ${
                      currentStreak >= 100 ? 'bg-purple-400/30 text-purple-100' : 'bg-white/20 text-white/50'
                    }`}>
                      <span>💯</span>
                      <span>Century</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Stats Cards - 2x2 Grid */}
      <StatsCards
        stats={stats}
        user={user}
        onDetailClick={setSelectedDetail}
        onCompetitionSelect={handleCompetitionSelect}
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