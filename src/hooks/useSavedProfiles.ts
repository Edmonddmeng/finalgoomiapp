// // hooks/useSavedProfiles.ts
// import { useState, useEffect } from 'react'
// import { savedProfilesService, SavedProfile } from '@/services/savedProfilesService'
// import { useApiQuery, useApiMutation } from './useApiQuery'

// export function useSavedProfiles() {
//   const [savedProfileIds, setSavedProfileIds] = useState<Set<string>>(new Set())

//   // Fetch saved profiles on mount
//   const { data: savedProfiles, isLoading } = useApiQuery(
//     () => savedProfilesService.getSavedProfiles(),
//     [],
//     {
//       onSuccess: (profiles) => {
//         setSavedProfileIds(new Set(profiles.map(profile => profile.id)))
//       }
//     }
//   )

//   // Save profile mutation
//   const saveProfileMutation = useApiMutation(
//     (userId: string) => savedProfilesService.saveProfile(userId),
//     {
//       onSuccess: (_, userId) => {
//         setSavedProfileIds(prev => new Set(prev).add(userId))
//       }
//     }
//   )

//   // Remove saved profile mutation
//   const removeSavedProfileMutation = useApiMutation(
//     (userId: string) => savedProfilesService.removeSavedProfile(userId),
//     {
//       onSuccess: (_, userId) => {
//         setSavedProfileIds(prev => {
//           const newSet = new Set(prev)
//           newSet.delete(userId)
//           return newSet
//         })
//       }
//     }
//   )

//   const isSaved = (userId: string) => savedProfileIds.has(userId)

//   const toggleSave = async (userId: string) => {
//     if (isSaved(userId)) {
//       await removeSavedProfileMutation.mutateAsync(userId)
//     } else {
//       await saveProfileMutation.mutateAsync(userId)
//     }
//   }

//   const saving = saveProfileMutation.isLoading || removeSavedProfileMutation.isLoading

//   return {
//     savedProfiles: savedProfiles || [],
//     isSaved,
//     toggleSave,
//     saving,
//     isLoading
//   }
// }


// hooks/useSavedProfiles.ts - Enhanced version
import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/contexts/AuthContext'

export interface SavedProfile {
  id: string
  username: string
  email: string
  profile_picture?: string
  role?: string
  created_at: string
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://goomi-community-backend.onrender.com/api'

export function useSavedProfiles() {
  const { user } = useAuth()
  const [savedProfiles, setSavedProfiles] = useState<SavedProfile[]>([])
  const [savedProfileIds, setSavedProfileIds] = useState<Set<string>>(new Set())
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Fetch saved profiles
  const fetchSavedProfiles = useCallback(async () => {
    if (!user) return

    const token = localStorage.getItem('token')
    if (!token) return

    try {
      setIsLoading(true)
      setError(null)

      const response = await fetch(`${API_BASE_URL}/users/profile/saved`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error('Failed to fetch saved profiles')
      }

      const data = await response.json()
      const profiles = data.savedProfiles || []
      
      setSavedProfiles(profiles)
      setSavedProfileIds(new Set(profiles.map((p: SavedProfile) => p.id)))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch saved profiles')
      setSavedProfiles([])
      setSavedProfileIds(new Set())
    } finally {
      setIsLoading(false)
    }
  }, [user])

  // Save a profile
  const saveProfile = useCallback(async (userId: string): Promise<boolean> => {
    if (!user) return false

    const token = localStorage.getItem('token')
    if (!token) return false

    try {
      const response = await fetch(`${API_BASE_URL}/users/profile/save`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ saved_user_id: userId })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to save profile')
      }

      // Optimistically update the state
      setSavedProfileIds(prev => new Set(prev).add(userId))
      
      // Optionally refetch to get complete profile data
      fetchSavedProfiles()
      
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save profile')
      return false
    }
  }, [user, fetchSavedProfiles])

  // Remove a saved profile
  const removeSavedProfile = useCallback(async (userId: string): Promise<boolean> => {
    if (!user) return false

    const token = localStorage.getItem('token')
    if (!token) return false

    try {
      const response = await fetch(`${API_BASE_URL}/users/profile/remove`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ saved_user_id: userId })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to remove saved profile')
      }

      // Optimistically update the state
      setSavedProfileIds(prev => {
        const newSet = new Set(prev)
        newSet.delete(userId)
        return newSet
      })
      
      setSavedProfiles(prev => prev.filter(profile => profile.id !== userId))
      
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove saved profile')
      return false
    }
  }, [user])

  // Toggle save/unsave
  const toggleSave = useCallback(async (userId: string): Promise<boolean> => {
    if (savedProfileIds.has(userId)) {
      return await removeSavedProfile(userId)
    } else {
      return await saveProfile(userId)
    }
  }, [savedProfileIds, saveProfile, removeSavedProfile])

  // Check if a profile is saved
  const isSaved = useCallback((userId: string): boolean => {
    return savedProfileIds.has(userId)
  }, [savedProfileIds])

  // Load saved profiles on mount
  useEffect(() => {
    if (user) {
      fetchSavedProfiles()
    }
  }, [user, fetchSavedProfiles])

  return {
    savedProfiles,
    savedProfileIds,
    isLoading,
    error,
    isSaved,
    saveProfile,
    removeSavedProfile,
    toggleSave,
    refetch: fetchSavedProfiles,
    count: savedProfiles.length
  }
}