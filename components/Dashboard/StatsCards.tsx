"use client"

import type React from "react"
import { useState } from "react"
import type { User } from "@/types"
import { Award, Target, TrendingUp, Edit3, Check, X } from "lucide-react"

interface StatsCardsProps {
  user: User
  setUser: (user: User | ((prev: User) => User)) => void
}

export function StatsCards({ user, setUser }: StatsCardsProps) {
  const [editingStat, setEditingStat] = useState<string | null>(null)
  const [statValue, setStatValue] = useState<string>("")

  const handleEditClick = (stat: string, currentValue: number) => {
    setEditingStat(stat)
    setStatValue(currentValue.toString())
  }

  const handleSave = () => {
    if (!editingStat) return

    const newValue = Number.parseFloat(statValue)
    if (isNaN(newValue)) {
      handleCancel()
      return
    }

    setUser((prevUser) => {
      if (editingStat === "gpa") {
        return { ...prevUser, gpa: newValue }
      }
      if (editingStat === "points") {
        return { ...prevUser, totalPoints: newValue }
      }
      if (editingStat === "progress") {
        return { ...prevUser, progressLevel: newValue }
      }
      return prevUser
    })

    setEditingStat(null)
  }

  const handleCancel = () => {
    setEditingStat(null)
    setStatValue("")
  }

  const renderStat = (
    key: string,
    Icon: React.ElementType,
    label: string,
    value: number,
    unit: string,
    color: string,
  ) => (
    <div className={`relative p-4 rounded-2xl ${color} overflow-hidden`}>
      <Icon className="absolute -right-2 -bottom-2 text-white/20" size={64} />
      <div className="relative z-10">
        {editingStat === key ? (
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={statValue}
              onChange={(e) => setStatValue(e.target.value)}
              className="w-full bg-transparent text-2xl font-bold text-white border-b-2 border-white/50 focus:outline-none"
              autoFocus
            />
            <button onClick={handleSave} className="p-1 bg-white/20 rounded-full">
              <Check size={16} className="text-white" />
            </button>
            <button onClick={handleCancel} className="p-1 bg-white/20 rounded-full">
              <X size={16} className="text-white" />
            </button>
          </div>
        ) : (
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-white/80">{label}</p>
              <p className="text-2xl font-bold text-white">
                {value.toFixed(key === "gpa" ? 2 : 0)}
                <span className="text-lg font-medium ml-1">{unit}</span>
              </p>
            </div>
            <button
              onClick={() => handleEditClick(key, value)}
              className="p-1.5 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
            >
              <Edit3 size={14} className="text-white" />
            </button>
          </div>
        )}
      </div>
    </div>
  )

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {renderStat("gpa", Award, "Current GPA", user.gpa, "", "bg-blue-500")}
      {renderStat("points", Target, "Total Points", user.totalPoints, "pts", "bg-green-500")}
      {renderStat("progress", TrendingUp, "College Readiness", user.progressLevel, "%", "bg-purple-500")}
    </div>
  )
}
