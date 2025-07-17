import { Achievement } from './achievement'

export interface User {
  id: string
  email: string
  name: string
  username: string
  avatar?: string
  bio?: string
  grade?: number
  school?: string
  progressLevel: number
  currentStreak: number
  totalPoints: number
  achievements: Achievement[]
  uncompletedAchievements: Achievement[]
  stats: UserStats
  createdAt: string
  updatedAt: string
  sat_score?: number
  act_score?: number
}

export interface UserStats {
  totalCompetitions: number
  totalActivities: number
  overallGPA: number
  tasksCompleted: number
  hoursStudied?: number
  communityPosts?: number
  satScore?: number
  actScore?: number
}

export interface UserSettings {
  notifications: NotificationSettings
  privacy: PrivacySettings
  appearance: AppearanceSettings
}

export interface NotificationSettings {
  taskReminders: boolean
  achievements: boolean
  weeklyReports: boolean
  communityUpdates: boolean
}

export interface PrivacySettings {
  profileVisibility: 'public' | 'private' | 'friends'
  showAchievements: boolean
  showStats: boolean
}

export interface AppearanceSettings {
  theme: 'light' | 'dark' | 'system'
  accentColor: string
}


// Authentication Types
export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  email: string
  password: string
  name: string
  username: string
}

export interface AuthTokens {
  accessToken: string
  refreshToken: string
}

export interface AuthResponse {
  user: User
  tokens: AuthTokens
}