"use client"
import { Award, BookOpen, Users, Trophy, TrendingUp, Target } from "lucide-react"
import { User, DashboardStats, Competition, Activity } from "@/types"

interface StatsCardsProps {
  user: User
  stats?: DashboardStats
  onDetailClick: (type: "academic" | "competition" | "activity") => void
  onCompetitionSelect?: (competition: Competition) => void
  onActivitySelect?: (activity: Activity) => void
}

export function StatsCards({ 
  user, 
  stats, 
  onDetailClick,
  onCompetitionSelect,
  onActivitySelect 
}: StatsCardsProps) {
  
  // Use stats from API if available, otherwise fallback to user data
  const currentGPA = stats?.currentGPA || user.stats?.averageGPA || 0
  const currentStreak = stats?.currentStreak || user.currentStreak || 0
  const totalCompetitions = user.stats?.totalCompetitions || 0
  const totalActivities = user.stats?.totalActivities || 0

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Academic Performance Card */}
      <div 
        className="relative p-6 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 text-white overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
        onClick={() => onDetailClick("academic")}
      >
        <BookOpen className="absolute -right-4 -bottom-4 text-white/20" size={64} />
        <div className="relative z-10">
          <p className="text-sm text-white/80">Current GPA</p>
          <p className="text-3xl font-bold mt-2">{currentGPA.toFixed(2)}</p>
          <p className="text-xs text-white/70 mt-1">Click for details</p>
        </div>
      </div>

      {/* Test Scores Card */}
      <div className="relative p-6 rounded-2xl bg-gradient-to-br from-green-500 to-green-600 text-white overflow-hidden">
        <Target className="absolute -right-4 -bottom-4 text-white/20" size={64} />
        <div className="relative z-10">
          <p className="text-sm text-white/80">Test Scores</p>
          <div className="flex items-baseline gap-3 mt-2">
            <div>
              <span className="text-xs text-white/70">SAT: </span>
              <span className="text-2xl font-bold">{user.stats?.satScore || 'N/A'}</span>
            </div>
            <div>
              <span className="text-xs text-white/70">ACT: </span>
              <span className="text-2xl font-bold">{user.stats?.actScore || 'N/A'}</span>
            </div>
          </div>
          <p className="text-xs text-white/70 mt-1">Standardized test scores</p>
        </div>
      </div>

      {/* Competitions Card */}
      <div 
        className="relative p-6 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 text-white overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
        onClick={() => onDetailClick("competition")}
      >
        <Trophy className="absolute -right-4 -bottom-4 text-white/20" size={64} />
        <div className="relative z-10">
          <p className="text-sm text-white/80">Competitions</p>
          <p className="text-3xl font-bold mt-2">{totalCompetitions}</p>
          <p className="text-xs text-white/70 mt-1">Total participated</p>
        </div>
      </div>

      {/* Activities Card */}
      <div 
        className="relative p-6 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 text-white overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
        onClick={() => onDetailClick("activity")}
      >
        <Users className="absolute -right-4 -bottom-4 text-white/20" size={64} />
        <div className="relative z-10">
          <p className="text-sm text-white/80">Activities</p>
          <p className="text-3xl font-bold mt-2">{totalActivities}</p>
          <p className="text-xs text-white/70 mt-1">Active engagements</p>
        </div>
      </div>
    </div>
  )
}