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
import camelcaseKeys from 'camelcase-keys'

class ActivityService {
  // CRUD operations
  async getActivities(params?: { 
    category?: ActivityCategory; 
    isActive?: boolean 
  }): Promise<Activity[]> {
    const response = await apiClient.get<Activity[]>('/activities', { params })
    return camelcaseKeys(response.data as any, { deep: true }) as Activity[]
  }

  async getActivity(id: string): Promise<Activity> {
    const response = await apiClient.get<Activity>(`/activities/${id}`)
    return camelcaseKeys(response.data as any, { deep: true }) as Activity
  }

  async createActivity(data: CreateActivityRequest): Promise<Activity> {
    const response = await apiClient.post<Activity>('/activities', data)
    return camelcaseKeys(response.data as any, { deep: true }) as Activity
  }

  async updateActivity(id: string, data: UpdateActivityRequest): Promise<Activity> {
    const response = await apiClient.put<Activity>(`/activities/${id}`, data)
    return camelcaseKeys(response.data as any, { deep: true }) as Activity
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
    return camelcaseKeys(response.data as any, { deep: true }) as {
      personalInsights: ActivityInsight[]
      aiInsights: AIActivityInsight[]
    }
  }

  async addPersonalInsight(activityId: string, content: string): Promise<ActivityInsight> {
    const response = await apiClient.post<ActivityInsight>(
      `/activities/${activityId}/insights`,
      { content }
    )
    return camelcaseKeys(response.data as any, { deep: true }) as ActivityInsight
  }

  async generateAIInsight(activityId: string): Promise<AIActivityInsight> {
    const response = await apiClient.post<AIActivityInsight>(
      `/activities/${activityId}/ai-insights`
    )
    return camelcaseKeys(response.data as any, { deep: true }) as AIActivityInsight
  }

  async deleteInsight(activityId: string, insightId: string): Promise<void> {
    await apiClient.delete(`/activities/${activityId}/insights/${insightId}`)
  }

  // Statistics
  async getStats(): Promise<ActivityStats> {
    const response = await apiClient.get<ActivityStats>('/activities/stats')
    return camelcaseKeys(response.data as any, { deep: true }) as ActivityStats
  }

  // Achievements
  async addAchievement(activityId: string, achievement: string): Promise<Activity> {
    const response = await apiClient.post<Activity>(
      `/activities/${activityId}/achievements`,
      { achievement }
    )
    return camelcaseKeys(response.data as any, { deep: true }) as Activity
  }

  async removeAchievement(activityId: string, achievementIndex: number): Promise<Activity> {
    const response = await apiClient.delete<Activity>(
      `/activities/${activityId}/achievements/${achievementIndex}`
    )
    return camelcaseKeys(response.data as any, { deep: true }) as Activity
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
    return camelcaseKeys(response.data as any, { deep: true }) as {
      date: string
      hours: number
    }[]
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
    return camelcaseKeys(response.data as any, { deep: true }) as {
      imported: number
      errors: string[]
    }
  }

  async exportActivities(params?: { 
    category?: ActivityCategory; 
    isActive?: boolean 
  }): Promise<Blob> {
    const response = await apiClient.get('/activities/export', {
      params,
      responseType: 'blob'
    })
    return camelcaseKeys(response.data as any, { deep: true }) as Blob
  }
}

export const activityService = new ActivityService()