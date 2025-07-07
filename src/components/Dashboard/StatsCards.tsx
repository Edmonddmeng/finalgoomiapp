"use client"
import { useState } from "react"
import type { User } from "@/types"
import { Award, BookOpen, Users, Trophy, Edit3, Check, X } from "lucide-react"

interface StatsCardsProps {
  user: User
  setUser: (user: User | ((prev: User) => User)) => void
}

export function StatsCards({ user, setUser }: StatsCardsProps) {
  const [editingStat, setEditingStat] = useState<string | null>(null)
  const [gpaValue, setGpaValue] = useState("")
  const [satValue, setSatValue] = useState("")
  const [actValue, setActValue] = useState("")

  const handleEditClick = (stat: string) => {
    setEditingStat(stat)
    if (stat === "gpa") {
      setGpaValue(user.gpa.toString())
    }
    if (stat === "tests") {
      setSatValue(user.standardizedScores?.sat?.toString() || "")
      setActValue(user.standardizedScores?.act?.toString() || "")
    }
  }

  const handleCancel = () => {
    setEditingStat(null)
  }

  const handleSave = () => {
    if (!editingStat) return

    setUser((prevUser) => {
      const updatedUser = { ...prevUser }

      if (editingStat === "gpa") {
        const newGpa = Number.parseFloat(gpaValue)
        if (!isNaN(newGpa)) {
          updatedUser.gpa = newGpa
        }
      }

      if (editingStat === "tests") {
        const newSat = Number.parseInt(satValue)
        const newAct = Number.parseInt(actValue)
        updatedUser.standardizedScores = {
          ...prevUser.standardizedScores,
          sat: isNaN(newSat) ? prevUser.standardizedScores.sat : newSat,
          act: isNaN(newAct) ? prevUser.standardizedScores.act : newAct,
        }
      }
      return updatedUser
    })

    setEditingStat(null)
  }

  const activitiesCount = user.activities.length
  const achievementsCount = user.achievements.length

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Standardized Tests Card */}
      <div className="relative p-4 rounded-2xl bg-blue-500 text-white overflow-hidden">
        <BookOpen className="absolute -right-2 -bottom-2 text-white/20" size={64} />
        <div className="relative z-10">
          <div className="flex items-start justify-between">
            <p className="text-sm text-white/80">Standardized Tests</p>
            {editingStat !== "tests" && (
              <button
                onClick={() => handleEditClick("tests")}
                className="p-1.5 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
              >
                <Edit3 size={14} className="text-white" />
              </button>
            )}
          </div>

          {editingStat === "tests" ? (
            <div className="mt-2 space-y-2">
              <div className="flex items-center gap-2">
                <label htmlFor="sat" className="text-xs font-medium w-8">
                  SAT
                </label>
                <input
                  id="sat"
                  type="number"
                  value={satValue}
                  onChange={(e) => setSatValue(e.target.value)}
                  className="w-full bg-transparent text-xl font-bold text-white border-b-2 border-white/50 focus:outline-none"
                  autoFocus
                />
              </div>
              <div className="flex items-center gap-2">
                <label htmlFor="act" className="text-xs font-medium w-8">
                  ACT
                </label>
                <input
                  id="act"
                  type="number"
                  value={actValue}
                  onChange={(e) => setActValue(e.target.value)}
                  className="w-full bg-transparent text-xl font-bold text-white border-b-2 border-white/50 focus:outline-none"
                />
              </div>
              <div className="flex justify-end gap-2 mt-2">
                <button onClick={handleSave} className="p-1 bg-white/20 rounded-full">
                  <Check size={16} className="text-white" />
                </button>
                <button onClick={handleCancel} className="p-1 bg-white/20 rounded-full">
                  <X size={16} className="text-white" />
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-end gap-6 mt-2">
              <div>
                <p className="text-xs text-white/70 font-medium">SAT</p>
                <p className="text-2xl font-bold">{user.standardizedScores?.sat || "N/A"}</p>
              </div>
              <div>
                <p className="text-xs text-white/70 font-medium">ACT</p>
                <p className="text-2xl font-bold">{user.standardizedScores?.act || "N/A"}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* GPA Card */}
      <div className="relative p-4 rounded-2xl bg-green-500 text-white overflow-hidden">
        <Award className="absolute -right-2 -bottom-2 text-white/20" size={64} />
        <div className="relative z-10">
          <div className="flex items-start justify-between">
            <p className="text-sm text-white/80">Current GPA</p>
            {editingStat !== "gpa" && (
              <button
                onClick={() => handleEditClick("gpa")}
                className="p-1.5 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
              >
                <Edit3 size={14} className="text-white" />
              </button>
            )}
          </div>
          {editingStat === "gpa" ? (
            <div className="flex items-center gap-2 mt-2">
              <input
                type="number"
                step="0.01"
                value={gpaValue}
                onChange={(e) => setGpaValue(e.target.value)}
                className="w-full bg-transparent text-3xl font-bold text-white border-b-2 border-white/50 focus:outline-none"
                autoFocus
              />
              <div className="flex gap-2">
                <button onClick={handleSave} className="p-1 bg-white/20 rounded-full">
                  <Check size={16} className="text-white" />
                </button>
                <button onClick={handleCancel} className="p-1 bg-white/20 rounded-full">
                  <X size={16} className="text-white" />
                </button>
              </div>
            </div>
          ) : (
            <p className="text-3xl font-bold mt-2">{user.gpa.toFixed(2)}</p>
          )}
        </div>
      </div>

      {/* Activities Card */}
      <div className="relative p-4 rounded-2xl bg-purple-500 text-white overflow-hidden">
        <Users className="absolute -right-2 -bottom-2 text-white/20" size={64} />
        <div className="relative z-10">
          <p className="text-sm text-white/80">Total Activities</p>
          <p className="text-3xl font-bold mt-2">{activitiesCount}</p>
        </div>
      </div>

      {/* Achievements Card */}
      <div className="relative p-4 rounded-2xl bg-yellow-500 text-white overflow-hidden">
        <Trophy className="absolute -right-2 -bottom-2 text-white/20" size={64} />
        <div className="relative z-10">
          <p className="text-sm text-white/80">Total Achievements</p>
          <p className="text-3xl font-bold mt-2">{achievementsCount}</p>
        </div>
      </div>
    </div>
  )
}
