export interface Competition {
  id: string
  userId: string
  name: string
  category: CompetitionCategory
  date: string
  placement: string
  participants?: number
  description?: string
  satisfaction?: number // 1-5 scale
  notes?: string
  insights?: CompetitionInsight[]
  aiInsights?: AICompetitionInsight[]
  createdAt: string
  updatedAt: string
}

export type CompetitionCategory = 
  | "academic"
  | "sports"
  | "arts"
  | "technology"
  | "business"
  | "community"
  | "other"

export interface CompetitionInsight {
  id: string
  competitionId: string
  content: string
  timestamp: string
}

export interface AICompetitionInsight {
  id: string
  competitionId: string
  content: string
  generatedAt: string
  context?: {
    placement: string
    category: string
    taskCompletion: number
  }
}

export interface CompetitionStats {
  total: number
  byCategory: Record<CompetitionCategory, number>
  averageSatisfaction: number
  bestPlacements: {
    competition: Competition
    placement: string
  }[]
  recentCompetitions: Competition[]
}

// Request Types
export interface CreateCompetitionRequest {
  name: string
  category: CompetitionCategory
  date: string
  placement: string
  participants?: number
  description?: string
  satisfaction?: number
  notes?: string
}

export interface UpdateCompetitionRequest {
  name?: string
  category?: CompetitionCategory
  date?: string
  placement?: string
  participants?: number
  description?: string
  satisfaction?: number
  notes?: string
}