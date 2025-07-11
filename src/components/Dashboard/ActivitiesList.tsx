"use client"
import { useState } from "react"
import { ChevronLeft, Plus, Users, Calendar, Clock, Edit2, Trash2, Loader2 } from "lucide-react"
import { useActivities, useCreateActivity, useUpdateActivity, useDeleteActivity } from "@/hooks/useActivities"
import { Activity, ActivityCategory } from "@/types"

interface ActivitiesListProps {
  onBack: () => void
  onSelectActivity: (activity: Activity) => void
}

export function ActivitiesList({ onBack, onSelectActivity }: ActivitiesListProps) {
  const [showAddActivity, setShowAddActivity] = useState(false)
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null)
  
  const { data: activities, isLoading, refetch } = useActivities()
  const createActivityMutation = useCreateActivity()
  const updateActivityMutation = useUpdateActivity()
  const deleteActivityMutation = useDeleteActivity()
  
  const [newActivity, setNewActivity] = useState({
    name: "",
    category: "sports" as ActivityCategory,
    role: "",
    description: "",
    startDate: "",
    endDate: "",
    hoursPerWeek: 2,
    location: "",
    impact: ""
  })
  
  const handleSubmit = async () => {
    if (!newActivity.name || !newActivity.role) return
    
    try {
      if (editingActivity) {
        await updateActivityMutation.mutateAsync({
          id: editingActivity.id,
          data: newActivity
        })
      } else {
        await createActivityMutation.mutateAsync(newActivity)
      }
      
      await refetch()
      setShowAddActivity(false)
      setEditingActivity(null)
      setNewActivity({
        name: "",
        category: "sports",
        role: "",
        description: "",
        startDate: "",
        endDate: "",
        hoursPerWeek: 2,
        location: "",
        impact: ""
      })
    } catch (error) {
      console.error('Failed to save activity:', error)
    }
  }
  
  const handleEdit = (activity: Activity) => {
    setEditingActivity(activity)
    setNewActivity({
      name: activity.name,
      category: activity.category,
      role: activity.role,
      description: activity.description || "",
      startDate: activity.startDate,
      endDate: activity.endDate || "",
      hoursPerWeek: activity.hoursPerWeek,
      location: activity.location || "",
      impact: activity.impact || ""
    })
    setShowAddActivity(true)
  }
  
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this activity?")) return
    
    try {
      await deleteActivityMutation.mutateAsync(id)
      await refetch()
    } catch (error) {
      console.error('Failed to delete activity:', error)
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
          onClick={() => setShowAddActivity(true)}
          className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
        >
          <Plus size={16} />
          Add Activity
        </button>
      </div>
      
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-slate-700">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Your Activities</h2>
        
        {activities && activities.length > 0 ? (
          <div className="grid gap-4">
            {activities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors group"
              >
                <div 
                  className="flex-1 cursor-pointer"
                  onClick={() => onSelectActivity(activity)}
                >
                  <div className="flex items-center gap-3">
                    <Users className="text-orange-600" size={24} />
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {activity.name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {activity.role} • {activity.category}
                      </p>
                      {activity.description && (
                        <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                          {activity.description}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleEdit(activity)
                    }}
                    className="p-2 text-gray-500 hover:text-blue-600 transition-colors"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDelete(activity.id)
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
            <Users className="mx-auto text-gray-400 mb-3" size={48} />
            <p className="text-gray-500 dark:text-gray-400">No activities recorded yet</p>
            <button
              onClick={() => setShowAddActivity(true)}
              className="mt-2 text-orange-600 dark:text-orange-400 hover:underline text-sm"
            >
              Add your first activity
            </button>
          </div>
        )}
      </div>
      
      {/* Add/Edit Activity Modal */}
      {showAddActivity && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                {editingActivity ? 'Edit Activity' : 'Add New Activity'}
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Activity Name *
                  </label>
                  <input
                    type="text"
                    value={newActivity.name}
                    onChange={(e) => setNewActivity(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., Student Council"
                    className="w-full p-3 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-lg focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Your Role *
                  </label>
                  <input
                    type="text"
                    value={newActivity.role}
                    onChange={(e) => setNewActivity(prev => ({ ...prev, role: e.target.value }))}
                    placeholder="e.g., President, Member, Volunteer"
                    className="w-full p-3 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-lg focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Category *
                  </label>
                  <select
                    value={newActivity.category}
                    onChange={(e) => setNewActivity(prev => ({ ...prev, category: e.target.value as ActivityCategory }))}
                    className="w-full p-3 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-lg focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="sports">Sports</option>
                    <option value="clubs">Clubs</option>
                    <option value="arts">Arts</option>
                    <option value="volunteer">Volunteer</option>
                    <option value="work">Work</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Description
                  </label>
                  <textarea
                    value={newActivity.description}
                    onChange={(e) => setNewActivity(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe your involvement and responsibilities"
                    rows={3}
                    className="w-full p-3 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-lg focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Start Date *
                    </label>
                    <input
                      type="date"
                      value={newActivity.startDate}
                      onChange={(e) => setNewActivity(prev => ({ ...prev, startDate: e.target.value }))}
                      className="w-full p-3 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-lg focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      End Date
                    </label>
                    <input
                      type="date"
                      value={newActivity.endDate}
                      onChange={(e) => setNewActivity(prev => ({ ...prev, endDate: e.target.value }))}
                      className="w-full p-3 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-lg focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Hours per Week
                  </label>
                  <input
                    type="number"
                    value={newActivity.hoursPerWeek}
                    onChange={(e) => setNewActivity(prev => ({ ...prev, hoursPerWeek: Number(e.target.value) }))}
                    min="1"
                    max="40"
                    className="w-full p-3 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-lg focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>
              
              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleSubmit}
                  disabled={!newActivity.name || !newActivity.role || createActivityMutation.isLoading || updateActivityMutation.isLoading}
                  className="flex-1 px-4 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center justify-center gap-2"
                >
                  {(createActivityMutation.isLoading || updateActivityMutation.isLoading) && (
                    <Loader2 className="animate-spin" size={16} />
                  )}
                  {editingActivity ? 'Update' : 'Add'} Activity
                </button>
                <button
                  onClick={() => {
                    setShowAddActivity(false)
                    setEditingActivity(null)
                    setNewActivity({
                      name: "",
                      category: "sports",
                      role: "",
                      description: "",
                      startDate: "",
                      endDate: "",
                      hoursPerWeek: 2,
                      location: "",
                      impact: ""
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