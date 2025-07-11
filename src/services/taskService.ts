import { apiClient } from '@/lib/apiClient'
import { 
  Task, 
  TaskStats,
  CreateTaskRequest,
  UpdateTaskRequest,
  TaskFilters,
  TaskCategory,
  TaskPriority
} from '@/types/task'
import { PaginatedResponse, PaginationParams } from '@/types/api'

class TaskService {
  // CRUD operations
  async getTasks(filters?: TaskFilters & PaginationParams): Promise<PaginatedResponse<Task>> {
    const response = await apiClient.get<PaginatedResponse<Task>>('/tasks', { 
      params: filters 
    })
    return response.data
  }

  async getTask(id: string): Promise<Task> {
    const response = await apiClient.get<Task>(`/tasks/${id}`)
    return response.data
  }

  async createTask(data: CreateTaskRequest): Promise<Task> {
    const response = await apiClient.post<Task>('/tasks', data)
    return response.data
  }

  async updateTask(id: string, data: UpdateTaskRequest): Promise<Task> {
    const response = await apiClient.put<Task>(`/tasks/${id}`, data)
    return response.data
  }

  async deleteTask(id: string): Promise<void> {
    await apiClient.delete(`/tasks/${id}`)
  }

  // Task completion
  async toggleTask(id: string): Promise<{ completed: boolean; completedDate?: string }> {
    const response = await apiClient.put<{ 
      completed: boolean; 
      completedDate?: string 
    }>(`/tasks/${id}/toggle`)
    return response.data
  }

  async completeTask(id: string): Promise<Task> {
    const response = await apiClient.put<Task>(`/tasks/${id}/complete`)
    return response.data
  }

  async uncompleteTask(id: string): Promise<Task> {
    const response = await apiClient.put<Task>(`/tasks/${id}/uncomplete`)
    return response.data
  }

  // Batch operations
  async completeTasks(ids: string[]): Promise<{ updated: number }> {
    const response = await apiClient.put<{ updated: number }>('/tasks/batch/complete', { ids })
    return response.data
  }

  async deleteTasks(ids: string[]): Promise<{ deleted: number }> {
    const response = await apiClient.delete('/tasks/batch', { data: { ids } })
    return response.data
  }

  // Statistics
  async getStats(): Promise<TaskStats> {
    const response = await apiClient.get<TaskStats>('/tasks/stats')
    return response.data
  }

  async getStreak(): Promise<{
    current: number
    longest: number
    lastCompletedDate?: string
  }> {
    const response = await apiClient.get('/tasks/streak')
    return response.data
  }

  // Subtasks
  async addSubtask(taskId: string, title: string): Promise<Task> {
    const response = await apiClient.post<Task>(`/tasks/${taskId}/subtasks`, { title })
    return response.data
  }

  async toggleSubtask(taskId: string, subtaskId: string): Promise<Task> {
    const response = await apiClient.put<Task>(`/tasks/${taskId}/subtasks/${subtaskId}/toggle`)
    return response.data
  }

  async deleteSubtask(taskId: string, subtaskId: string): Promise<Task> {
    const response = await apiClient.delete<Task>(`/tasks/${taskId}/subtasks/${subtaskId}`)
    return response.data
  }

  // Recurring tasks
  async createRecurringTask(data: CreateTaskRequest & {
    recurring: {
      type: 'daily' | 'weekly' | 'monthly'
      endDate?: string
    }
  }): Promise<Task[]> {
    const response = await apiClient.post<Task[]>('/tasks/recurring', data)
    return response.data
  }

  // Tags
  async getTags(): Promise<string[]> {
    const response = await apiClient.get<string[]>('/tasks/tags')
    return response.data
  }

  // Related items
  async getRelatedCompetition(competitionId: string): Promise<Task[]> {
    const response = await apiClient.get<Task[]>(`/tasks/competition/${competitionId}`)
    return response.data
  }

  async getRelatedActivity(activityId: string): Promise<Task[]> {
    const response = await apiClient.get<Task[]>(`/tasks/activity/${activityId}`)
    return response.data
  }

  // Export
  async exportTasks(filters?: TaskFilters): Promise<Blob> {
    const response = await apiClient.get('/tasks/export', {
      params: filters,
      responseType: 'blob'
    })
    return response.data
  }
}

export const taskService = new TaskService()