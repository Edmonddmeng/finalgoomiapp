import { apiClient } from '@/lib/apiClient'
import { Competition } from '@/types'

interface CompetitionInsight {
  id: string
  content: string
  competitionId: string
  createdAt: string
}

export const competitionService = {
  getCompetitions: async (): Promise<Competition[]> => {
    const response = await apiClient.get('/competitions')
    return response.data
  },

  getCompetition: async (id: string): Promise<Competition> => {
    const response = await apiClient.get(`/competitions/${id}`)
    return response.data
  },

  createCompetition: async (competition: Partial<Competition>): Promise<Competition> => {
    const response = await apiClient.post('/competitions', competition)
    return response.data
  },

  updateCompetition: async (id: string, competition: Partial<Competition>): Promise<Competition> => {
    const response = await apiClient.put(`/competitions/${id}`, competition)
    return response.data
  },

  deleteCompetition: async (id: string): Promise<void> => {
    await apiClient.delete(`/competitions/${id}`)
  },

  getInsights: async (competitionId: string): Promise<CompetitionInsight[]> => {
    const response = await apiClient.get(`/competitions/${competitionId}/insights`)
    return response.data
  },

  getAllInsights: async (): Promise<CompetitionInsight[]> => {
    const response = await apiClient.get('/competitions/insights')
    return response.data
  },

  createInsight: async (competitionId: string, content: string): Promise<CompetitionInsight> => {
    const response = await apiClient.post(`/competitions/${competitionId}/insights`, { content })
    return response.data
  },

  deleteInsight: async (competitionId: string, insightId: string): Promise<void> => {
    await apiClient.delete(`/competitions/${competitionId}/insights/${insightId}`)
  }
}