// Re-export all types from domain-specific files
export * from './user'
export * from './academic'
export * from './competition'
export * from './activity'
export * from './task'
export * from './community'
export * from './achievement'
export * from './api'
export * from './evaluations'

// Legacy type mappings for backward compatibility
// These will be deprecated in future versions
import { ActivityCategory as NewActivityCategory } from './activity'
import { CompetitionCategory } from './competition'
import { Achievement } from './achievement'

// Map old ActivityCategory that was used for competitions to new structure
export type ActivityCategory = NewActivityCategory | "work" | "clubs"

// Legacy interfaces that extend new ones for compatibility
export interface Comment {
  id: string
  author: string
  role: "parent" | "mentor" | "teacher"
  content: string
  date: string
  sentiment: "positive" | "neutral" | "constructive"
}

export interface Event {
  id: string
  title: string
  description: string
  date: string
  time: string
  type: "class" | "meeting" | "deadline" | "competition" | "personal"
  priority: "low" | "medium" | "high"
}

// Dashboard specific types
export interface DashboardStats {
  currentGPA: number
  totalCredits: number
  currentStreak: number
  tasksCompleted: number
  upcomingDeadlines: number
  recentAchievements: Achievement[]
  weeklyProgress: {
    tasksCompleted: number
    hoursStudied: number
    activitiesAttended: number
  }
}

// Notification types
export interface Notification {
  id: string
  userId: string
  type: NotificationType
  title: string
  message: string
  data?: Record<string, any>
  read: boolean
  createdAt: string
}

export type NotificationType = 
  | 'task_reminder'
  | 'achievement_unlocked'
  | 'community_post'
  | 'comment_reply'
  | 'deadline_approaching'
  | 'streak_milestone'
  | 'weekly_report'
