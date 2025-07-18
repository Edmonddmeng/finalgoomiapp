
// Updated ProfileModal component
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { 
  X,
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
import { useAuth } from '@/contexts/AuthContext'
import { useUserById } from '@/hooks/useUser'
import { useSavedProfiles } from '@/hooks/useSavedProfiles'
import ChatModal from '@/components/ChatModal/ChatModal'

interface ProfileModalProps {
  isOpen: boolean
  onClose: () => void
  userId: string | null
}

export default function ProfileModal({ isOpen, onClose, userId }: ProfileModalProps) {
  const { user } = useAuth()
  const router = useRouter()
  
  const { data: userData, isLoading: loading, error } = useUserById(userId || '')
  const { isSaved, toggleSave, isLoading: saving } = useSavedProfiles()

  // Chat modal state
  const [chatModalOpen, setChatModalOpen] = useState(false)

  // Close modal when clicking outside or pressing escape
  useEffect(() => {
    if (!isOpen) return

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }

    document.addEventListener('keydown', handleEscape)
    document.body.style.overflow = 'hidden' // Prevent background scroll

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  const handleToggleSave = async () => {
    if (!user || !userId) return
    
    try {
      await toggleSave(userId)
    } catch (error) {
      console.error("❌ Failed to toggle save:", error)
    }
  }

  // Updated to open chat modal instead of navigating
  const handleMessage = () => {
    setChatModalOpen(true)
  }

  const handleEditProfile = () => {
    onClose()
    router.push('/profile/edit')
  }

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  const handleCloseChatModal = () => {
    setChatModalOpen(false)
  }

  if (!isOpen) return null

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        {/* Backdrop with blur */}
        <div 
          className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
          onClick={handleBackdropClick}
        />
        
        {/* Modal Content */}
        <div className="relative bg-white dark:bg-slate-800 rounded-xl shadow-2xl max-w-md w-full mx-4 max-h-[90vh] overflow-hidden">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 bg-white dark:bg-slate-700 bg-opacity-90 dark:bg-opacity-90 rounded-full hover:bg-opacity-100 transition-all shadow-lg"
          >
            <X size={20} className="text-gray-600 dark:text-gray-300" />
          </button>

          {loading ? (
            <div className="flex justify-center items-center py-16">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
              <span className="ml-2 text-gray-600 dark:text-gray-300">Loading profile...</span>
            </div>
          ) : error || !userData ? (
            <div className="text-center py-16 px-6">
              <User className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-300 text-lg">
                {error?.message || "Failed to load user profile"}
              </p>
              <button
                onClick={onClose}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Close
              </button>
            </div>
          ) : (
            <>
              {/* Header Section */}
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 h-24 relative">
                {/* Profile Picture */}
                <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2">
                  <div className="relative">
                    <Image
                      src={userData.avatar || userData.profile_picture || "/default-avatar.png"}
                      alt={`${userData.username}'s profile`}
                      width={96}
                      height={96}
                      className="rounded-full border-4 border-white dark:border-slate-800 shadow-lg object-cover"
                    />
                    {userData.id === user?.id && (
                      <div className="absolute bottom-0 right-0 bg-blue-600 text-white p-1.5 rounded-full cursor-pointer hover:bg-blue-700 transition-colors">
                        <User className="w-3 h-3" />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Profile Content */}
              <div className="pt-16 pb-6 px-6">
                {/* User Info */}
                <div className="text-center mb-6">
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    {userData.username}
                    {userData.id === user?.id && (
                      <span className="text-sm text-blue-600 dark:text-blue-400 ml-2 font-normal">(You)</span>
                    )}
                  </h1>
                  <div className="flex items-center justify-center gap-2 text-gray-600 dark:text-gray-300 mb-2">
                    <Mail className="h-4 w-4" />
                    <span className="text-sm">{userData.email}</span>
                  </div>
                </div>

                {/* Bio Section */}
                {userData.bio && (
                  <div className="bg-gray-50 dark:bg-slate-700 rounded-lg p-4 mb-6">
                    <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2 flex items-center gap-2">
                      <User className="h-4 w-4" />
                      About
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed whitespace-pre-line">
                      {userData.bio || "No bio provided."}
                    </p>
                  </div>
                )}

                {/* Activity Stats */}
                <div className="grid grid-cols-3 gap-3 mb-6">
                  <div className="text-center bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors">
                    <BookOpen className="h-5 w-5 text-blue-600 mx-auto mb-1" />
                    <div className="text-lg font-bold text-blue-600">{userData.postsCount ?? 0}</div>
                    <div className="text-xs text-blue-600">Posts</div>
                  </div>
                  <div className="text-center bg-green-50 dark:bg-green-900/20 rounded-lg p-3 hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors">
                    <MessageSquare className="h-5 w-5 text-green-600 mx-auto mb-1" />
                    <div className="text-lg font-bold text-green-600">{userData.commentsCount ?? 0}</div>
                    <div className="text-xs text-green-600">Comments</div>
                  </div>
                  <div className="text-center bg-purple-50 dark:bg-purple-900/20 rounded-lg p-3 hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors">
                    <Calendar className="h-5 w-5 text-purple-600 mx-auto mb-1" />
                    <div className="text-xs font-medium text-purple-600">Joined</div>
                    <div className="text-xs text-purple-600">
                      {new Date(userData.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                {userData.id !== user?.id ? (
                  <div className="flex gap-3">
                    <button
                      onClick={handleToggleSave}
                      disabled={saving}
                      className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 text-sm ${
                        isSaved(userId!)
                          ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50'
                          : 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/50'
                      }`}
                    >
                      {saving ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Heart className={`h-4 w-4 ${isSaved(userId!) ? 'fill-current' : ''}`} />
                      )}
                      {saving 
                        ? (isSaved(userId!) ? 'Removing...' : 'Saving...') 
                        : (isSaved(userId!) ? 'Unsave' : 'Save')
                      }
                    </button>

                    <button
                      onClick={handleMessage}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/50 rounded-lg font-medium transition-all duration-200 text-sm"
                    >
                      <MessageCircle className="h-4 w-4" />
                      Message
                    </button>
                  </div>
                ) : (
                  <div className="flex justify-center">
                    <button
                      className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-all duration-200 text-sm"
                    >
                      <User className="h-4 w-4" />
                      My Profile
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Chat Modal - Opens on top of profile modal */}
      <ChatModal 
        isOpen={chatModalOpen}
        onClose={handleCloseChatModal}
        targetUserId={userId}
        targetUserName={userData?.username}
      />
    </>
  )
}