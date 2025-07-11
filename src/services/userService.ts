import { apiClient } from '@/lib/apiClient'
import { User, UserSettings, UserStats } from '@/types/user'
import { DashboardStats } from '@/types'

class UserService {
  // Profile operations
  async getProfile(): Promise<User> {
    const response = await apiClient.get<User>('/users/profile')
    return response.data
  }

  async updateProfile(data: Partial<User>): Promise<User> {
    const response = await apiClient.put<User>('/users/profile', data)
    return response.data
  }

  async uploadAvatar(file: File): Promise<{ avatarUrl: string }> {
    const formData = new FormData()
    formData.append('avatar', file)

    const response = await apiClient.post<{ avatarUrl: string }>(
      '/users/avatar',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    )
    return response.data
  }

  // Settings operations
  async getSettings(): Promise<UserSettings> {
    const response = await apiClient.get<UserSettings>('/users/settings')
    return response.data
  }

  async updateSettings(settings: Partial<UserSettings>): Promise<UserSettings> {
    const response = await apiClient.put<UserSettings>('/users/settings', settings)
    return response.data
  }

  // Grand Goal operations
  async getGrandGoal(): Promise<string | null> {
    try {
      const response = await apiClient.get<{ content: string }>('/users/grand-goal')
      return response.data.content
    } catch (error: any) {
      if (error.code === 'NOT_FOUND') {
        return null
      }
      throw error
    }
  }

  async updateGrandGoal(content: string): Promise<void> {
    await apiClient.put('/users/grand-goal', { content })
  }

  // Dashboard and stats
  async getDashboardStats(): Promise<DashboardStats> {
    const response = await apiClient.get<DashboardStats>('/dashboard/stats')
    return response.data
  }

  async getUserStats(): Promise<UserStats> {
    const response = await apiClient.get<UserStats>('/users/stats')
    return response.data
  }

  // Account operations
  async deleteAccount(password: string): Promise<void> {
    await apiClient.delete('/users/account', {
      data: { password }
    })
  }

  async exportData(): Promise<Blob> {
    const response = await apiClient.get('/users/export', {
      responseType: 'blob'
    })
    return response.data
  }
}

export const userService = new UserService()