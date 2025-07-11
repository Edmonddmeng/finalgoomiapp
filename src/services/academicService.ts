import { apiClient } from '@/lib/apiClient'
import { 
  Academic, 
  AcademicTerm, 
  AcademicInsight,
  GPAStats,
  CreateCourseRequest,
  UpdateCourseRequest,
  SubjectAnalysis
} from '@/types/academic'

class AcademicService {
  // Terms
  async getTerms(): Promise<AcademicTerm[]> {
    const response = await apiClient.get<AcademicTerm[]>('/academics/terms')
    return response.data
  }

  async createTerm(data: Omit<AcademicTerm, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<AcademicTerm> {
    const response = await apiClient.post<AcademicTerm>('/academics/terms', data)
    return response.data
  }

  async updateTerm(id: string, data: Partial<AcademicTerm>): Promise<AcademicTerm> {
    const response = await apiClient.put<AcademicTerm>(`/academics/terms/${id}`, data)
    return response.data
  }

  async deleteTerm(id: string): Promise<void> {
    await apiClient.delete(`/academics/terms/${id}`)
  }

  // Courses
  async getCourses(params?: { termId?: string; category?: string }): Promise<Academic[]> {
    const response = await apiClient.get<Academic[]>('/academics/courses', { params })
    return response.data
  }

  async createCourse(data: CreateCourseRequest): Promise<Academic> {
    const response = await apiClient.post<Academic>('/academics/courses', data)
    return response.data
  }

  async updateCourse(id: string, data: UpdateCourseRequest): Promise<Academic> {
    const response = await apiClient.put<Academic>(`/academics/courses/${id}`, data)
    return response.data
  }

  async deleteCourse(id: string): Promise<void> {
    await apiClient.delete(`/academics/courses/${id}`)
  }

  // Insights
  async getInsights(): Promise<AcademicInsight[]> {
    const response = await apiClient.get<AcademicInsight[]>('/academics/insights')
    return response.data
  }

  async createInsight(content: string): Promise<AcademicInsight> {
    const response = await apiClient.post<AcademicInsight>('/academics/insights', { content })
    return response.data
  }

  async generateAIInsight(): Promise<AcademicInsight> {
    const response = await apiClient.post<AcademicInsight>('/academics/insights/generate')
    return response.data
  }

  // Analytics
  async getGPAStats(): Promise<GPAStats> {
    const response = await apiClient.get<GPAStats>('/academics/gpa-stats')
    return response.data
  }

  async getSubjectAnalysis(): Promise<SubjectAnalysis[]> {
    const response = await apiClient.get<SubjectAnalysis[]>('/academics/subject-analysis')
    return response.data
  }

  // Bulk operations
  async importCourses(file: File): Promise<{ imported: number; errors: string[] }> {
    const formData = new FormData()
    formData.append('file', file)

    const response = await apiClient.post<{ imported: number; errors: string[] }>(
      '/academics/courses/import',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    )
    return response.data
  }

  async exportCourses(termId?: string): Promise<Blob> {
    const response = await apiClient.get('/academics/courses/export', {
      params: { termId },
      responseType: 'blob'
    })
    return response.data
  }
}

export const academicService = new AcademicService()