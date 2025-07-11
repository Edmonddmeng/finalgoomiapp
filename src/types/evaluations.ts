export interface Evaluation {
  content: string
  lastUpdated: string
  isAIGenerated: boolean
}

export interface EvaluationData {
  weeklyEvaluation: Evaluation
  academicEvaluation: Evaluation
  extracurricularEvaluation: Evaluation
  suggestedActions: Evaluation
}

export interface GrandGoal {
  id: string
  userId: string
  content: string
  createdAt: string
  updatedAt: string
}

export type EvaluationType = keyof EvaluationData

export interface GenerateEvaluationRequest {
  userId: string
  evaluationType: EvaluationType
  context?: {
    tasks?: any[]
    academics?: any[]
    activities?: any[]
    competitions?: any[]
  }
}

export interface GenerateEvaluationResponse {
  evaluation: Evaluation
  evaluationType: EvaluationType
}