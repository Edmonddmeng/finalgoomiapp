export interface Activity {
  id: string
  userId: string
  name: string
  category: ActivityCategory
  role?: string
  description?: string
  startDate: string
  endDate?: string
  isActive: boolean
  hoursPerWeek?: number
  achievements?: string[]
  insights?: ActivityInsight[]
  aiInsights?: AIActivityInsight[]
  createdAt: string
  updatedAt: string
}

export type ActivityCategory = 
  | "sports"
  | "arts"
  | "volunteer"
  | "leadership"
  | "academic"
  | "professional"
  | "hobby"
  | "other"

export interface ActivityInsight {
  id: string
  activityId: string
  content: string
  timestamp: string
}

export interface AIActivityInsight {
  id: string
  activityId: string
  content: string
  generatedAt: string
  context?: {
    role: string
    duration: number // months
    hoursPerWeek: number
  }
}

export interface ActivityStats {
  total: number
  active: number
  totalHoursPerWeek: number
  byCategory: Record<ActivityCategory, number>
  longestDuration: {
    activity: Activity
    months: number
  }
  leadershipRoles: Activity[]
}

// Request Types
export interface CreateActivityRequest {
  name: string
  category: ActivityCategory
  role?: string
  description?: string
  startDate: string
  endDate?: string
  isActive: boolean
  hoursPerWeek?: number
  achievements?: string[]
}

export interface UpdateActivityRequest {
  name?: string
  category?: ActivityCategory
  role?: string
  description?: string
  startDate?: string
  endDate?: string
  isActive?: boolean
  hoursPerWeek?: number
  achievements?: string[]
}