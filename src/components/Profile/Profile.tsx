
import { useState } from "react"
import Image from "next/image"
import type { User, Community, CommunityCategory } from "@/types"
import { Award, Settings, Users, Plus, X, Trash2, Loader2, Trophy, Clock, Upload, CheckCircle, AlertCircle, User as UserIcon } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { useApiQuery } from "@/hooks/useApiQuery"
import { useApiMutation } from "@/hooks/useApiMutation"
import { communityService } from "@/services/communityService"
import { userService } from "@/services/userService"
import { calculateProfileProgress, ProfileProgressBadge, ProfileCompletionSuggestions } from "@/components/Utils/profileProgress"

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

  const updateProfileMutation = useApiMutation(
    (profileData: { username?: string; bio?: string; avatar?: string }) => 
      userService.updateProfile(profileData)
  )
  
  const user = userProfile || authUser
  
  // Calculate profile progress
  const profileProgress = calculateProfileProgress(user)
  
  // State for achievement tabs
  const [activeAchievementTab, setActiveAchievementTab] = useState<'completed' | 'inProgress'>('completed')
  
  const [showCreateCommunity, setShowCreateCommunity] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null)
  const [showEditProfile, setShowEditProfile] = useState(false)
  const [uploadingAvatar, setUploadingAvatar] = useState(false)
  const [showProfileTips, setShowProfileTips] = useState(false)
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

  const [editProfile, setEditProfile] = useState<{
    name: string
    bio: string
    avatar: string
  }>({
    name: "",
    bio: "",
    avatar: ""
  })
  
  // Filter communities created by the user (assuming creator is the first member or has high member count)
  const userCommunities = communities?.filter(community => community.joined) || []
  const totalAchievements = userProfile?.stats?.totalCompetitions || 0
  console.log("userProfile", userProfile)
  

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

  const handleOpenEditProfile = () => {
    setEditProfile({
      name: user?.name || "",
      bio: user?.bio || "",
      avatar: user?.avatar || ""
    })
    setShowEditProfile(true)
  }

  const handleUpdateProfile = () => {
    if (!editProfile.name.trim()) return

    updateProfileMutation.mutate({
      username: editProfile.name.trim(),
      bio: editProfile.bio.trim(),
      avatar: editProfile.avatar.trim() || undefined
    }, {
      onSuccess: () => {
        refetchProfile()
        setShowEditProfile(false)
      }
    })
  }

  const communityToDelete = showDeleteConfirm && communities ? communities.find(c => c.id === showDeleteConfirm) : null
  
  // Get achievements based on active tab
  const getAchievements = () => {
    if (activeAchievementTab === 'completed') {
      return user?.achievements || []
    } else {
      return user?.uncompletedAchievements || []
    }
  }
  
  const achievements = getAchievements()
  const completedCount = user?.achievements?.length || 0
  const inProgressCount = user?.uncompletedAchievements?.length || 0
  
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

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
  
    setUploadingAvatar(true)
    
    const fileName = `pfp/${crypto.randomUUID()}-${file.name}`
    const fileType = file.type
    const authToken = localStorage.getItem("token")
    const userId = user.id
  
    if (!authToken || !userId) {
      console.error("❌ Auth token or userId not found")
      setUploadingAvatar(false)
      return
    }
  
    try {
      // Get signed upload URL
      const res = await fetch("https://goomi-community-backend.onrender.com/api/s3-upload-url", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ fileName, fileType }),
      })
  
      if (!res.ok) {
        const errorText = await res.text()
        console.error("❌ Failed to get upload URL:", errorText)
        setUploadingAvatar(false)
        return
      }
  
      const { uploadUrl, fileUrl } = await res.json()
  
      // Upload file to S3
      await fetch(uploadUrl, {
        method: "PUT",
        headers: { "Content-Type": fileType },
        body: file,
      })
  
      // Update profile picture URL in database
      const updateRes = await fetch("https://goomi-community-backend.onrender.com/api/user/update-profile-picture-url", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ userId, profilePicture: fileUrl }),
      })
  
      if (!updateRes.ok) {
        const errorText = await updateRes.text()
        console.error("❌ Failed to update profile picture:", errorText)
        setUploadingAvatar(false)
        return
      }
  
      // Update local state
      setEditProfile(prev => ({ ...prev, avatar: fileUrl }))
      
      // Refresh profile data
      refetchProfile()
      
      console.log("✅ Avatar updated successfully")
    } catch (err) {
      console.error("❌ Upload failed", err)
    } finally {
      setUploadingAvatar(false)
    }
  }

  return (
    <div className="space-y-8">
      {/* Profile Title Card */}
      <div className="bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 rounded-3xl p-8 text-white shadow-xl">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="relative">
            <Image
              src={user.avatar || "/placeholder.svg"}
              alt={user.name}
              width={128}
              height={128}
              className="rounded-full border-4 border-white/30 shadow-xl"
            />
            {/* Profile completion indicator */}
            <div className="absolute -top-2 -right-2">
              {profileProgress.percentage === 100 ? (
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center border-2 border-white">
                  <CheckCircle size={16} className="text-white" />
                </div>
              ) : (
                <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center border-2 border-white">
                  <AlertCircle size={16} className="text-white" />
                </div>
              )}
            </div>
          </div>
          <div className="text-center md:text-left flex-1">
            <h1 className="text-4xl font-bold mb-2">{user.name}</h1>
            <p className="text-white/90 text-lg">{user.email}</p>
            <p className="text-sm text-white/70 mt-2">
              Member since {new Date(user.createdAt).toLocaleDateString()}
            </p>
            <div className="mt-4 flex flex-wrap gap-4">
              <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-1 border border-white/30">
                <ProfileProgressBadge
                  percentage={profileProgress.percentage}
                  completedFields={profileProgress.completedFields}
                  totalFields={profileProgress.totalFields}
                  showDetails={true}
                />
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-1 border border-white/30">
                <span className="font-bold">{user.stats?.totalCompetitions}</span>
                <span className="text-sm ml-1 text-white/90">Competitions</span>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-1 border border-white/30">
                <span className="font-bold">{user.stats?.overallGPA?.toFixed(2) || '0.00'}</span>
                <span className="text-sm ml-1 text-white/90">GPA</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <button 
              onClick={handleOpenEditProfile}
              className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 border border-white/30 transition-colors"
            >
              <Settings size={16} />
              <span>Edit Profile</span>
            </button>
            {profileProgress.percentage < 100 && (
              <button
                onClick={() => setShowProfileTips(!showProfileTips)}
                className="bg-yellow-500/20 backdrop-blur-sm hover:bg-yellow-500/30 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 border border-yellow-300/30 transition-colors text-sm"
              >
                <AlertCircle size={14} />
                <span>Complete Profile</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Profile Completion Tips */}
      {showProfileTips && profileProgress.percentage < 100 && (
        <ProfileCompletionSuggestions missingFields={profileProgress.missingFields} />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Updated Achievements Card with Tabs */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Achievements</h3>
          </div>
          
          {/* Achievement Tabs */}
          <div className="flex bg-gray-100 dark:bg-slate-700 rounded-lg p-1 mb-4">
            <button
              onClick={() => setActiveAchievementTab('completed')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md font-medium text-sm transition-colors ${
                activeAchievementTab === 'completed'
                  ? 'bg-white dark:bg-slate-600 text-purple-600 dark:text-purple-400 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              <Trophy size={16} />
              <span>Completed</span>
              {completedCount > 0 && (
                <span className={`ml-1 px-2 py-0.5 text-xs rounded-full ${
                  activeAchievementTab === 'completed' 
                    ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300'
                    : 'bg-gray-200 text-gray-600 dark:bg-gray-600 dark:text-gray-400'
                }`}>
                  {completedCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveAchievementTab('inProgress')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md font-medium text-sm transition-colors ${
                activeAchievementTab === 'inProgress'
                  ? 'bg-white dark:bg-slate-600 text-purple-600 dark:text-purple-400 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              <Clock size={16} />
              <span>In Progress</span>
              {inProgressCount > 0 && (
                <span className={`ml-1 px-2 py-0.5 text-xs rounded-full ${
                  activeAchievementTab === 'inProgress' 
                    ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300'
                    : 'bg-gray-200 text-gray-600 dark:bg-gray-600 dark:text-gray-400'
                }`}>
                  {inProgressCount}
                </span>
              )}
            </button>
          </div>

          {/* Achievement Content */}
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {achievements.length > 0 ? (
              achievements.map((achievement) => (
                <div key={achievement.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors">
                  <div className={`p-2 rounded-full ${
                    activeAchievementTab === 'completed' 
                      ? 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400'
                      : 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                  }`}>
                    {activeAchievementTab === 'completed' ? (
                      <Award size={16} />
                    ) : (
                      <Clock size={16} />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium text-sm text-gray-800 dark:text-gray-200 truncate">
                          {achievement.title}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {achievement.description}
                        </p>
                        {activeAchievementTab === 'completed' && achievement.unlockedAt && (
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            Completed on {new Date(achievement.unlockedAt).toLocaleDateString()}
                          </p>
                        )}
                        {activeAchievementTab === 'inProgress' && achievement.category && (
                          <div className="mt-2">
                            <span className="inline-block px-2 py-1 text-xs bg-gray-100 dark:bg-slate-600 text-gray-600 dark:text-gray-400 rounded-full">
                              {achievement.category}
                            </span>
                          </div>
                        )}
                      </div>
                      {achievement.tier && (
                        <span className={`ml-2 px-2 py-1 text-xs rounded-full font-medium ${
                          achievement.tier === 'platinum' ? 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300' :
                          achievement.tier === 'gold' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                          achievement.tier === 'silver' ? 'bg-gray-100 text-gray-600 dark:bg-gray-600 dark:text-gray-400' :
                          'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
                        }`}>
                          {achievement.tier}
                        </span>
                      )}
                    </div>
                    {achievement.progress && (
                      <div className="mt-2">
                        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                          <span>Progress</span>
                          <span>{achievement.progress.current} / {achievement.progress.target}</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                          <div 
                            className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
                            style={{ width: `${Math.min((achievement.progress.current / achievement.progress.target) * 100, 100)}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                {activeAchievementTab === 'completed' ? (
                  <>
                    <Trophy size={48} className="mx-auto text-gray-400 mb-3" />
                    <p className="text-gray-600 dark:text-gray-400 mb-1">No achievements unlocked yet</p>
                    <p className="text-sm text-gray-500 dark:text-gray-500">Complete competitions to earn achievements!</p>
                  </>
                ) : (
                  <>
                    <Clock size={48} className="mx-auto text-gray-400 mb-3" />
                    <p className="text-gray-600 dark:text-gray-400 mb-1">No competitions in progress</p>
                    <p className="text-sm text-gray-500 dark:text-gray-500">Start competing to track your progress!</p>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Bio Card */}
{/* Enhanced Bio Card */}
<div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 overflow-hidden">
  {/* Header with gradient accent */}
  <div className="relative">
    <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-pink-500/5 dark:from-purple-500/10 dark:to-pink-500/10"></div>
    <div className="relative flex items-center justify-between p-6 pb-4">
      <div className="flex items-center gap-2">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">About</h3>
        <div className="w-2 h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
      </div>
      <button 
        onClick={handleOpenEditProfile}
        className="flex items-center gap-1 text-sm text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 font-medium transition-colors"
      >
        <Settings size={14} />
        Edit
      </button>
    </div>
  </div>

  {user.bio && user.bio.trim() ? (
    <>
      {/* Quote decoration */}
      <div className="px-6 pb-2">
        <Award size={18} className="text-purple-300 dark:text-purple-600" />
      </div>

      {/* Bio content with enhanced styling */}
      <div className="px-6 pb-6">
        <div className="space-y-4">
          {/* Main bio text */}
          <div className="relative">
            <div className="prose prose-sm max-w-none dark:prose-invert">
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-base whitespace-pre-wrap font-light">
                {user.bio}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  ) : (
    /* Enhanced empty state */
    <div className="px-6 pb-6">
      <div className="text-center py-12">
        <div className="relative mb-6">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 rounded-full blur-2xl opacity-60"></div>
          <div className="relative bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/30 dark:to-pink-900/30 rounded-full p-4 w-20 h-20 mx-auto flex items-center justify-center">
            <UserIcon size={32} className="text-purple-500 dark:text-purple-400" />
          </div>
        </div>
        <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Share Your Story
        </h4>
        <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-xs mx-auto leading-relaxed">
          Let others know about your academic journey, interests, and what drives your passion for learning.
        </p>
        <button 
          onClick={handleOpenEditProfile}
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          <Settings size={16} />
          Add Your Bio
        </button>
      </div>
    </div>
  )}
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
                    className="w-full p-3 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Category *
                  </label>
                  <select
                    value={newCommunity.category}
                    onChange={(e) => setNewCommunity(prev => ({ ...prev, category: e.target.value as CommunityCategory | "" }))}
                    className="w-full p-3 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="">Select a category</option>
                    <option value="academic">Academic</option>
                    <option value="technology">Technology</option>
                    <option value="sports">Sports</option>
                    <option value="arts">Arts</option>
                    <option value="lifestyle">Lifestyle</option>
                    <option value="career">Career</option>
                    <option value="general">General</option>
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
                    className="w-full p-3 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
                    className="w-full p-3 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
                  className="w-full p-3 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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

      {/* Edit Profile Modal */}
      {showEditProfile && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Edit Profile</h3>
                <button
                  onClick={() => setShowEditProfile(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-full transition-colors"
                >
                  <X size={20} className="text-gray-600 dark:text-gray-300" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Display Name *
                  </label>
                  <input
                    type="text"
                    value={editProfile.name}
                    onChange={(e) => setEditProfile(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter your display name"
                    className="w-full p-3 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Bio
                  </label>
                  <textarea
                    value={editProfile.bio}
                    onChange={(e) => setEditProfile(prev => ({ ...prev, bio: e.target.value }))}
                    placeholder="Tell us about yourself..."
                    className="w-full p-3 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    rows={3}
                  />
                </div>

                {/* Avatar Section */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Profile Picture
                  </label>
                  
                  {/* Current Avatar Display */}
                  <div className="flex items-center gap-4 mb-4">
                    <Image
                      src={editProfile.avatar || user.avatar || "/placeholder.svg"}
                      alt="Profile picture"
                      width={64}
                      height={64}
                      className="rounded-full border-2 border-gray-200 dark:border-gray-600"
                      onError={(e) => {
                        e.currentTarget.src = "/placeholder.svg"
                      }}
                    />
                    <div className="flex-1">
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        Upload a new picture or provide an image URL
                      </p>
                      <div className="flex gap-2">
                        <label 
                          htmlFor="avatar-upload"
                          className={`inline-flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg border cursor-pointer transition-colors ${
                            uploadingAvatar 
                              ? 'bg-gray-100 text-gray-400 border-gray-300 cursor-not-allowed' 
                              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 dark:bg-slate-700 dark:text-gray-300 dark:border-slate-600 dark:hover:bg-slate-600'
                          }`}
                        >
                          {uploadingAvatar ? (
                            <>
                              <Loader2 className="animate-spin h-4 w-4" />
                              Uploading...
                            </>
                          ) : (
                            <>
                              <Upload className="h-4 w-4" />
                              Upload Image
                            </>
                          )}
                        </label>
                        <input
                          id="avatar-upload"
                          type="file"
                          accept="image/*"
                          onChange={handleAvatarUpload}
                          disabled={uploadingAvatar}
                          className="hidden"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleUpdateProfile}
                  disabled={!editProfile.name.trim() || updateProfileMutation.isLoading || uploadingAvatar}
                  className="flex-1 px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center justify-center gap-2"
                >
                  {updateProfileMutation.isLoading ? (
                    <>
                      <Loader2 className="animate-spin" size={18} />
                      Updating...
                    </>
                  ) : uploadingAvatar ? (
                    <>
                      <Loader2 className="animate-spin" size={18} />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Settings size={18} />
                      Update Profile
                    </>
                  )}
                </button>
                <button
                  onClick={() => setShowEditProfile(false)}
                  disabled={uploadingAvatar}
                  className="flex-1 px-4 py-3 bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-slate-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
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