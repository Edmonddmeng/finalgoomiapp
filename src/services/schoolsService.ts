import { apiClient } from '@/lib/apiClient'
import { 
  College, 
  PrepSchool, 
  CollegesResponse, 
  PrepSchoolsResponse 
} from '@/types/schools'

class SchoolsService {
  // Get all colleges
  async getColleges(includeScores: boolean = true): Promise<CollegesResponse> {
    const response = await apiClient.get<CollegesResponse>('/schools/colleges', {
      params: { includeScores }
    })
    return response.data
  }

  // Get all prep schools
  async getPrepSchools(includeScores: boolean = true): Promise<PrepSchoolsResponse> {
    const response = await apiClient.get<PrepSchoolsResponse>('/schools/prep-schools', {
      params: { includeScores }
    })
    return response.data
  }

  // Get single college
  async getCollege(id: string): Promise<College> {
    const response = await apiClient.get<College>(`/schools/colleges/${id}`)
    return response.data
  }

  // Get single prep school
  async getPrepSchool(id: string): Promise<PrepSchool> {
    const response = await apiClient.get<PrepSchool>(`/schools/prep-schools/${id}`)
    return response.data
  }
}

export const schoolsService = new SchoolsService()