
// lib/settingsApi.ts - API service helper for settings (Updated for existing apiClient)
import { apiClient, ApiError } from './apiClient'

export interface UserSettings {
  dark_mode: boolean
  theme_color: string
  profile_visibility: string
  show_online_status: boolean
  allow_messages_from: string
  language: string
  timezone: string
  date_format: string
  auto_save_drafts: boolean
  enable_sounds: boolean
}

export interface NotificationSettings {
  task_reminders: boolean
  achievements: boolean
  weekly_reports: boolean
  community_updates: boolean
  new_messages: boolean
  new_followers: boolean
  post_likes: boolean
  post_comments: boolean
  email_task_reminders: boolean
  email_achievements: boolean
  email_weekly_reports: boolean
  email_community_updates: boolean
  email_new_messages: boolean
  email_marketing: boolean
  push_enabled: boolean
  push_sound: boolean
  push_vibration: boolean
}

export interface UserProfile {
  id: string
  username: string
  email: string
  bio?: string
  profile_picture?: string
  created_at: string
}

export interface SecuritySettings {
  two_factor_enabled: boolean
  last_password_change: string
  login_alerts: boolean
  suspicious_activity_alerts: boolean
  session_timeout_minutes: number
  data_collection_consent: boolean
  analytics_consent: boolean
  marketing_consent: boolean
}

export interface SettingsResponse {
  user: UserProfile
  settings: UserSettings
  notifications: NotificationSettings
  security: SecuritySettings
}

export class SettingsAPI {
  /**
   * Get all user settings
   */
  static async getAllSettings(): Promise<SettingsResponse> {
    try {
      const response = await apiClient.get('/settings')
      return response.data
    } catch (error) {
      if (error instanceof ApiError) {
        throw error
      }
      throw new ApiError('Failed to fetch settings', 'FETCH_ERROR')
    }
  }

  /**
   * Update general settings
   */
  static async updateGeneralSettings(updates: Partial<UserSettings>) {
    try {
      const response = await apiClient.put('/settings/general', updates)
      return response.data
    } catch (error) {
      if (error instanceof ApiError) {
        throw error
      }
      throw new ApiError('Failed to update general settings', 'UPDATE_ERROR')
    }
  }

  /**
   * Update notification settings
   */
  static async updateNotificationSettings(updates: Partial<NotificationSettings>) {
    try {
      const response = await apiClient.put('/settings/notifications', updates)
      return response.data
    } catch (error) {
      if (error instanceof ApiError) {
        throw error
      }
      throw new ApiError('Failed to update notification settings', 'UPDATE_ERROR')
    }
  }

  /**
   * Update user profile
   */
  static async updateProfile(updates: { username?: string; email?: string; bio?: string }) {
    try {
      const response = await apiClient.put('/settings/profile', updates)
      return response.data
    } catch (error) {
      if (error instanceof ApiError) {
        throw error
      }
      throw new ApiError('Failed to update profile', 'UPDATE_ERROR')
    }
  }

  /**
   * Reset password using access token (matches your existing backend)
   */
  static async resetPassword(accessToken: string, newPassword: string) {
    try {
      const response = await apiClient.post('/auth/reset-password', {
        accesstoken: accessToken, // Note: lowercase 't' to match your backend
        newPassword: newPassword
      })
      console.log('Password updated successfully new password 2', newPassword)
      return response.data
    } catch (error) {
      if (error instanceof ApiError) {
        throw error
      }
      throw new ApiError('Failed to reset password', 'PASSWORD_ERROR')
    }
  }

  /**
   * Setup two-factor authentication
   */
  static async setup2FA(action: 'enable' | 'disable') {
    try {
      const response = await apiClient.post('/settings/2fa/setup', { action })
      return response.data
    } catch (error) {
      if (error instanceof ApiError) {
        throw error
      }
      throw new ApiError('Failed to setup 2FA', '2FA_ERROR')
    }
  }

