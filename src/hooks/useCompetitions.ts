import { competitionService } from '@/services/competitionService'
import { useApiQuery, useApiMutation } from './useApiQuery'
import { Competition, CreateCompetitionRequest, UpdateCompetitionRequest } from '@/types/competition'

// Get all competitions
export function useCompetitions() {
  return useApiQuery(() => competitionService.getCompetitions())
}

// Get single competition
export function useCompetition(id: string) {
  return useApiQuery(() => competitionService.getCompetition(id), [id])
}

// Create competition
export function useCreateCompetition() {
  const { refetch } = useCompetitions()
  
  return useApiMutation(
    (data: CreateCompetitionRequest) => competitionService.createCompetition(data),
    {
      onSuccess: () => {
        refetch()
      }
    }
  )
}

// Update competition
export function useUpdateCompetition() {
  const { refetch } = useCompetitions()
  
  return useApiMutation(
    ({ id, data }: { id: string; data: UpdateCompetitionRequest }) => 
      competitionService.updateCompetition(id, data),
    {
      onSuccess: () => {
        refetch()
      }
    }
  )
}

// Delete competition
export function useDeleteCompetition() {
  const { refetch } = useCompetitions()
  
  return useApiMutation(
    (id: string) => competitionService.deleteCompetition(id),
    {
      onSuccess: () => {
        refetch()
      }
    }
  )
}

// Competition insights
export function useCompetitionInsights(competitionId: string) {
  return useApiQuery(() => competitionService.getInsights(competitionId), [competitionId])
}

export function useAddCompetitionInsight(competitionId: string) {
  const { refetch } = useCompetitionInsights(competitionId)
  
  return useApiMutation(
    (content: string) => competitionService.addPersonalInsight(competitionId, content),
    {
      onSuccess: () => {
        refetch()
      }
    }
  )
}

export function useGenerateCompetitionInsight(competitionId: string) {
  const { refetch } = useCompetitionInsights(competitionId)
  
  return useApiMutation(
    () => competitionService.generateAIInsight(competitionId),
    {
      onSuccess: () => {
        refetch()
      }
    }
  )
}