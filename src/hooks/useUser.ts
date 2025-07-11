import { useAuth } from '@/contexts/AuthContext'
import { userService } from '@/services/userService'
import { useApiQuery, useApiMutation } from './useApiQuery'
import { User, UserSettings } from '@/types/user'
import { DashboardStats } from '@/types'

export function useUserProfile() {
  const { user, updateUser } = useAuth()
  
  const query = useApiQuery(
    () => userService.getProfile(),
    [],
    {
      initialData: user || undefined,
      onSuccess: (data) => updateUser(data)
    }
  )

  return query
}

export function useUpdateProfile() {
  const { updateUser } = useAuth()
  
  return useApiMutation(
    (data: Partial<User>) => userService.updateProfile(data),
    {
      onSuccess: (updatedUser) => {
        updateUser(updatedUser)
      }
    }
  )
}

export function useUploadAvatar() {
  const { user, updateUser } = useAuth()
  
  return useApiMutation(
    (file: File) => userService.uploadAvatar(file),
    {
      onSuccess: (data) => {
        if (user) {
          updateUser({ ...user, avatar: data.avatarUrl })
        }
      }
    }
  )
}

export function useUserSettings() {
  return useApiQuery(() => userService.getSettings())
}

export function useUpdateSettings() {
  return useApiMutation(
    (settings: Partial<UserSettings>) => userService.updateSettings(settings)
  )
}

export function useGrandGoal() {
  return useApiQuery(() => userService.getGrandGoal())
}

export function useUpdateGrandGoal() {
  return useApiMutation(
    (content: string) => userService.updateGrandGoal(content)
  )
}

export function useDashboardStats() {
  return useApiQuery(
    () => userService.getDashboardStats(),
    [],
    {
      refetchInterval: 60000 // Refetch every minute
    }
  )
}

export function useExportUserData() {
  return useApiMutation(
    () => userService.exportData(),
    {
      onSuccess: (blob) => {
        // Trigger download
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `goomi-data-${new Date().toISOString().split('T')[0]}.json`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      }
    }
  )
}