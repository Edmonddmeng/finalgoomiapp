"use client"
import { useState } from "react"
import { ChevronLeft, Plus, Trophy, Calendar, Award, Edit2, Trash2, Loader2 } from "lucide-react"
import { useCompetitions, useCreateCompetition, useUpdateCompetition, useDeleteCompetition } from "@/hooks/useCompetitions"
import { Competition, CompetitionCategory } from "@/types"

interface CompetitionsListProps {
  onBack: () => void
  onSelectCompetition: (competition: Competition) => void
}

export function CompetitionsList({ onBack, onSelectCompetition }: CompetitionsListProps) {
  const [showAddCompetition, setShowAddCompetition] = useState(false)
  const [editingCompetition, setEditingCompetition] = useState<Competition | null>(null)
  
  const { data: competitions, isLoading, refetch } = useCompetitions()
  const createCompetitionMutation = useCreateCompetition()
  const updateCompetitionMutation = useUpdateCompetition()
  const deleteCompetitionMutation = useDeleteCompetition()
  
  const [newCompetition, setNewCompetition] = useState({
    name: "",
    category: "science" as CompetitionCategory,
    level: "regional" as "school" | "regional" | "state" | "national" | "international",
    date: "",
    location: "",
    description: "",
    achievement: "",
    teamSize: 1,
    ranking: ""
  })
  
  const handleSubmit = async () => {
    if (!newCompetition.name || !newCompetition.date) return
    
    try {
      if (editingCompetition) {
        await updateCompetitionMutation.mutateAsync({
          id: editingCompetition.id,
          data: newCompetition
        })
      } else {
        await createCompetitionMutation.mutateAsync(newCompetition)
      }
      
      await refetch()
      setShowAddCompetition(false)
      setEditingCompetition(null)
      setNewCompetition({
        name: "",
        category: "science",
        level: "regional",
        date: "",
        location: "",
        description: "",
        achievement: "",
        teamSize: 1,
        ranking: ""
      })
    } catch (error) {
      console.error('Failed to save competition:', error)
    }
  }
  
  const handleEdit = (competition: Competition) => {
    setEditingCompetition(competition)
    setNewCompetition({
      name: competition.name,
      category: competition.category,
      level: competition.level,
      date: competition.date,
      location: competition.location || "",
      description: competition.description || "",
      achievement: competition.achievement || "",
      teamSize: competition.teamSize || 1,
      ranking: competition.ranking || ""
    })
    setShowAddCompetition(true)
  }
  
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this competition?")) return
    
    try {
      await deleteCompetitionMutation.mutateAsync(id)
      await refetch()
    } catch (error) {
      console.error('Failed to delete competition:', error)
    }
  }
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="animate-spin text-gray-400" size={32} />
      </div>
    )
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors font-medium"
        >
          <ChevronLeft size={20} />
          <span>Back to Dashboard</span>
        </button>
        
        <button
          onClick={() => setShowAddCompetition(true)}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          <Plus size={16} />
          Add Competition
        </button>
      </div>
      
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-slate-700">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Your Competitions</h2>
        
        {competitions && competitions.length > 0 ? (
          <div className="grid gap-4">
            {competitions.map((competition) => (
              <div
                key={competition.id}
                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors group"
              >
                <div 
                  className="flex-1 cursor-pointer"
                  onClick={() => onSelectCompetition(competition)}
                >
                  <div className="flex items-center gap-3">
                    <Trophy className="text-purple-600" size={24} />
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {competition.name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {competition.category} • {competition.level} level
                      </p>
                      {competition.achievement && (
                        <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                          🏆 {competition.achievement}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleEdit(competition)
                    }}
                    className="p-2 text-gray-500 hover:text-blue-600 transition-colors"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDelete(competition.id)
                    }}
                    className="p-2 text-gray-500 hover:text-red-600 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Trophy className="mx-auto text-gray-400 mb-3" size={48} />
            <p className="text-gray-500 dark:text-gray-400">No competitions recorded yet</p>
            <button
              onClick={() => setShowAddCompetition(true)}
              className="mt-2 text-purple-600 dark:text-purple-400 hover:underline text-sm"
            >
              Add your first competition
            </button>
          </div>
        )}
      </div>
      
      {/* Add/Edit Competition Modal */}
      {showAddCompetition && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                {editingCompetition ? 'Edit Competition' : 'Add New Competition'}
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Competition Name *
                  </label>
                  <input
                    type="text"
                    value={newCompetition.name}
                    onChange={(e) => setNewCompetition(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., Science Olympiad"
                    className="w-full p-3 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-lg focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Category *
                    </label>
                    <select
                      value={newCompetition.category}
                      onChange={(e) => setNewCompetition(prev => ({ ...prev, category: e.target.value as CompetitionCategory }))}
                      className="w-full p-3 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-lg focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="science">Science</option>
                      <option value="math">Math</option>
                      <option value="programming">Programming</option>
                      <option value="robotics">Robotics</option>
                      <option value="debate">Debate</option>
                      <option value="writing">Writing</option>
                      <option value="arts">Arts</option>
                      <option value="business">Business</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Level *
                    </label>
                    <select
                      value={newCompetition.level}
                      onChange={(e) => setNewCompetition(prev => ({ ...prev, level: e.target.value as any }))}
                      className="w-full p-3 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-lg focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="school">School</option>
                      <option value="regional">Regional</option>
                      <option value="state">State</option>
                      <option value="national">National</option>
                      <option value="international">International</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Competition Date *
                  </label>
                  <input
                    type="date"
                    value={newCompetition.date}
                    onChange={(e) => setNewCompetition(prev => ({ ...prev, date: e.target.value }))}
                    className="w-full p-3 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-lg focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    value={newCompetition.location}
                    onChange={(e) => setNewCompetition(prev => ({ ...prev, location: e.target.value }))}
                    placeholder="e.g., MIT, Boston MA"
                    className="w-full p-3 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-lg focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Achievement/Result
                  </label>
                  <input
                    type="text"
                    value={newCompetition.achievement}
                    onChange={(e) => setNewCompetition(prev => ({ ...prev, achievement: e.target.value }))}
                    placeholder="e.g., 1st Place, Gold Medal, Finalist"
                    className="w-full p-3 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-lg focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Description
                  </label>
                  <textarea
                    value={newCompetition.description}
                    onChange={(e) => setNewCompetition(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe the competition and your experience"
                    rows={3}
                    className="w-full p-3 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-lg focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>
              
              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleSubmit}
                  disabled={!newCompetition.name || !newCompetition.date || createCompetitionMutation.isLoading || updateCompetitionMutation.isLoading}
                  className="flex-1 px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center justify-center gap-2"
                >
                  {(createCompetitionMutation.isLoading || updateCompetitionMutation.isLoading) && (
                    <Loader2 className="animate-spin" size={16} />
                  )}
                  {editingCompetition ? 'Update' : 'Add'} Competition
                </button>
                <button
                  onClick={() => {
                    setShowAddCompetition(false)
                    setEditingCompetition(null)
                    setNewCompetition({
                      name: "",
                      category: "science",
                      level: "regional",
                      date: "",
                      location: "",
                      description: "",
                      achievement: "",
                      teamSize: 1,
                      ranking: ""
                    })
                  }}
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