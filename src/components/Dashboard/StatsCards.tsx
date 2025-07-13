"use client"
import { Award, BookOpen, Users, Trophy, TrendingUp, Target, Pencil, Check, X } from "lucide-react"
import { User, DashboardStats, Competition, Activity } from "@/types"
import { use, useState } from "react"
import axios from "axios"

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

  const [isEditingScores, setIsEditingScores] = useState(false)
  const [satScore, setSatScore] = useState(user?.stats?.satScore || "")
  const [actScore, setActScore] = useState(user?.stats?.actScore || "")
  const [loading, setLoading] = useState(false)


  const handleSaveScores = async () => {
    try {
      setLoading(true)
      await axios.post(`https://goomi-community-backend.onrender.com/api/users/test-scores`, {
        sat_score: parseInt(String(satScore)),
        act_score: parseInt(String(actScore))
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`
        }
      })
      console.log("Scores updated successfully", user)
      setIsEditingScores(false)
    } catch (error) {
      console.error("Failed to update scores:", error)
    } finally {
      setLoading(false)
    }
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
          <p className="text-sm text-white/80">Current GPA</p>
          <p className="text-3xl font-bold mt-2">{currentGPA.toFixed(2)}</p>
          <p className="text-xs text-white/70 mt-1">Click for details</p>
        </div>
      </div>

{/* Test Scores Editable Card */}
      <div className="relative p-6 rounded-2xl bg-gradient-to-br from-green-500 to-green-600 text-white overflow-hidden">
        <Target className="absolute -right-4 -bottom-4 text-white/20" size={64} />
        <div className="relative z-10 space-y-2">
          <div className="flex justify-between items-center">
            <p className="text-sm text-white/80">Test Scores</p>
            {!isEditingScores ? (
              <button onClick={() => setIsEditingScores(true)}><Pencil size={18} /></button>
            ) : (
              <div className="flex gap-2">
                <button disabled={loading} onClick={handleSaveScores}><Check size={18} /></button>
                <button disabled={loading} onClick={() => setIsEditingScores(false)}><X size={18} /></button>
              </div>
            )}
          </div>
          {!isEditingScores ? (
            <div className="flex items-baseline gap-4">
              <div>
                <span className="text-xs text-white/70">SAT: </span>
                <span className="text-2xl font-bold">{user?.sat_score ?? 'N/A'}</span>
              </div>
              <div>
                <span className="text-xs text-white/70">ACT: </span>
                <span className="text-2xl font-bold">{user?.act_score ?? 'N/A'}</span>
              </div>
            </div>
          ) : (
            <div className="flex gap-4">
              <div>
                <label className="text-xs text-white/70">SAT</label>
                <input
                  type="number"
                  value={satScore}
                  onChange={(e) => setSatScore(e.target.value)}
                  className="mt-1 w-20 px-2 py-1 rounded bg-white text-black"
                />
              </div>
              <div>
                <label className="text-xs text-white/70">ACT</label>
                <input
                  type="number"
                  value={actScore}
                  onChange={(e) => setActScore(e.target.value)}
                  className="mt-1 w-20 px-2 py-1 rounded bg-white text-black"
                />
              </div>
            </div>
          )}
          <p className="text-xs text-white/70">Standardized test scores</p>
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