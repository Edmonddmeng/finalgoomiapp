import { academicService } from '@/services/academicService'
import { useApiQuery, useApiMutation } from './useApiQuery'
import { 
  Academic, 
  AcademicTerm, 
  CreateCourseRequest, 
  UpdateCourseRequest 
} from '@/types/academic'

const DEFAULT_TERMS: AcademicTerm[] = [
  {
    id: '2024-fall',
    name: 'Fall',
    year: 2024,
    startDate: '2024-08-26',
    endDate: '2024-12-15',
    isActive: false
  },
  {
    id: '2024-spring',
    name: 'Spring',
    year: 2024,
    startDate: '2024-01-15',
    endDate: '2024-05-10',
    isActive: false
  },
  {
    id: '2025-spring',
    name: 'Spring',
    year: 2025,
    startDate: '2025-01-13',
    endDate: '2025-05-09',
    isActive: false
  },
  {
    id: '2025-summer',
    name: 'Summer',
    year: 2025,
    startDate: '2025-05-19',
    endDate: '2025-08-08',
    isActive: true
  },
  {
    id: '2025-fall',
    name: 'Fall',
    year: 2025,
    startDate: '2025-08-25',
    endDate: '2025-12-14',
    isActive: false
  },
  {
    id: '2026-spring',
    name: 'Spring',
    year: 2026,
    startDate: '2026-01-12',
    endDate: '2026-05-08',
    isActive: false
  }
];

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

// Fixed Hook Usage - make sure you're calling it with the selected term
export function useCourses(userId: string, termId?: string, category?: string) {
  return useApiQuery(
    () => academicService.getCourses(userId, { termId, category }),
    [userId, termId, category]
  );
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