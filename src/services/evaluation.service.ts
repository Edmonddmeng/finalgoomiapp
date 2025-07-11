import { apiClient } from '@/lib/apiClient'
import { EvaluationData, EvaluationType } from '@/types/evaluations'

interface EvaluationsResponse {
  grandGoal: string
  evaluations: EvaluationData
}

export const evaluationService = {
  getEvaluations: async (): Promise<EvaluationsResponse> => {
    const response = await apiClient.get('/evaluations')
    return response.data
  },

  updateGrandGoal: async (goal: string): Promise<void> => {
    await apiClient.put('/evaluations/grand-goal', { goal })
  },

  generateEvaluation: async (type: EvaluationType): Promise<void> => {
    await apiClient.post('/evaluations/generate', { type })
  }
}