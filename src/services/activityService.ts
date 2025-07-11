import { apiClient } from '@/lib/apiClient'
import { 
  Activity, 
  ActivityInsight, 
  AIActivityInsight,
  ActivityStats,
  CreateActivityRequest,
  UpdateActivityRequest,
  ActivityCategory
} from '@/types/activity'

class ActivityService {
  // CRUD operations
  async getActivities(params?: { 
    category?: ActivityCategory; 
    isActive?: boolean 
  }): Promise<Activity[]> {
    const response = await apiClient.get<Activity[]>('/activities', { params })
    return response.data
  }

  async getActivity(id: string): Promise<Activity> {
    const response = await apiClient.get<Activity>(`/activities/${id}`)
    return response.data
  }

  async createActivity(data: CreateActivityRequest): Promise<Activity> {
    const response = await apiClient.post<Activity>('/activities', data)
    return response.data
  }

  async updateActivity(id: string, data: UpdateActivityRequest): Promise<Activity> {
    const response = await apiClient.put<Activity>(`/activities/${id}`, data)
    return response.data
  }

  async deleteActivity(id: string): Promise<void> {
    await apiClient.delete(`/activities/${id}`)
  }

  // Insights
  async getInsights(activityId: string): Promise<{
    personalInsights: ActivityInsight[]
    aiInsights: AIActivityInsight[]
  }> {
    const response = await apiClient.get<{
      personalInsights: ActivityInsight[]
      aiInsights: AIActivityInsight[]
    }>(`/activities/${activityId}/insights`)
    return response.data
  }

  async addPersonalInsight(activityId: string, content: string): Promise<ActivityInsight> {
    const response = await apiClient.post<ActivityInsight>(
      `/activities/${activityId}/insights`,
      { content }
    )
    return response.data
  }

  async generateAIInsight(activityId: string): Promise<AIActivityInsight> {
    const response = await apiClient.post<AIActivityInsight>(
      `/activities/${activityId}/ai-insights`
    )
    return response.data
  }

  async deleteInsight(activityId: string, insightId: string): Promise<void> {
    await apiClient.delete(`/activities/${activityId}/insights/${insightId}`)
  }

  // Statistics
  async getStats(): Promise<ActivityStats> {
    const response = await apiClient.get<ActivityStats>('/activities/stats')
    return response.data
  }

  // Achievements
  async addAchievement(activityId: string, achievement: string): Promise<Activity> {
    const response = await apiClient.post<Activity>(
      `/activities/${activityId}/achievements`,
      { achievement }
    )
    return response.data
  }

  async removeAchievement(activityId: string, achievementIndex: number): Promise<Activity> {
    const response = await apiClient.delete<Activity>(
      `/activities/${activityId}/achievements/${achievementIndex}`
    )
    return response.data
  }

  // Time tracking
  async logHours(activityId: string, hours: number, date: string): Promise<void> {
    await apiClient.post(`/activities/${activityId}/log-hours`, {
      hours,
      date
    })
  }

  async getHoursLog(activityId: string, startDate?: string, endDate?: string): Promise<{
    date: string
    hours: number
  }[]> {
    const response = await apiClient.get(`/activities/${activityId}/hours-log`, {
      params: { startDate, endDate }
    })
    return response.data
  }

  // Bulk operations
  async importActivities(file: File): Promise<{ 
    imported: number; 
    errors: string[] 
  }> {
    const formData = new FormData()
    formData.append('file', file)

    const response = await apiClient.post<{ 
      imported: number; 
      errors: string[] 
    }>('/activities/import', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  }

  async exportActivities(params?: { 
    category?: ActivityCategory; 
    isActive?: boolean 
  }): Promise<Blob> {
    const response = await apiClient.get('/activities/export', {
      params,
      responseType: 'blob'
    })
    return response.data
  }
}

export const activityService = new ActivityService()