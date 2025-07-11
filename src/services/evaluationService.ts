import { 
  EvaluationData, 
  EvaluationType, 
  GenerateEvaluationRequest, 
  GenerateEvaluationResponse,
  GrandGoal 
} from '@/types/evaluations'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api'

export const evaluationService = {
  // Fetch all evaluations for a user
  async getEvaluations(userId: string): Promise<EvaluationData> {
    const response = await fetch(`${API_BASE_URL}/evaluations/${userId}`)
    if (!response.ok) {
      throw new Error('Failed to fetch evaluations')
    }
    return response.json()
  },

  // Generate a specific evaluation using AI
  async generateEvaluation(request: GenerateEvaluationRequest): Promise<GenerateEvaluationResponse> {
    const response = await fetch(`${API_BASE_URL}/evaluations/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    })
    if (!response.ok) {
      throw new Error('Failed to generate evaluation')
    }
    return response.json()
  },

  // Grand Goal operations
  async getGrandGoal(userId: string): Promise<GrandGoal | null> {
    const response = await fetch(`${API_BASE_URL}/users/${userId}/grand-goal`)
    if (!response.ok) {
      if (response.status === 404) return null
      throw new Error('Failed to fetch grand goal')
    }
    return response.json()
  },

  async updateGrandGoal(userId: string, content: string): Promise<GrandGoal> {
    const response = await fetch(`${API_BASE_URL}/users/${userId}/grand-goal`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content }),
    })
    if (!response.ok) {
      throw new Error('Failed to update grand goal')
    }
    return response.json()
  },

  // Save manual evaluation edits
  async updateEvaluation(
    userId: string, 
    evaluationType: EvaluationType, 
    content: string
  ): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/evaluations/${userId}/${evaluationType}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content }),
    })
    if (!response.ok) {
      throw new Error('Failed to update evaluation')
    }
  }
}