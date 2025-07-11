import { apiClient } from '@/lib/apiClient'
import { 
  Competition, 
  CompetitionInsight, 
  AICompetitionInsight,
  CompetitionStats,
  CreateCompetitionRequest,
  UpdateCompetitionRequest,
  CompetitionCategory
} from '@/types/competition'

class CompetitionService {
  // CRUD operations
  async getCompetitions(params?: { 
    category?: CompetitionCategory; 
    year?: number 
  }): Promise<Competition[]> {
    const response = await apiClient.get<Competition[]>('/competitions', { params })
    return response.data
  }

  async getCompetition(id: string): Promise<Competition> {
    const response = await apiClient.get<Competition>(`/competitions/${id}`)
    return response.data
  }

  async createCompetition(data: CreateCompetitionRequest): Promise<Competition> {
    const response = await apiClient.post<Competition>('/competitions', data)
    return response.data
  }

  async updateCompetition(id: string, data: UpdateCompetitionRequest): Promise<Competition> {
    const response = await apiClient.put<Competition>(`/competitions/${id}`, data)
    return response.data
  }

  async deleteCompetition(id: string): Promise<void> {
    await apiClient.delete(`/competitions/${id}`)
  }

  // Insights
  async getInsights(competitionId: string): Promise<{
    personalInsights: CompetitionInsight[]
    aiInsights: AICompetitionInsight[]
  }> {
    const response = await apiClient.get<{
      personalInsights: CompetitionInsight[]
      aiInsights: AICompetitionInsight[]
    }>(`/competitions/${competitionId}/insights`)
    return response.data
  }

  async addPersonalInsight(competitionId: string, content: string): Promise<CompetitionInsight> {
    const response = await apiClient.post<CompetitionInsight>(
      `/competitions/${competitionId}/insights`,
      { content }
    )
    return response.data
  }

  async generateAIInsight(competitionId: string): Promise<AICompetitionInsight> {
    const response = await apiClient.post<AICompetitionInsight>(
      `/competitions/${competitionId}/ai-insights`
    )
    return response.data
  }

  async deleteInsight(competitionId: string, insightId: string): Promise<void> {
    await apiClient.delete(`/competitions/${competitionId}/insights/${insightId}`)
  }

  // Statistics
  async getStats(): Promise<CompetitionStats> {
    const response = await apiClient.get<CompetitionStats>('/competitions/stats')
    return response.data
  }

  // Bulk operations
  async importCompetitions(file: File): Promise<{ 
    imported: number; 
    errors: string[] 
  }> {
    const formData = new FormData()
    formData.append('file', file)

    const response = await apiClient.post<{ 
      imported: number; 
      errors: string[] 
    }>('/competitions/import', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  }

  async exportCompetitions(params?: { 
    category?: CompetitionCategory; 
    year?: number 
  }): Promise<Blob> {
    const response = await apiClient.get('/competitions/export', {
      params,
      responseType: 'blob'
    })
    return response.data
  }

  // Related tasks
  async getRelatedTasks(competitionId: string): Promise<any[]> {
    const response = await apiClient.get(`/competitions/${competitionId}/tasks`)
    return response.data
  }
}

export const competitionService = new CompetitionService()