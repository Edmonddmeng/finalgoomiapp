
import { useParams, useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { useUserById } from '@/hooks/useUser'
import { useSavedProfiles } from '@/hooks/useSavedProfiles'
import { 
  Loader2, 
  User, 
  Heart, 
  MessageCircle, 
  Calendar, 
  Mail, 
  Shield, 
  BookOpen, 
  MessageSquare,
  Edit
} from 'lucide-react'

export default function UserProfile() {
  const { user } = useAuth()
  const params = useParams()
  const router = useRouter()
  const targetUserId = params.userId as string
  
  const { data: userData, isLoading: loading, error } = useUserById(targetUserId)
  const { isSaved, toggleSave, isLoading: saving } = useSavedProfiles()

  const handleToggleSave = async () => {
    if (!user || !targetUserId) return
    
    try {
      await toggleSave(targetUserId)
    } catch (error) {
      console.error("❌ Failed to toggle save:", error)
    }
  }

  const handleMessage = () => {
    router.push(`/chat/${targetUserId}`)
  }

  const handleEditProfile = () => {
    router.push('/profile/edit')
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    )
  }

  if (error || !userData) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-center">
          <User className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">
            {error?.message || "Failed to load user profile"}
          </p>
        </div>
      </div>
    )
  }

  const isOwnProfile = userData.id === user?.id

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 h-32"></div>
          
          {/* Profile Content */}
          <div className="relative px-6 pb-6">
            {/* Profile Picture */}
            <div className="relative -mt-16 mb-4">
              <img
                src={userData.avatar || userData.profile_picture || "/default-avatar.png"}
                alt={`${userData.username}'s profile`}
                className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover mx-auto"
              />
              {isOwnProfile && (
                <div className="absolute bottom-0 right-1/2 translate-x-16 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700 transition-colors">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>

            {/* User Info */}
            <div className="text-center mb-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {userData.username}
                {isOwnProfile && (
                  <span className="text-sm text-blue-600 ml-2 font-normal">(You)</span>
                )}
              </h1>
              <div className="flex items-center justify-center gap-2 text-gray-600 mb-2">
                <Mail className="h-4 w-4" />
                <span>{userData.email}</span>
              </div>
              {/* <div className="flex items-center justify-center gap-2 text-gray-500">
                <Shield className="h-4 w-4" />
                <span className="capitalize">{userData.role ?? "User"}</span>
              </div> */}
            </div>

            {/* Bio Section */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center gap-2">
                <User className="h-5 w-5" />
                About
              </h3>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {userData.bio || "No bio provided."}
              </p>
            </div>

            {/* Activity Stats */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="text-center bg-blue-50 rounded-lg p-4 hover:bg-blue-100 transition-colors">
                <BookOpen className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-blue-600">{userData.postsCount ?? 0}</div>
                <div className="text-sm text-blue-600">Posts</div>
              </div>
              <div className="text-center bg-green-50 rounded-lg p-4 hover:bg-green-100 transition-colors">
                <MessageSquare className="h-6 w-6 text-green-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-green-600">{userData.commentsCount ?? 0}</div>
                <div className="text-sm text-green-600">Comments</div>
              </div>
              <div className="text-center bg-purple-50 rounded-lg p-4 hover:bg-purple-100 transition-colors">
                <Calendar className="h-6 w-6 text-purple-600 mx-auto mb-2" />
                <div className="text-sm font-medium text-purple-600">Joined</div>
                <div className="text-sm text-purple-600">
                  {new Date(userData.created_at).toLocaleDateString()}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            {!isOwnProfile && (
              <div className="flex gap-3">
                <button
                  onClick={handleToggleSave}
                  disabled={saving}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 ${
                    isSaved(targetUserId)
                      ? 'bg-red-100 text-red-700 hover:bg-red-200'
                      : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                  }`}
                >
                  {saving ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Heart className={`h-4 w-4 ${isSaved(targetUserId) ? 'fill-current' : ''}`} />
                  )}
                  {saving 
                    ? (isSaved(targetUserId) ? 'Removing...' : 'Saving...') 
                    : (isSaved(targetUserId) ? 'Unsave Profile' : 'Save Profile')
                  }
                </button>

                <button
                  onClick={handleMessage}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-green-100 text-green-700 hover:bg-green-200 rounded-lg font-medium transition-all duration-200"
                >
                  <MessageCircle className="h-4 w-4" />
                  Message
                </button>
              </div>
            )}

            {/* Edit Button for Own Profile */}
            {isOwnProfile && (
              <div className="flex justify-center">
                <button
                  onClick={handleEditProfile}
                  className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-all duration-200"
                >
                  <Edit className="h-4 w-4" />
                  Edit Profile
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}