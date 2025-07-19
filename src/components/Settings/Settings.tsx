
"use client"

import { useState, useEffect } from "react"
import { 
  Moon, 
  Sun, 
  Bell, 
  Shield, 
  User, 
  Palette, 
  Globe, 
  HelpCircle, 
  LogOut, 
  Loader2,
  Check,
  X,
  AlertCircle,
  Download,
  Trash2
} from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { apiClient, ApiError, setAuthToken } from "@/lib/apiClient"
import { useToast } from "@/components/Utils/Toast" // Add this import


interface UserSettings {
  dark_mode: boolean
  theme_color: string
  profile_visibility: string
  show_online_status: boolean
  language: string
  timezone: string
}

interface NotificationSettings {
  task_reminders: boolean
  achievements: boolean
  weekly_reports: boolean
  community_updates: boolean
  new_messages: boolean
  email_new_messages: boolean
  push_enabled: boolean
}

interface UserProfile {
  id: string
  username: string
  email: string
  bio?: string
  profile_picture?: string
  created_at: string
}

interface SecuritySettings {
  two_factor_enabled: boolean
  last_password_change: string
  login_alerts: boolean
}

export function Settings() {
  const { user, logout, refreshAuth } = useAuth()
  const { success, error: showToastError } = useToast() // Add this line
  
  // State management
  const [loading, setLoading] = useState(true)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [settings, setSettings] = useState<UserSettings | null>(null)
  const [notifications, setNotifications] = useState<NotificationSettings | null>(null)
  const [security, setSecurity] = useState<SecuritySettings | null>(null)
  
  // UI state
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [updating, setUpdating] = useState<string | null>(null) // Track which section is updating
  
  // Modal states
  const [showEmailModal, setShowEmailModal] = useState(false)
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [showUsernameModal, setShowUsernameModal] = useState(false)
  const [showDataExportModal, setShowDataExportModal] = useState(false)
  const [showDeleteAccountModal, setShowDeleteAccountModal] = useState(false)

  // Form states
  const [emailForm, setEmailForm] = useState({ email: "" })
  const [passwordForm, setPasswordForm] = useState({
    newPassword: "",
    confirmPassword: ""
  })
  const [usernameForm, setUsernameForm] = useState({ username: "" })
  
  // Modal-specific error states
  const [passwordModalError, setPasswordModalError] = useState<string | null>(null)
  const [shouldLogoutAfterPasswordChange, setShouldLogoutAfterPasswordChange] = useState(false)

  // Fetch all settings on component mount
  useEffect(() => {
    if (user) {
      fetchAllSettings()
    }
  }, [user])

  // Handle logout after password change
  useEffect(() => {
    if (shouldLogoutAfterPasswordChange) {
      const logoutTimer = setTimeout(() => {
        handleLogout().catch((error) => {
          console.error('Logout after password change failed:', error)
          // Force redirect if handleLogout fails
          window.location.href = '/login'
        })
      }, 2000)

      return () => clearTimeout(logoutTimer)
    }
  }, [shouldLogoutAfterPasswordChange])

  const fetchAllSettings = async () => {
    try {
      setLoading(true)
      const response = await apiClient.get('/settings')
      
      if (response.data) {
        const data = response.data
        setUserProfile(data.user)
        setSettings(data.settings)
        setNotifications(data.notifications)
        setSecurity(data.security)
        
        // Initialize form values
        setEmailForm({ email: data.user.email })
        setUsernameForm({ username: data.user.username })
      }
    } catch (error: any) {
      console.error('Failed to fetch settings:', error)
      
      if (error instanceof ApiError) {
        setError(error.message)
      } else {
        setError('Failed to load settings. Please refresh the page.')
      }
    } finally {
      setLoading(false)
    }
  }

  const showSuccess = (message: string) => {
    setSuccessMessage(message)
    setError(null)
    setTimeout(() => setSuccessMessage(null), 3000)
  }

  const showError = (message: string) => {
    setError(message)
    setSuccessMessage(null)
    setTimeout(() => setError(null), 5000)
  }

  // Update general settings
  const updateGeneralSettings = async (updates: Partial<UserSettings>) => {
    try {
      setUpdating('general')
      const response = await apiClient.put('/settings/general', updates)
      
      if (response.data) {
        setSettings(prev => ({ ...prev, ...updates } as UserSettings))
        showSuccess('Settings updated successfully!')
      }
    } catch (error: any) {
      if (error instanceof ApiError) {
        showError(error.message)
      } else {
        showError('Failed to update settings')
      }
    } finally {
      setUpdating(null)
    }
  }

  // Update notification settings
  const updateNotificationSettings = async (key: keyof NotificationSettings, value: boolean) => {
    try {
      setUpdating('notifications')
      const updates = { [key]: value }
      const response = await apiClient.put('/settings/notifications', updates)
      
      if (response.data) {
        setNotifications(prev => ({ ...prev, [key]: value } as NotificationSettings))
        showSuccess('Notification preferences updated!')
      }
    } catch (error: any) {
      if (error instanceof ApiError) {
        showError(error.message)
      } else {
        showError('Failed to update notifications')
      }
    } finally {
      setUpdating(null)
    }
  }

  // Handle dark mode toggle
  const toggleDarkMode = () => {
    const newValue = !settings?.dark_mode
    updateGeneralSettings({ dark_mode: newValue })
  }

  // Handle theme color change
  const handleThemeColorChange = (color: string) => {
    updateGeneralSettings({ theme_color: color })
  }

  // Handle notification toggle
  const handleNotificationToggle = (key: keyof NotificationSettings) => {
    const currentValue = notifications?.[key] || false
    updateNotificationSettings(key, !currentValue)
  }

  // Update email
  const handleEmailUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setUpdating('email')
      const response = await apiClient.put('/settings/profile', {
        email: emailForm.email
      })
      
      if (response.data) {
        setUserProfile(response.data.user)
        setShowEmailModal(false)
        showSuccess('Email updated successfully!')
      }
    } catch (error: any) {
      if (error instanceof ApiError) {
        showError(error.message)
      } else {
        showError('Failed to update email')
      }
    } finally {
      setUpdating(null)
    }
  }

  // Update password - Updated with Toast integration and state-based logout
  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Check if passwords match using Toast for error
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      showToastError('Password Mismatch', 'New passwords do not match')
      return
    }

    if (passwordForm.newPassword.length < 6) {
      showToastError('Invalid Password', 'Password must be at least 6 characters long')
      return
    }

    try {
      setUpdating('password')
      
      const token = localStorage.getItem('token')

      const response = await apiClient.post('/auth/reset-password', {
        accesstoken: token,
        newPassword: passwordForm.newPassword
      })
      
      if (response.data || response.status === 200) {
        setShowPasswordModal(false)
        setPasswordForm({ newPassword: "", confirmPassword: "" })
        
        // Show success toast
        success('Password Updated', 'Your password has been updated successfully. Please login again.')
        
        // Update the last password change date in security settings
        if (security) {
          setSecurity({
            ...security,
            last_password_change: new Date().toISOString()
          })
        }

        console.log('Password updated successfully new password 1', passwordForm.newPassword)
        
        // Trigger logout after showing toast
        setShouldLogoutAfterPasswordChange(true)
      }
    } catch (error: any) {
      if (error instanceof ApiError) {
        showToastError('Update Failed', error.message)
      } else {
        showToastError('Update Failed', 'Failed to update password')
      }
    } finally {
      setUpdating(null)
    }
  }

  // Update username
  const handleUsernameUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setUpdating('username')
      const response = await apiClient.put('/settings/profile', {
        username: usernameForm.username
      })
      
      if (response.data) {
        setUserProfile(response.data.user)
        setShowUsernameModal(false)
        showSuccess('Username updated successfully!')
      }
    } catch (error: any) {
      if (error instanceof ApiError) {
        showError(error.message)
      } else {
        showError('Failed to update username')
      }
    } finally {
      setUpdating(null)
    }
  }

  // Toggle 2FA
  const toggle2FA = async () => {
    try {
      setUpdating('2fa')
      const action = security?.two_factor_enabled ? 'disable' : 'enable'
      const response = await apiClient.post('/settings/2fa/setup', { action })
      
      if (response.data || response.status === 200) {
        setSecurity(prev => ({
          ...prev!,
          two_factor_enabled: !prev?.two_factor_enabled
        }))
        showSuccess(`Two-factor authentication ${action}d successfully!`)
      }
    } catch (error: any) {
      if (error instanceof ApiError) {
        showError(error.message)
      } else {
        showError('Failed to update 2FA settings')
      }
    } finally {
      setUpdating(null)
    }
  }

  // Request data export
  const requestDataExport = async (exportType: string) => {
    try {
      setUpdating('export')
      const response = await apiClient.post('/settings/data-export', { exportType })
      
      if (response.data || response.status === 200) {
        setShowDataExportModal(false)
        showSuccess('Data export requested successfully! You will receive an email when ready.')
      }
    } catch (error: any) {
      if (error instanceof ApiError) {
        showError(error.message)
      } else {
        showError('Failed to request data export')
      }
    } finally {
      setUpdating(null)
    }
  }

  // Handle logout
  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          <span className="ml-2 text-gray-600">Loading settings...</span>
        </div>
      </div>
    )
  }

  if (!userProfile || !settings || !notifications) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center py-12">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <p className="text-red-600 mb-4">Failed to load settings</p>
          <button
            onClick={fetchAllSettings}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  const themeColors = [
    { name: 'blue', class: 'bg-blue-500' },
    { name: 'purple', class: 'bg-purple-500' },
    { name: 'green', class: 'bg-green-500' },
    { name: 'red', class: 'bg-red-500' },
    { name: 'orange', class: 'bg-orange-500' }
  ]

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Success/Error Messages */}
      {successMessage && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-2">
          <Check className="w-5 h-5 text-green-600" />
          <span className="text-green-800">{successMessage}</span>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-red-600" />
          <span className="text-red-800">{error}</span>
        </div>
      )}

      {/* Header */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-slate-700">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Manage your account preferences and app settings
        </p>
      </div>

      {/* Account Section */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-slate-700">
        <div className="flex items-center gap-3 mb-6">
          <User className="text-blue-600 dark:text-blue-400" size={24} />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Account</h2>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-slate-700">
            <div>
              <p className="font-medium text-gray-900 dark:text-white">Email</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{userProfile.email}</p>
            </div>
          </div>
          
          <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-slate-700">
            <div>
              <p className="font-medium text-gray-900 dark:text-white">Password</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Last changed {new Date(security?.last_password_change || '').toLocaleDateString()}
              </p>
            </div>
            <button
              onClick={() => setShowPasswordModal(true)}
              disabled={updating === 'password'}
              className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 disabled:opacity-50"
            >
              {updating === 'password' ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Update'}
            </button>
          </div>
          
          <div className="flex items-center justify-between py-3">
            <div>
              <p className="font-medium text-gray-900 dark:text-white">Username</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">@{userProfile.username}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Notifications Section */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-slate-700">
        <div className="flex items-center gap-3 mb-6">
          <Bell className="text-yellow-600 dark:text-yellow-400" size={24} />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Notifications</h2>
        </div>
        
        <div className="space-y-4">
          {[
            { key: 'task_reminders' as keyof NotificationSettings, title: 'Task Reminders', desc: 'Get notified about upcoming tasks' },
            { key: 'achievements' as keyof NotificationSettings, title: 'Achievement Alerts', desc: 'Celebrate your accomplishments' },
            { key: 'weekly_reports' as keyof NotificationSettings, title: 'Weekly Progress Reports', desc: 'Receive weekly summary emails' },
            { key: 'community_updates' as keyof NotificationSettings, title: 'Community Updates', desc: 'Stay updated with community posts' }
          ].map(({ key, title, desc }) => (
            <div key={key} className="flex items-center justify-between py-2">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">{title}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{desc}</p>
              </div>
              <button
                onClick={() => handleNotificationToggle(key)}
                disabled={updating === 'notifications'}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors disabled:opacity-50 ${
                  notifications[key] ? 'bg-green-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    notifications[key] ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Other Options */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-slate-700">
        <div className="space-y-2">
          <button className="w-full flex items-center gap-3 py-3 px-3 hover:bg-gray-50 dark:hover:bg-slate-700 rounded-lg transition-colors">
            <Globe className="text-gray-600 dark:text-gray-400" size={20} />
            <span className="font-medium text-gray-900 dark:text-white">Language & Region</span>
          </button>
          
          <button className="w-full flex items-center gap-3 py-3 px-3 hover:bg-gray-50 dark:hover:bg-slate-700 rounded-lg transition-colors">
            <HelpCircle className="text-gray-600 dark:text-gray-400" size={20} />
            <span className="font-medium text-gray-900 dark:text-white">Help & Support</span>
          </button>
          
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 py-3 px-3 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors group"
          >
            <LogOut className="text-gray-600 dark:text-gray-400 group-hover:text-red-600 dark:group-hover:text-red-400" size={20} />
            <span className="font-medium text-gray-900 dark:text-white group-hover:text-red-600 dark:group-hover:text-red-400">
              Sign Out
            </span>
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center py-6">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Version 1.0.0 • © 2025 Goomi
        </p>
      </div>

      {/* Password Modal - Updated with Toast integration */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-lg max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Change Password</h3>
              <button
                onClick={() => setShowPasswordModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handlePasswordUpdate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                  placeholder="Enter new password"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:border-slate-600 text-black"
                  required
                  minLength={6}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  placeholder="Confirm new password"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:border-slate-600 text-black"
                  required
                  minLength={6}
                />
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Password must be at least 6 characters long.
              </div>
              <div className="flex gap-2 mt-4">
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 dark:border-slate-600 dark:hover:bg-slate-700 text-black"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updating === 'password'}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {updating === 'password' && <Loader2 className="w-4 h-4 animate-spin" />}
                  Update Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

{/* Username Modal */}
      {showUsernameModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-lg max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Change Username</h3>
              <button
                onClick={() => setShowUsernameModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleUsernameUpdate}>
              <input
                type="text"
                value={usernameForm.username}
                onChange={(e) => setUsernameForm({ username: e.target.value })}
                placeholder="New username"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                required
              />
              <div className="flex gap-2 mt-4">
                <button
                  type="button"
                  onClick={() => setShowUsernameModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 dark:border-slate-600 dark:hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updating === 'username'}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {updating === 'username' && <Loader2 className="w-4 h-4 animate-spin" />}
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
        )}

      {/* Data Export Modal */}
      {showDataExportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-lg max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Export Data</h3>
              <button
                onClick={() => setShowDataExportModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Choose what data you'd like to export. You'll receive an email when it's ready.
            </p>
            <div className="space-y-2">
              {[
                { key: 'full', title: 'Complete Account Data', desc: 'All your data including posts, messages, and settings' },
                { key: 'posts', title: 'Posts Only', desc: 'Your posts and comments' },
                { key: 'messages', title: 'Messages Only', desc: 'Your chat messages' },
                { key: 'profile', title: 'Profile Only', desc: 'Your profile information and settings' }
              ].map(({ key, title, desc }) => (
                <button
                  key={key}
                  onClick={() => requestDataExport(key)}
                  disabled={updating === 'export'}
                  className="w-full text-left p-3 border border-gray-200 dark:border-slate-600 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors disabled:opacity-50"
                >
                  <div className="font-medium text-gray-900 dark:text-white">{title}</div>,
                  <div className="text-sm text-gray-500 dark:text-gray-400">{desc}</div>
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowDataExportModal(false)}
              className="w-full mt-4 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 dark:border-slate-600 dark:hover:bg-slate-700"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
