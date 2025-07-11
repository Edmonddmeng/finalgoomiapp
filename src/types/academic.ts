export interface Academic {
  id: string
  userId: string
  termId: string
  subject: string
  category: SubjectCategory
  grade: string
  gradePoint: number
  credits: number
  teacher?: string
  room?: string
  notes?: string
  createdAt: string
  updatedAt: string
}

export interface AcademicTerm {
  id: string
  userId: string
  name: string // e.g., "Fall", "Spring", "Summer"
  year: number
  startDate: string
  endDate: string
  isCurrent: boolean
  createdAt: string
  updatedAt: string
}

export type SubjectCategory = 
  | "english" 
  | "math" 
  | "science" 
  | "social_studies" 
  | "art" 
  | "music" 
  | "physical_education" 
  | "foreign_language" 
  | "other"

export interface SubjectAnalysis {
  category: SubjectCategory
  courses: Academic[]
  avgGPA: number
  consistency: number
  trend: number
  termGPAs: TermGPA[]
}

export interface TermGPA {
  term: string
  year: number
  gpa: number
}

export interface AcademicInsight {
  id: string
  userId: string
  content: string
  type: 'daily' | 'weekly' | 'ai_generated'
  createdAt: string
}

export interface GPAStats {
  current: number
  cumulative: number
  totalCredits: number
  trend: 'improving' | 'stable' | 'declining'
}

// Request/Response Types
export interface CreateCourseRequest {
  termId: string
  subject: string
  category: SubjectCategory
  grade: string
  credits: number
  teacher?: string
  room?: string
  notes?: string
}

export interface UpdateCourseRequest {
  subject?: string
  category?: SubjectCategory
  grade?: string
  credits?: number
  teacher?: string
  room?: string
  notes?: string
}