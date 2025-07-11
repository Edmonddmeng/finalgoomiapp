export interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  unlockedAt: string
  category: AchievementCategory
  points: number
  tier?: 'bronze' | 'silver' | 'gold' | 'platinum'
  progress?: {
    current: number
    target: number
  }
}

export type AchievementCategory = 
  | 'academic' 
  | 'competition' 
  | 'activity' 
  | 'community' 
  | 'streak'
  | 'milestone'

export interface AchievementNotification {
  achievement: Achievement
  timestamp: string
  seen: boolean
}