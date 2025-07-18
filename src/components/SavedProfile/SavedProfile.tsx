
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { 
  Trash2, 
  Heart, 
  MessageCircle, 
  Calendar, 
  Mail, 
  Shield,
  Search,
  X,
  Loader2,
  Users
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { useConfirm } from '@/components/Utils/ConfirmDialog'
import { apiClient } from '@/lib/apiClient'
import ProfileModal from '../ProfileModal/ProfileModal'
import ChatModal from '@/components/ChatModal/ChatModal'

export interface SavedProfile {
  id: string
  username: string
  email: string
  profile_picture?: string
  role?: string
  created_at: string
}

export default function SavedProfiles() {
    // Add modal state
    const [profileModalOpen, setProfileModalOpen] = useState(false)
    const [selectedUserId, setSelectedUserId] = useState<string | null>(null)

    // Chat modal state
    const [chatModalOpen, setChatModalOpen] = useState(false)
    const [chatTargetUserId, setChatTargetUserId] = useState<string | null>(null)
    const [chatTargetUserName, setChatTargetUserName] = useState<string | null>(null)

    const handleViewProfile = (profileId: string) => {
      setSelectedUserId(profileId)
      setProfileModalOpen(true)
    }
  
    const handleCloseProfile = () => {
      setProfileModalOpen(false)
      setSelectedUserId(null)
    }

    // Add callbacks for when profile is saved/unsaved in modal
    const handleProfileUnsaved = (profileId: string) => {
      // Remove from local state immediately for better UX
      setSavedProfiles(prev => prev.filter(profile => profile.id !== profileId))
    }

    const handleProfileSaved = (profileData: any) => {
      // Create saved profile object from the profile data
      const savedProfile: SavedProfile = {
        id: profileData.id,
        username: profileData.username,
        email: profileData.email,
        profile_picture: profileData.avatar || profileData.profile_picture,
        role: profileData.role,
        created_at: profileData.created_at
      }
      
      // Add to local state immediately for better UX
      setSavedProfiles(prev => {
        // Check if already exists to avoid duplicates
        const exists = prev.some(profile => profile.id === profileData.id)
        if (exists) return prev
        return [...prev, savedProfile]
      })
    }

  // Chat modal handlers
  const handleOpenChat = (userId: string, userName?: string) => {
    setChatTargetUserId(userId)
    setChatTargetUserName(userName || null)
    setChatModalOpen(true)
  }

  const handleCloseChat = () => {
    setChatModalOpen(false)
    setChatTargetUserId(null)
    setChatTargetUserName(null)
  }
  const { user } = useAuth()
  const router = useRouter()
  const { confirm } = useConfirm()
  
  const [savedProfiles, setSavedProfiles] = useState<SavedProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [removingId, setRemovingId] = useState<string | null>(null)

  // Fetch saved profiles
  useEffect(() => {
    fetchSavedProfiles()
  }, [])

  const fetchSavedProfiles = async () => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/login')
      return
    }

    try {
      setLoading(true)
      const response = await apiClient.get('/users/profile/saved')

      if (response.status !== 200) {
        throw new Error('Failed to fetch saved profiles')
      }

      const data = response.data
      setSavedProfiles(data.savedProfiles || [])
    } catch (error) {
      console.error('Error fetching saved profiles:', error)
      setSavedProfiles([])
    } finally {
      setLoading(false)
    }
  }

  const handleRemoveProfile = async (profileId: string, username: string) => {
    const confirmed = await confirm({
      title: "Remove Saved Profile",
      message: `Are you sure you want to remove ${username} from your saved profiles?`,
      confirmText: "Remove",
      cancelText: "Cancel",
      type: "danger"
    })

    if (!confirmed) return

    const token = localStorage.getItem('token')
    if (!token) return

    try {
      setRemovingId(profileId)
      
      const response = await apiClient.delete('/users/profile/remove', {
        data: { saved_user_id: profileId }
      })

      if (response.status !== 200) {
        throw new Error('Failed to remove saved profile')
      }

      // Remove from local state
      setSavedProfiles(prev => prev.filter(profile => profile.id !== profileId))
    } catch (error) {
      console.error('Error removing saved profile:', error)
      alert('Failed to remove profile. Please try again.')
    } finally {
      setRemovingId(null)
    }
  }

  const handleMessageUser = (profileId: string) => {
    router.push(`/chat/${profileId}`)
  }

  // Filter profiles based on search term
  const filteredProfiles = savedProfiles.filter(profile =>
    profile.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    profile.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <p className="text-gray-600">Please log in to view your saved profiles.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Heart className="h-8 w-8 text-red-500" />
            <h1 className="text-3xl font-bold text-gray-900">Saved Profiles</h1>
          </div>
          <p className="text-gray-600">
            Manage the profiles you've saved for quick access
          </p>
        </div>

        {/* Search and Stats */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search saved profiles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2  text-gray-500 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Stats */}
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Users className="h-4 w-4" />
              <span>
                {filteredProfiles.length} of {savedProfiles.length} profiles
              </span>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            <span className="ml-2 text-gray-600">Loading saved profiles...</span>
          </div>
        ) : (
          <>
            {/* Empty State */}
            {savedProfiles.length === 0 ? (
              <div className="text-center py-12">
                <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Saved Profiles</h3>
                <p className="text-gray-600 mb-6">
                  You haven't saved any profiles yet. Start exploring and save profiles you're interested in!
                </p>
              </div>
            ) : (
              <>
                {/* No Search Results */}
                {filteredProfiles.length === 0 && searchTerm ? (
                  <div className="text-center py-12">
                    <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No Results Found</h3>
                    <p className="text-gray-600">
                      No saved profiles match your search for "{searchTerm}"
                    </p>
                  </div>
                ) : (
                  /* Profiles Grid */
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProfiles.map((profile) => (
                      <div
                        key={profile.id}
                        className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                      >
                        {/* Profile Header */}
                        <div className="p-6 pb-4">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <Image
                                src={profile.profile_picture || "/default-avatar.png"}
                                alt={`${profile.username}'s profile`}
                                width={48}
                                height={48}
                                className="rounded-full object-cover"
                              />
                              <div>
                                <h3 className="font-semibold text-gray-900">{profile.username}</h3>
                                <div className="flex items-center gap-1 text-sm text-gray-500">
                                  <Shield className="h-3 w-3" />
                                  <span className="capitalize">{profile.role || 'User'}</span>
                                </div>
                              </div>
                            </div>
                            
                            {/* Remove Button */}
                            <button
                              onClick={() => handleRemoveProfile(profile.id, profile.username)}
                              disabled={removingId === profile.id}
                              className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                              title="Remove from saved profiles"
                            >
                              {removingId === profile.id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Trash2 className="h-4 w-4" />
                              )}
                            </button>
                          </div>

                          {/* Profile Info */}
                          <div className="space-y-2 mb-4">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Mail className="h-4 w-4" />
                              <span className="truncate">{profile.email}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Calendar className="h-4 w-4" />
                              <span>Joined {new Date(profile.created_at).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleViewProfile(profile.id)}
                              className="flex-1 px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                            >
                              View Profile
                            </button>
                            <button
                              onClick={() => handleOpenChat(profile.id, profile.username)}
                              className="flex items-center justify-center px-3 py-2 bg-green-100 text-green-700 text-sm font-medium rounded-lg hover:bg-green-200 transition-colors"
                              title="Send message"
                            >
                              <MessageCircle className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
      <ProfileModal 
        isOpen={profileModalOpen}
        onClose={handleCloseProfile}
        userId={selectedUserId}
        onProfileUnsaved={handleProfileUnsaved}
        onProfileSaved={handleProfileSaved}
      />
      <ChatModal 
        isOpen={chatModalOpen}
        onClose={handleCloseChat}
        targetUserId={chatTargetUserId}
        targetUserName={chatTargetUserName || undefined}
      />
    </div>
  )
}