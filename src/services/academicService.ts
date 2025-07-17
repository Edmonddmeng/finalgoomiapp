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

    // NEW: Enhanced GPA Analytics using the new API endpoints
    async getOverallGPA(): Promise<{
      overallGPA: number
      totalCourses: number
      completedCourses: number
      totalCredits: number
      currentTermGPA: number | null
      gradeDistribution: Record<string, number>
      lastUpdated: string
      actScore: number
      satScore: number
    }> {
      const response = await apiClient.get('/academics/gpa/overall')
      return response.data
    }
  
  // Terms
  async getTerms(): Promise<AcademicTerm[]> {
    console.log('getTerms')
    const response = await apiClient.get<{ terms: AcademicTerm[] }>('/academics/terms')
    console.log('response 1111', response.data.terms)
    return response.data.terms || []
  }

  async createTerm(data: Omit<AcademicTerm, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<AcademicTerm> {
    // Transform camelCase to snake_case for backend
    const transformedData = {
      name: data.name,
      year: data.year,
      start_date: data.startDate,
      end_date: data.endDate,
      is_current: data.isCurrent
    }
    const response = await apiClient.post<{ term: AcademicTerm }>('/academics/terms', transformedData)
    return response.data.term
  }

  async updateTerm(id: string, data: Partial<AcademicTerm>): Promise<AcademicTerm> {
    // Transform camelCase to snake_case for backend
    const transformedData: any = {}
    if (data.name !== undefined) transformedData.name = data.name
    if (data.year !== undefined) transformedData.year = data.year
    if (data.startDate !== undefined) transformedData.start_date = data.startDate
    if (data.endDate !== undefined) transformedData.end_date = data.endDate
    if (data.isCurrent !== undefined) transformedData.is_current = data.isCurrent
    
    const response = await apiClient.put<{ term: AcademicTerm }>(`/academics/terms/${id}`, transformedData)
    return response.data.term
  }

  async deleteTerm(id: string): Promise<void> {
    await apiClient.delete(`/academics/terms/${id}`)
  }

  // Courses
  async getCourses(params?: { termId?: string; category?: string }): Promise<Academic[]> {
    // Transform camelCase to snake_case for backend
    const transformedParams: any = {}
    if (params?.termId) transformedParams.term_id = params.termId
    if (params?.category) transformedParams.category = params.category
    
    const response = await apiClient.get<{ courses: Academic[] }>('/academics/courses', { params: transformedParams })
    console.log('response 2222', response)
    return response.data.courses || []
  }

  async createCourse(data: CreateCourseRequest): Promise<Academic> {
    // Transform camelCase to snake_case for backend
    const transformedData = {
      term_id: data.termId,
      subject: data.subject,
      category: data.category,
      grade: data.grade,
      credits: data.credits,
      teacher: data.teacher,
      room: data.room,
      notes: data.notes
    }
    const response = await apiClient.post<{ course: Academic }>('/academics/courses', transformedData)
    return response.data.course
  }

  async updateCourse(id: string, data: UpdateCourseRequest): Promise<Academic> {
    const response = await apiClient.put<{ course: Academic }>(`/academics/courses/${id}`, data)
    return response.data.course
  }

  async deleteCourse(id: string): Promise<void> {
    await apiClient.delete(`/academics/courses/${id}`)
  }

  // Insights
  async getInsights(): Promise<AcademicInsight[]> {
    const response = await apiClient.get<{ insights: AcademicInsight[] }>('/academics/insights')
    return response.data.insights || []
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
    const response = await apiClient.get<{ current_gpa: number; gpa_history: any[] }>('/academics/gpa-stats')
    return {
      current: response.data.current_gpa || 0,
      cumulative: response.data.current_gpa || 0,
      totalCredits: 0,
      trend: 'stable'
    }
  }

  async getSubjectAnalysis(): Promise<SubjectAnalysis[]> {
    const response = await apiClient.get<{ subjectAnalysis: SubjectAnalysis[] }>('/academics/subject-analysis')
    return response.data.subjectAnalysis || []
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