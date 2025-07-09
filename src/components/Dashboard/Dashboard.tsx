"use client"

import type React from "react"
import { useState } from "react"
import { StatsCards } from "./StatsCards"
import { RecentComments } from "./RecentComments"
import { AcademicDetails } from "./AcademicDetails"
import { CompetitionDetails } from "./CompetitionDetails"
import { ActivityDetails } from "./ActivityDetails"
import type { User, Competition, Activity, Task, ActivityCategory } from "@/types"
import { ChevronRight, Trophy, Users, Plus, X, ChevronDown, ChevronUp, Trash2 } from "lucide-react"

interface DashboardProps {
  user: User
  tasks: Task[]
  setUser: (user: User | ((prev: User) => User)) => void
}

export function Dashboard({ user, tasks = [], setUser }: DashboardProps) {
  const [showAcademicDetails, setShowAcademicDetails] = useState(false)
  const [selectedCompetition, setSelectedCompetition] = useState<Competition | null>(null)
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null)
  const [showAddActivityModal, setShowAddActivityModal] = useState(false)
  const [showAddCompetitionModal, setShowAddCompetitionModal] = useState(false)

  const [showAllCompetitions, setShowAllCompetitions] = useState(false)
  const [showAllActivities, setShowAllActivities] = useState(false)

  const [newActivity, setNewActivity] = useState({
    name: "",
    category: "clubs" as Activity["category"],
    description: "",
    startDate: "",
    hours: 0,
    position: "",
  })

  const [newCompetition, setNewCompetition] = useState({
    name: "",
    category: "clubs" as ActivityCategory,
    placement: "",
    date: "",
    description: "",
  })

  const calculateStreak = () => {
    const recentAchievements = (user.achievements || []).filter((achievement) => {
      const achievementDate = new Date(achievement.dateEarned)
      const daysDiff = Math.floor((Date.now() - achievementDate.getTime()) / (1000 * 60 * 60 * 24))
      return daysDiff <= 30
    })
    return Math.max(recentAchievements.length * 7, 15)
  }

  const currentStreak = calculateStreak()

  const inspiringQuotes = [
    "Success is not final, failure is not fatal: it is the courage to continue that counts.",
    "The future belongs to those who believe in the beauty of their dreams.",
    "Your limitation—it's only your imagination.",
    "Great things never come from comfort zones.",
    "Dream it. Wish it. Do it.",
  ]

  const userQuote = inspiringQuotes[Number.parseInt(user.id) % inspiringQuotes.length]

  const handleAddActivity = () => {
    if (!newActivity.name.trim() || !newActivity.description.trim()) return

    const activity: Activity = {
      id: Date.now().toString(),
      name: newActivity.name.trim(),
      category: newActivity.category,
      description: newActivity.description.trim(),
      startDate: newActivity.startDate || new Date().toISOString().split("T")[0],
      hours: newActivity.hours,
      position: newActivity.position.trim() || undefined,
    }

    setUser((prev) => ({
      ...prev,
      activities: [...prev.activities, activity],
    }))

    setNewActivity({ name: "", category: "clubs", description: "", startDate: "", hours: 0, position: "" })
    setShowAddActivityModal(false)
  }

  const handleAddCompetition = () => {
    if (!newCompetition.name.trim() || !newCompetition.placement.trim()) return

    const competition: Competition = {
      id: Date.now().toString(),
      name: newCompetition.name.trim(),
      category: newCompetition.category,
      placement: newCompetition.placement.trim(),
      date: newCompetition.date || new Date().toISOString().split("T")[0],
      description: newCompetition.description.trim(),
    }

    setUser((prev) => ({
      ...prev,
      competitions: [...prev.competitions, competition],
    }))

    setNewCompetition({ name: "", category: "clubs" as ActivityCategory, placement: "", date: "", description: "" })
    setShowAddCompetitionModal(false)
  }

  const handleDeleteActivity = (activityId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setUser((prev) => ({
      ...prev,
      activities: prev.activities.filter((activity) => activity.id !== activityId),
    }))
  }

  const handleDeleteCompetition = (competitionId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setUser((prev) => ({
      ...prev,
      competitions: prev.competitions.filter((competition) => competition.id !== competitionId),
    }))
  }

  const getDisplayedCompetitions = () => {
    const sortedCompetitions = [...user.competitions].reverse()
    return showAllCompetitions ? sortedCompetitions : sortedCompetitions.slice(0, 2)
  }

  const getDisplayedActivities = () => {
    const sortedActivities = [...user.activities].reverse()
    return showAllActivities ? sortedActivities : sortedActivities.slice(0, 2)
  }

  const displayedCompetitions = getDisplayedCompetitions()
  const displayedActivities = getDisplayedActivities()
  const hasMoreCompetitions = user.competitions.length > 2
  const hasMoreActivities = user.activities.length > 2

  if (showAcademicDetails) {
    return <AcademicDetails user={user} onBack={() => setShowAcademicDetails(false)} />
  }

  if (selectedCompetition) {
    return (
      <CompetitionDetails
        user={user}
        competition={selectedCompetition}
        tasks={tasks}
        onBack={() => setSelectedCompetition(null)}
      />
    )
  }

  if (selectedActivity) {
    return (
      <ActivityDetails user={user} activity={selectedActivity} tasks={tasks} onBack={() => setSelectedActivity(null)} />
    )
  }

  return (
    <div className="space-y-6 pb-20">
      <div className="bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-3xl p-6 text-white">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold mb-3">Hello, {user.name.split(" ")[0]}!</h1>
          <p className="text-lg opacity-90 italic leading-relaxed max-w-sm mx-auto">"{userQuote}"</p>
        </div>
        <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 border border-white/30">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <div className="w-3 h-3 bg-orange-400 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium opacity-90">Current Streak</span>
            </div>
            <div className="text-4xl font-bold mb-1">{currentStreak}</div>
            <div className="text-sm opacity-80">days of progress</div>
          </div>
        </div>
      </div>

      <StatsCards user={user} setUser={setUser} />

      <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-slate-700">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-gray-900 dark:text-white">Current Academics</h3>
          <button
            onClick={() => setShowAcademicDetails(true)}
            className="flex items-center gap-1 text-blue-600 hover:text-blue-700 transition-colors"
          >
            <span className="text-sm font-medium">View Details</span>
            <ChevronRight size={16} />
          </button>
        </div>
        <div className="space-y-2">
          {user.academics.slice(0, 3).map((academic) => (
            <div key={academic.id} className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-300">{academic.subject}</span>
              <span
                className={`text-sm font-medium px-2 py-1 rounded-full ${academic.grade.startsWith("A") ? "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300" : academic.grade.startsWith("B") ? "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300" : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300"}`}
              >
                {academic.grade}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-slate-700">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Trophy className="text-yellow-600" size={20} />
            <h3 className="font-semibold text-gray-900 dark:text-white">Recent Competitions</h3>
            {user.competitions.length > 0 && (
              <span className="px-2 py-1 bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-300 text-xs rounded-full font-medium">
                {user.competitions.length}
              </span>
            )}
          </div>
          <button
            onClick={() => setShowAddCompetitionModal(true)}
            className="flex items-center gap-1 px-3 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-all"
          >
            <Plus size={16} />
            <span className="text-sm font-medium">Add Competition</span>
          </button>
        </div>
        <div className="space-y-3">
          {user.competitions.length > 0 ? (
            <>
              {displayedCompetitions.map((competition) => (
                <div
                  key={competition.id}
                  className="group flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-slate-700/50 rounded-lg transition-colors cursor-pointer"
                  onClick={() => setSelectedCompetition(competition)}
                >
                  <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                  <div className="flex-1">
                    <div className="font-medium text-sm text-gray-900 dark:text-gray-200">{competition.name}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {competition.placement} • {competition.category}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400">{new Date(competition.date).toLocaleDateString()}</span>
                    <button
                      onClick={(e) => handleDeleteCompetition(competition.id, e)}
                      className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-500 transition-all"
                      title="Delete competition"
                    >
                      <Trash2 size={14} />
                    </button>
                    <button className="flex items-center gap-1 text-blue-600 hover:text-blue-700 transition-colors">
                      <span className="text-xs font-medium">View Details</span>
                      <ChevronRight size={12} />
                    </button>
                  </div>
                </div>
              ))}
              {hasMoreCompetitions && (
                <div className="flex justify-center pt-2">
                  <button
                    onClick={() => setShowAllCompetitions(!showAllCompetitions)}
                    className="flex items-center gap-2 px-4 py-2 text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 rounded-lg transition-all"
                  >
                    {showAllCompetitions ? (
                      <>
                        <ChevronUp size={16} />
                        <span className="font-medium">Show Less</span>
                      </>
                    ) : (
                      <>
                        <ChevronDown size={16} />
                        <span className="font-medium">Show All ({user.competitions.length} competitions)</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-6 text-gray-500 dark:text-gray-400">
              <Trophy size={24} className="mx-auto mb-2 opacity-50" />
              <p className="text-sm">No competitions yet. Click "Add Competition" to get started!</p>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-slate-700">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Users className="text-purple-600" size={20} />
            <h3 className="font-semibold text-gray-900 dark:text-white">Current Activities</h3>
            {user.activities.length > 0 && (
              <span className="px-2 py-1 bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300 text-xs rounded-full font-medium">
                {user.activities.length}
              </span>
            )}
          </div>
          <button
            onClick={() => setShowAddActivityModal(true)}
            className="flex items-center gap-1 px-3 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-all"
          >
            <Plus size={16} />
            <span className="text-sm font-medium">Add Activity</span>
          </button>
        </div>
        <div className="space-y-3">
          {user.activities.length > 0 ? (
            <>
              {displayedActivities.map((activity) => (
                <div
                  key={activity.id}
                  className="group flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-slate-700/50 rounded-lg transition-colors cursor-pointer"
                  onClick={() => setSelectedActivity(activity)}
                >
                  <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                  <div className="flex-1">
                    <div className="font-medium text-sm text-gray-900 dark:text-gray-200">{activity.name}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                      {activity.category} • {activity.hours} hours{activity.position && ` • ${activity.position}`}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400">{new Date(activity.startDate).toLocaleDateString()}</span>
                    <button
                      onClick={(e) => handleDeleteActivity(activity.id, e)}
                      className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-500 transition-all"
                      title="Delete activity"
                    >
                      <Trash2 size={14} />
                    </button>
                    <button className="flex items-center gap-1 text-blue-600 hover:text-blue-700 transition-colors">
                      <span className="text-xs font-medium">View Details</span>
                      <ChevronRight size={12} />
                    </button>
                  </div>
                </div>
              ))}
              {hasMoreActivities && (
                <div className="flex justify-center pt-2">
                  <button
                    onClick={() => setShowAllActivities(!showAllActivities)}
                    className="flex items-center gap-2 px-4 py-2 text-purple-600 hover:text-purple-700 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg transition-all"
                  >
                    {showAllActivities ? (
                      <>
                        <ChevronUp size={16} />
                        <span className="font-medium">Show Less</span>
                      </>
                    ) : (
                      <>
                        <ChevronDown size={16} />
                        <span className="font-medium">Show All ({user.activities.length} activities)</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-6 text-gray-500 dark:text-gray-400">
              <Users size={24} className="mx-auto mb-2 opacity-50" />
              <p className="text-sm">No activities yet. Click "Add Activity" to get started!</p>
            </div>
          )}
        </div>
      </div>

      <RecentComments comments={user.comments} />

      {showAddActivityModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Add New Activity</h3>
                <button
                  onClick={() => setShowAddActivityModal(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-full transition-colors"
                >
                  <X size={20} className="text-gray-600 dark:text-gray-300" />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Activity Name *
                  </label>
                  <input
                    type="text"
                    value={newActivity.name}
                    onChange={(e) => setNewActivity((prev) => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., Debate Club, Varsity Soccer, Volunteer Work"
                    className="w-full p-3 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category *</label>
                  <select
                    value={newActivity.category}
                    onChange={(e) =>
                      setNewActivity((prev) => ({ ...prev, category: e.target.value as Activity["category"] }))
                    }
                    className="w-full p-3 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="clubs">Clubs</option>
                    <option value="sports">Sports</option>
                    <option value="arts">Arts</option>
                    <option value="volunteer">Volunteer</option>
                    <option value="work">Work</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Description *
                  </label>
                  <textarea
                    value={newActivity.description}
                    onChange={(e) => setNewActivity((prev) => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe your role and what you do in this activity..."
                    className="w-full p-3 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                    rows={3}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Start Date</label>
                  <input
                    type="date"
                    value={newActivity.startDate}
                    onChange={(e) => setNewActivity((prev) => ({ ...prev, startDate: e.target.value }))}
                    className="w-full p-3 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Hours per Week
                  </label>
                  <input
                    type="number"
                    value={newActivity.hours}
                    onChange={(e) =>
                      setNewActivity((prev) => ({ ...prev, hours: Number.parseInt(e.target.value) || 0 }))
                    }
                    placeholder="0"
                    min="0"
                    className="w-full p-3 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Position/Role (Optional)
                  </label>
                  <input
                    type="text"
                    value={newActivity.position}
                    onChange={(e) => setNewActivity((prev) => ({ ...prev, position: e.target.value }))}
                    placeholder="e.g., Captain, President, Member"
                    className="w-full p-3 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleAddActivity}
                  disabled={!newActivity.name.trim() || !newActivity.description.trim()}
                  className="flex-1 px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                  Add Activity
                </button>
                <button
                  onClick={() => setShowAddActivityModal(false)}
                  className="px-4 py-3 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showAddCompetitionModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Add New Competition</h3>
                <button
                  onClick={() => setShowAddCompetitionModal(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-full transition-colors"
                >
                  <X size={20} className="text-gray-600 dark:text-gray-300" />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Competition Name *
                  </label>
                  <input
                    type="text"
                    value={newCompetition.name}
                    onChange={(e) => setNewCompetition((prev) => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., State Science Fair, Math Olympiad"
                    className="w-full p-3 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category *</label>
                  <select
                    value={newCompetition.category}
                    onChange={(e) =>
                      setNewCompetition((prev) => ({ ...prev, category: e.target.value as ActivityCategory }))
                    }
                    className="w-full p-3 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  >
                    <option value="clubs">Clubs</option>
                    <option value="sports">Sports</option>
                    <option value="arts">Arts</option>
                    <option value="volunteer">Volunteer</option>
                    <option value="work">Work</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Placement/Result *
                  </label>
                  <input
                    type="text"
                    value={newCompetition.placement}
                    onChange={(e) => setNewCompetition((prev) => ({ ...prev, placement: e.target.value }))}
                    placeholder="e.g., 1st Place, Finalist, Participant"
                    className="w-full p-3 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date</label>
                  <input
                    type="date"
                    value={newCompetition.date}
                    onChange={(e) => setNewCompetition((prev) => ({ ...prev, date: e.target.value }))}
                    className="w-full p-3 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                  <textarea
                    value={newCompetition.description}
                    onChange={(e) => setNewCompetition((prev) => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe the competition and your project/performance..."
                    className="w-full p-3 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent resize-none"
                    rows={3}
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleAddCompetition}
                  disabled={
                    !newCompetition.name.trim() || !newCompetition.placement.trim()
                  }
                  className="flex-1 px-4 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                  Add Competition
                </button>
                <button
                  onClick={() => setShowAddCompetitionModal(false)}
                  className="px-4 py-3 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
