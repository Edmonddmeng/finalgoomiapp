export interface Task {
  id: string
  userId: string
  title: string
  description?: string
  dueDate?: string
  priority: TaskPriority
  category: TaskCategory
  completed: boolean
  completedDate?: string
  relatedCompetitionId?: string
  relatedActivityId?: string
  tags?: string[]
  reminder?: TaskReminder
  createdAt: string
  updatedAt: string
}

export type TaskPriority = 'low' | 'medium' | 'high'

export type TaskCategory = 
  | 'academic'
  | 'competition'
  | 'activity'
  | 'personal'
  | 'other'

export interface TaskReminder {
  enabled: boolean
  time: string // ISO date string
  type: 'notification' | 'email' | 'both'
}

export interface TaskStats {
  total: number
  completed: number
  pending: number
  overdue: number
  completionRate: number
  streak: {
    current: number
    longest: number
    lastCompletedDate?: string
  }
  byCategory: Record<TaskCategory, {
    total: number
    completed: number
  }>
  upcomingDeadlines: Task[]
}

// Request Types
export interface CreateTaskRequest {
  title: string
  description?: string
  dueDate?: string
  priority: TaskPriority
  category: TaskCategory
  relatedCompetitionId?: string
  relatedActivityId?: string
  tags?: string[]
  reminder?: TaskReminder
}

export interface UpdateTaskRequest {
  title?: string
  description?: string
  dueDate?: string
  priority?: TaskPriority
  category?: TaskCategory
  completed?: boolean
  tags?: string[]
  reminder?: TaskReminder
}

export interface TaskFilters {
  status?: 'pending' | 'completed' | 'all'
  category?: TaskCategory
  priority?: TaskPriority
  dueDateRange?: {
    start: string
    end: string
  }
  search?: string
  tags?: string[]
}