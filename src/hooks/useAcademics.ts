import { academicService } from '@/services/academicService'
import { useApiQuery, useApiMutation } from './useApiQuery'
import { 
  Academic, 
  AcademicTerm, 
  CreateCourseRequest, 
  UpdateCourseRequest 
} from '@/types/academic'

// NEW: Enhanced GPA Analytics Hooks
export function useOverallGPA() {
  return useApiQuery(
    () => academicService.getOverallGPA(),
    ['gpa-overall']
  )
}

// Terms
export function useAcademicTerms() {
  return useApiQuery(() => academicService.getTerms())
}

export function useCreateTerm() {
  const { refetch } = useAcademicTerms()
  
  return useApiMutation(
    (data: Omit<AcademicTerm, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => 
      academicService.createTerm(data),
    {
      onSuccess: () => {
        refetch()
      }
    }
  )
}

export function useUpdateTerm() {
  const { refetch } = useAcademicTerms()
  
  return useApiMutation(
    ({ id, data }: { id: string; data: Partial<AcademicTerm> }) => 
      academicService.updateTerm(id, data),
    {
      onSuccess: () => {
        refetch()
      }
    }
  )
}

export function useDeleteTerm() {
  const { refetch } = useAcademicTerms()
  
  return useApiMutation(
    (id: string) => academicService.deleteTerm(id),
    {
      onSuccess: () => {
        refetch()
      }
    }
  )
}

// Courses
export function useCourses(termId?: string, category?: string) {
  return useApiQuery(
    () => academicService.getCourses({ termId, category }),
    [termId, category]
  )
}

export function useCreateCourse() {
  return useApiMutation(
    (data: CreateCourseRequest) => academicService.createCourse(data)
  )
}

export function useUpdateCourse() {
  return useApiMutation(
    ({ id, data }: { id: string; data: UpdateCourseRequest }) => 
      academicService.updateCourse(id, data)
  )
}

export function useDeleteCourse() {
  return useApiMutation(
    (id: string) => academicService.deleteCourse(id)
  )
}

// Insights
export function useAcademicInsights() {
  return useApiQuery(() => academicService.getInsights())
}

export function useCreateInsight() {
  const { refetch } = useAcademicInsights()
  
  return useApiMutation(
    (content: string) => academicService.createInsight(content),
    {
      onSuccess: () => {
        refetch()
      }
    }
  )
}

export function useGenerateAIInsight() {
  const { refetch } = useAcademicInsights()
  
  return useApiMutation(
    () => academicService.generateAIInsight(),
    {
      onSuccess: () => {
        refetch()
      }
    }
  )
}

// Analytics
export function useGPAStats() {
  return useApiQuery(() => academicService.getGPAStats())
}

export function useSubjectAnalysis() {
  return useApiQuery(() => academicService.getSubjectAnalysis())
}

// Import/Export
export function useImportCourses() {
  return useApiMutation(
    (file: File) => academicService.importCourses(file)
  )
}

export function useExportCourses() {
  return useApiMutation(
    (termId?: string) => academicService.exportCourses(termId),
    {
      onSuccess: (blob) => {
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `courses-${new Date().toISOString().split('T')[0]}.csv`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      }
    }
  )
}