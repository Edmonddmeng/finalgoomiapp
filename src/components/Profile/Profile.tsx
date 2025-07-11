import { useState } from "react"
import Image from "next/image"
import type { User, Community, CommunityCategory } from "@/types"
import { Award, Settings, Users, Plus, X, Trash2, Loader2 } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { useApiQuery } from "@/hooks/useApiQuery"
import { useApiMutation } from "@/hooks/useApiMutation"
import { communityService } from "@/services/communityService"
import { userService } from "@/services/userService"

export function Profile() {
  const { user: authUser } = useAuth()
  
  // Fetch user profile and communities
  const { data: userProfile, isLoading: profileLoading, refetch: refetchProfile } = useApiQuery(
    () => userService.getProfile(),
    ['profile'],
    { enabled: !!authUser }
  )
  
  const { data: communities, isLoading: communitiesLoading, refetch: refetchCommunities } = useApiQuery(
    () => communityService.getCommunities(),
    ['communities'],
    { enabled: !!authUser }
  )
  
  // Mutations
  const createCommunityMutation = useApiMutation(
    (community: { name: string; description: string; category: CommunityCategory; avatar?: string }) => 
      communityService.createCommunity(community)
  )
  
  const deleteCommunityMutation = useApiMutation(
    (communityId: string) => communityService.deleteCommunity(communityId)
  )
  
  const user = userProfile || authUser
  const [showCreateCommunity, setShowCreateCommunity] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null)
  const [newCommunity, setNewCommunity] = useState<{
    name: string
    description: string
    category: CommunityCategory | ""
    avatar: string
  }>({
    name: "",
    description: "",
    category: "",
    avatar: ""
  })
  
  // Filter communities created by the user (assuming creator is the first member or has high member count)
  const userCommunities = communities?.filter(community => community.joined) || []
  const totalAchievements = user?.achievements?.length || 0

  const handleCreateCommunity = () => {
    if (!newCommunity.name.trim() || !newCommunity.description.trim() || !newCommunity.category.trim()) return

    createCommunityMutation.mutate({
      name: newCommunity.name.trim(),
      description: newCommunity.description.trim(),
      category: newCommunity.category as CommunityCategory,
      avatar: newCommunity.avatar.trim() || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(newCommunity.name.trim())}`
    }, {
      onSuccess: () => {
        refetchCommunities()
      }
    })

    // Reset form
    setNewCommunity({ name: "", description: "", category: "", avatar: "" })
    setShowCreateCommunity(false)
  }

  const handleDeleteCommunity = async (communityId: string) => {
    await deleteCommunityMutation.mutateAsync(communityId)
    refetchCommunities()
    setShowDeleteConfirm(null)
  }

  const communityToDelete = showDeleteConfirm && communities ? communities.find(c => c.id === showDeleteConfirm) : null
  
  // Loading state
  if (profileLoading || communitiesLoading || !user) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-3">
          <Loader2 className="animate-spin h-12 w-12 text-purple-600 mx-auto" />
          <p className="text-gray-500 dark:text-gray-400">Loading profile...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Profile Title Card */}
      <div className="bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 rounded-3xl p-8 text-white shadow-xl">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <Image
            src={user.avatar || "/placeholder.svg"}
            alt={user.name}
            width={128}
            height={128}
            className="rounded-full border-4 border-white/30 shadow-xl"
          />
          <div className="text-center md:text-left flex-1">
            <h1 className="text-4xl font-bold mb-2">{user.name}</h1>
            <p className="text-white/90 text-lg">{user.email}</p>
            <p className="text-sm text-white/70 mt-2">
              Member since {new Date(user.createdAt).toLocaleDateString()}
            </p>
            <div className="mt-4 flex flex-wrap gap-4">
              <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-1 border border-white/30">
                <span className="font-bold">{user.progressLevel}%</span>
                <span className="text-sm ml-1 text-white/90">Progress</span>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-1 border border-white/30">
                <span className="font-bold">{totalAchievements}</span>
                <span className="text-sm ml-1 text-white/90">Achievements</span>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-1 border border-white/30">
                <span className="font-bold">{user.stats?.averageGPA?.toFixed(2) || '0.00'}</span>
                <span className="text-sm ml-1 text-white/90">GPA</span>
              </div>
            </div>
          </div>
          <button className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 border border-white/30 transition-colors">
            <Settings size={16} />
            <span>Edit Profile</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Achievements</h3>
          <div className="space-y-3">
            {user.achievements.map((ach) => (
              <div key={ach.id} className="flex items-center gap-3">
                <div className="p-2 bg-yellow-100 text-yellow-600 rounded-full">
                  <Award size={16} />
                </div>
                <div>
                  <p className="font-medium text-sm text-gray-800 dark:text-gray-200">{ach.title}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date(ach.unlockedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Friends</h3>
          <div className="space-y-3">
            {/* Mock friends data */}
            {[
              { name: "Alice Johnson", avatar: "/IMG_2464.png" },
              { name: "Bob Williams", avatar: "/IMG_2464.png" },
              { name: "Charlie Brown", avatar: "/IMG_2464.png" },
            ].map((friend) => (
              <div key={friend.name} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Image
                    src={friend.avatar || "/placeholder.svg"}
                    alt={friend.name}
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                  <p className="font-medium text-sm text-gray-800 dark:text-gray-200">{friend.name}</p>
                </div>
                <button className="text-xs text-blue-600 hover:underline">View Profile</button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Community Management Section */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">My Communities</h3>
          <button
            onClick={() => setShowCreateCommunity(true)}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
          >
            <Plus size={16} />
            Create Community
          </button>
        </div>
        
        {userCommunities.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {userCommunities.map((community) => (
              <div 
                key={community.id} 
                className="bg-gray-50 dark:bg-slate-700 rounded-xl p-4 border border-gray-200 dark:border-slate-600 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => {
                  // Navigation to community can be handled by parent component or router
                  console.log('Navigate to community:', community.id)
                }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <Image
                      src={community.avatar || "/placeholder.svg"}
                      alt={community.name}
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">{community.name}</h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{community.category}</p>
                    </div>
                  </div>
                  {community.members === 1 && (
                    <button 
                      onClick={(e) => {
                        e.stopPropagation()
                        setShowDeleteConfirm(community.id)
                      }}
                      className="p-1.5 text-gray-600 hover:text-red-600 hover:bg-red-50 dark:text-gray-400 dark:hover:text-red-400 dark:hover:bg-red-950 rounded transition-colors"
                      title="Delete community"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
                
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
                  {community.description}
                </p>
                
                <div className="flex items-center">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    <Users size={14} className="inline mr-1" />
                    {community.members} members
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Users size={48} className="mx-auto text-gray-400 mb-3" />
            <p className="text-gray-600 dark:text-gray-400 mb-1">You haven't joined any communities yet</p>
            <p className="text-sm text-gray-500 dark:text-gray-500">Create your own community or join existing ones!</p>
          </div>
        )}
      </div>

      {/* Create Community Modal */}
      {showCreateCommunity && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Create New Community</h3>
                <button
                  onClick={() => setShowCreateCommunity(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-full transition-colors"
                >
                  <X size={20} className="text-gray-600 dark:text-gray-300" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Community Name *
                  </label>
                  <input
                    type="text"
                    value={newCommunity.name}
                    onChange={(e) => setNewCommunity(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., AP Biology Study Group"
                    className="w-full p-3 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Category *
                  </label>
                  <select
                    value={newCommunity.category}
                    onChange={(e) => setNewCommunity(prev => ({ ...prev, category: e.target.value as CommunityCategory | "" }))}
                    className="w-full p-3 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="">Select a category</option>
                    <option value="Academics">Academics</option>
                    <option value="STEM">STEM</option>
                    <option value="Sports">Sports</option>
                    <option value="Arts">Arts</option>
                    <option value="Languages">Languages</option>
                    <option value="College Prep">College Prep</option>
                    <option value="Hobbies">Hobbies</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Description *
                  </label>
                  <textarea
                    value={newCommunity.description}
                    onChange={(e) => setNewCommunity(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="What's this community about? Who should join?"
                    className="w-full p-3 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Avatar URL (Optional)
                  </label>
                  <input
                    type="text"
                    value={newCommunity.avatar}
                    onChange={(e) => setNewCommunity(prev => ({ ...prev, avatar: e.target.value }))}
                    placeholder="https://example.com/avatar.jpg"
                    className="w-full p-3 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Leave empty to generate a default avatar
                  </p>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleCreateCommunity}
                  disabled={!newCommunity.name.trim() || !newCommunity.description.trim() || !newCommunity.category}
                  className="flex-1 px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center justify-center gap-2"
                >
                  <Users size={18} />
                  Create Community
                </button>
                <button
                  onClick={() => setShowCreateCommunity(false)}
                  className="px-4 py-3 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && communityToDelete && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md">
            <div className="p-6">
              <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Delete Community?</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Are you sure you want to delete <span className="font-semibold">{communityToDelete.name}</span>? 
                  This action cannot be undone and all posts in this community will be removed.
                </p>
              </div>

              <div className="bg-gray-50 dark:bg-slate-700 rounded-lg p-4 mb-6">
                <div className="flex items-center gap-3">
                  <Image
                    src={communityToDelete.avatar || "/placeholder.svg"}
                    alt={communityToDelete.name}
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{communityToDelete.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{communityToDelete.category}</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => handleDeleteCommunity(communityToDelete.id)}
                  className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                >
                  Delete Community
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(null)}
                  className="flex-1 px-4 py-3 bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-slate-600 transition-colors font-medium"
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
