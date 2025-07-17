
"use client"
import { Award, BookOpen, Users, Trophy, TrendingUp, Target, Pencil, Check, X, Loader2 } from "lucide-react"
import { User, DashboardStats, Competition, Activity } from "@/types"
import { useState, useEffect } from "react"
import axios from "axios"
import { useOverallGPA } from "@/hooks/useAcademics"
import { userService } from "@/services/userService"
import { useApiQuery } from "@/hooks/useApiQuery"
// Removed invalid import of getDashboardStats

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
  
  // Fetch overall GPA data from API
  const { data: overallGPAData, isLoading: overallGPALoading, refetch: refetchOverallGPA } = useOverallGPA()
  const { data: dashboardStats, isLoading: dashboardStatsLoading, refetch: refetchDashboardStats } = useApiQuery(
    () => userService.getDashboardStats(),
    ['dashboard-stats']
  )
  
  // Use API data if available, otherwise fallback to user/stats data
  const currentGPA = overallGPAData?.overallGPA || stats?.currentGPA || user.stats?.overallGPA || 0
  const satScore = overallGPAData?.satScore || user?.sat_score || null
  const actScore = overallGPAData?.actScore || user?.act_score || null
  const currentStreak = stats?.currentStreak || user.currentStreak || 0
  const totalCompetitions = user.stats?.totalCompetitions || 0
  const totalActivities = user.stats?.totalActivities || 0

  const [isEditingScores, setIsEditingScores] = useState(false)
  const [editSatScore, setEditSatScore] = useState("")
  const [editActScore, setEditActScore] = useState("")
  const [loading, setLoading] = useState(false)

  // Initialize edit values when data loads or changes
  useEffect(() => {
    setEditSatScore(satScore?.toString() || "")
    setEditActScore(actScore?.toString() || "")
  }, [satScore, actScore])

  const handleSaveScores = async () => {
    try {
      setLoading(true)
      
      // Parse scores, use null for empty strings
      const parsedSatScore = editSatScore.trim() ? parseInt(editSatScore) : null
      const parsedActScore = editActScore.trim() ? parseInt(editActScore) : null

      // Validate scores
      if (parsedSatScore !== null && (parsedSatScore < 400 || parsedSatScore > 1600)) {
        alert("SAT score must be between 400 and 1600")
        return
      }

      if (parsedActScore !== null && (parsedActScore < 1 || parsedActScore > 36)) {
        alert("ACT score must be between 1 and 36")
        return
      }

      await axios.post(`https://goomi-community-backend.onrender.com/api/users/test-scores`, {
        sat_score: parsedSatScore,
        act_score: parsedActScore
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`
        }
      })

      console.log("Scores updated successfully")
      setIsEditingScores(false)
      
      // Refetch the overall GPA data to get updated scores
      await refetchOverallGPA()
      
    } catch (error) {
      console.error("Failed to update scores:", error)
      alert("Failed to update scores. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleCancelEdit = () => {
    setIsEditingScores(false)
    // Reset to original values
    setEditSatScore(satScore?.toString() || "")
    setEditActScore(actScore?.toString() || "")
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Academic Performance Card */}
      <div 
        className="relative p-6 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 text-white overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
        onClick={() => onDetailClick("academic")}
      >
        <BookOpen className="absolute -right-4 -bottom-4 text-white/20" size={64} />
        <div className="relative z-10">
          <p className="text-sm text-white/80">Overall GPA</p>
          {overallGPALoading ? (
            <div className="flex items-center gap-2 mt-2">
              <Loader2 className="animate-spin" size={20} />
              <span className="text-xl font-bold">Loading...</span>
            </div>
          ) : (
            <p className="text-3xl font-bold mt-2">{currentGPA.toFixed(2)}</p>
          )}
          <p className="text-xs text-white/70 mt-1">
            {overallGPAData?.totalCourses ? `${overallGPAData.totalCourses} courses` : "Click for details"}
          </p>
        </div>
      </div>

      {/* Test Scores Editable Card */}
      <div className="relative p-6 rounded-2xl bg-gradient-to-br from-green-500 to-green-600 text-white overflow-hidden">
        <Target className="absolute -right-4 -bottom-4 text-white/20" size={64} />
        <div className="relative z-10 space-y-2">
          <div className="flex justify-between items-center">
            <p className="text-sm text-white/80">Test Scores</p>
            {!isEditingScores ? (
              <button 
                onClick={() => setIsEditingScores(true)}
                className="hover:bg-white/20 rounded-full p-1 transition-colors"
                disabled={overallGPALoading}
              >
                <Pencil size={18} />
              </button>
            ) : (
              <div className="flex gap-2">
                <button 
                  disabled={loading}
                  onClick={handleSaveScores}
                  className="hover:bg-white/20 rounded-full p-1 transition-colors disabled:opacity-50"
                >
                  {loading ? <Loader2 className="animate-spin" size={18} /> : <Check size={18} />}
                </button>
                <button 
                  disabled={loading}
                  onClick={handleCancelEdit}
                  className="hover:bg-white/20 rounded-full p-1 transition-colors disabled:opacity-50"
                >
                  <X size={18} />
                </button>
              </div>
            )}
          </div>
          
          {overallGPALoading ? (
            <div className="flex items-center gap-2">
              <Loader2 className="animate-spin" size={16} />
              <span className="text-sm">Loading scores...</span>
            </div>
          ) : !isEditingScores ? (
            <div className="flex items-baseline gap-4">
              <div>
                <span className="text-xs text-white/70">SAT: </span>
                <span className="text-2xl font-bold">{satScore || 'N/A'}</span>
              </div>
              <div>
                <span className="text-xs text-white/70">ACT: </span>
                <span className="text-2xl font-bold">{actScore || 'N/A'}</span>
              </div>
            </div>
          ) : (
            <div className="flex gap-4">
              <div>
                <label className="text-xs text-white/70 block">SAT</label>
                <input
                  type="number"
                  value={editSatScore}
                  onChange={(e) => setEditSatScore(e.target.value)}
                  placeholder="400-1600"
                  min="400"
                  max="1600"
                  className="mt-1 w-24 px-2 py-1 rounded bg-white text-black text-sm"
                />
              </div>
              <div>
                <label className="text-xs text-white/70 block">ACT</label>
                <input
                  type="number"
                  value={editActScore}
                  onChange={(e) => setEditActScore(e.target.value)}
                  placeholder="1-36"
                  min="1"
                  max="36"
                  className="mt-1 w-20 px-2 py-1 rounded bg-white text-black text-sm"
                />
              </div>
            </div>
          )}
          <p className="text-xs text-white/70">
            {overallGPAData?.lastUpdated 
              ? `Updated ${new Date(overallGPAData.lastUpdated).toLocaleDateString()}`
              : "Standardized test scores"
            }
          </p>
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
          <p className="text-3xl font-bold mt-2">{dashboardStats?.totalCompetitions}</p>
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
          <p className="text-3xl font-bold mt-2">{dashboardStats?.totalActivities}</p>
          <p className="text-xs text-white/70 mt-1">Active engagements</p>
        </div>
      </div>
    </div>
  )
}