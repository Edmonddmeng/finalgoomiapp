import { activityService } from '@/services/activityService'
import { useApiQuery, useApiMutation } from './useApiQuery'
import { Activity, CreateActivityRequest, UpdateActivityRequest } from '@/types/activity'

// Get all activities
export function useActivities() {
  return useApiQuery(() => activityService.getActivities())
}

// Get single activity
export function useActivity(id: string) {
  return useApiQuery(() => activityService.getActivity(id), [id])
}

// Create activity
export function useCreateActivity() {
  const { refetch } = useActivities()
  
  return useApiMutation(
    (data: CreateActivityRequest) => activityService.createActivity(data),
    {
      onSuccess: () => {
        refetch()
      }
    }
  )
}

// Update activity
export function useUpdateActivity() {
  const { refetch } = useActivities()
  
  return useApiMutation(
    ({ id, data }: { id: string; data: UpdateActivityRequest }) => 
      activityService.updateActivity(id, data),
    {
      onSuccess: () => {
        refetch()
      }
    }
  )
}

// Delete activity
export function useDeleteActivity() {
  const { refetch } = useActivities()
  
  return useApiMutation(
    (id: string) => activityService.deleteActivity(id),
    {
      onSuccess: () => {
        refetch()
      }
    }
  )
}

// Activity insights
export function useActivityInsights(activityId: string) {
  return useApiQuery(() => activityService.getInsights(activityId), [activityId])
}

export function useAddActivityInsight(activityId: string) {
  const { refetch } = useActivityInsights(activityId)
  
  return useApiMutation(
    (content: string) => activityService.addPersonalInsight(activityId, content),
    {
      onSuccess: () => {
        refetch()
      }
    }
  )
}

export function useGenerateActivityInsight(activityId: string) {
  const { refetch } = useActivityInsights(activityId)
  
  return useApiMutation(
    () => activityService.generateAIInsight(activityId),
    {
      onSuccess: () => {
        refetch()
      }
    }
  )
}