  /**
   * Verify two-factor authentication
   */
  static async verify2FA(token: string) {
    try {
      const response = await apiClient.post('/settings/2fa/verify', { token })
      return response.data
    } catch (error) {
      if (error instanceof ApiError) {
        throw error
      }
      throw new ApiError('Failed to verify 2FA', '2FA_ERROR')
    }
  }

  /**
   * Request data export
   */
  static async requestDataExport(exportType: 'full' | 'posts' | 'messages' | 'profile') {
    try {
      const response = await apiClient.post('/settings/data-export', { exportType })
      return response.data
    } catch (error) {
      if (error instanceof ApiError) {
        throw error
      }
      throw new ApiError('Failed to request data export', 'EXPORT_ERROR')
    }
  }

  /**
   * Get user activity logs
   */
  static async getActivityLogs(page = 1, limit = 50) {
    try {
      const response = await apiClient.get(`/settings/activity-logs?page=${page}&limit=${limit}`)
      return response.data
    } catch (error) {
      if (error instanceof ApiError) {
        throw error
      }
      throw new ApiError('Failed to fetch activity logs', 'FETCH_ERROR')
    }
  }

  /**
   * Delete user account
   */
  static async deleteAccount(data: { password: string; confirmText: string }) {
    try {
      const response = await apiClient.delete('/settings/account', { data })
      return response.data
    } catch (error) {
      if (error instanceof ApiError) {
        throw error
      }
      throw new ApiError('Failed to delete account', 'DELETE_ERROR')
    }
  }
}

// Hook for using settings API with React
import { useState, useEffect } from 'react'

export function useSettings() {
  const [data, setData] = useState<SettingsResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchSettings = async () => {
    try {
      setLoading(true)
      setError(null)
      const settings = await SettingsAPI.getAllSettings()
      setData(settings)
    } catch (err: any) {
      if (err instanceof ApiError) {
        setError(err.message)
      } else {
        setError('Failed to load settings')
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSettings()
  }, [])

  const updateGeneralSettings = async (updates: Partial<UserSettings>) => {
    try {
      await SettingsAPI.updateGeneralSettings(updates)
      if (data) {
        setData({
          ...data,
          settings: { ...data.settings, ...updates }
        })
      }
    } catch (err: any) {
      if (err instanceof ApiError) {
        throw new Error(err.message)
      } else {
        throw new Error('Failed to update settings')
      }
    }
  }

  const updateNotifications = async (updates: Partial<NotificationSettings>) => {
    try {
      await SettingsAPI.updateNotificationSettings(updates)
      if (data) {
        setData({
          ...data,
          notifications: { ...data.notifications, ...updates }
        })
      }
    } catch (err: any) {
      if (err instanceof ApiError) {
        throw new Error(err.message)
      } else {
        throw new Error('Failed to update notifications')
      }
    }
  }

  const updateProfile = async (updates: { username?: string; email?: string; bio?: string }) => {
    try {
      const result = await SettingsAPI.updateProfile(updates)
      if (data) {
        setData({
          ...data,
          user: result.user
        })
      }
    } catch (err: any) {
      if (err instanceof ApiError) {
        throw new Error(err.message)
      } else {
        throw new Error('Failed to update profile')
      }
    }
  }

  /**
   * Reset password using the existing backend endpoint
   */
  const resetPassword = async (accessToken: string, newPassword: string) => {
    try {
      await SettingsAPI.resetPassword(accessToken, newPassword)
      // Update the last password change date
      if (data) {
        setData({
          ...data,
          security: {
            ...data.security,
            last_password_change: new Date().toISOString()
          }
        })
      }
    } catch (err: any) {
      if (err instanceof ApiError) {
        throw new Error(err.message)
      } else {
        throw new Error('Failed to reset password')
      }
    }
  }

  return {
    data,
    loading,
    error,
    refetch: fetchSettings,
    updateGeneralSettings,
    updateNotifications,
    updateProfile,
    resetPassword
  }
}