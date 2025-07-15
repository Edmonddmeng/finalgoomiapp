import { useState } from 'react'
import { taskService } from '@/services/taskService'
import { useApiQuery, useApiMutation } from './useApiQuery'
import { 
  Task, 
  CreateTaskRequest, 
  UpdateTaskRequest, 
  TaskFilters 
} from '@/types/task'
import { PaginationParams } from '@/types/api'
import { useQueryClient } from '@tanstack/react-query'



export function useTasks(filters?: TaskFilters & PaginationParams) {
  const [currentFilters, setCurrentFilters] = useState(filters)
  
  const query = useApiQuery(
    () => taskService.getTasks(currentFilters),
    [currentFilters],
    {
      onSuccess: (data) => {
        console.log('✅ Hook received data:', data);
      }
    }
  )

  const updateFilters = (newFilters: TaskFilters & PaginationParams) => {
    setCurrentFilters(newFilters)
  }

  return {
    ...query,
    filters: currentFilters,
    updateFilters
  }
}

export function useTask(id: string) {
  return useApiQuery(
    () => taskService.getTask(id),
    [id],
    {
      enabled: !!id
    }
  )
}

export function useCreateTask() {
  return useApiMutation(
    (data: CreateTaskRequest) => taskService.createTask(data)
  )
}

export function useUpdateTask() {
  return useApiMutation(
    ({ id, data }: { id: string; data: UpdateTaskRequest }) => 
      taskService.updateTask(id, data)
  )
}

export function useDeleteTask() {
  return useApiMutation(
    (id: string) => taskService.deleteTask(id)
  )
}

// export function useToggleTask() {
//   return useApiMutation(
//     (id: string) => taskService.toggleTask(id)
//   )
// }

export function useToggleTask() {
  const queryClient = useQueryClient()
  
  const mutation = useApiMutation(
    (id: string) => taskService.toggleTask(id)
  )
  
  const toggleWithRefresh = async (taskId: string) => {
    console.log('🔄 Toggling task:', taskId)
    
    try {
      const result = await mutation.mutate(taskId)
      console.log('✅ Toggle successful:', result)
      
      // Strategy 1: Invalidate ALL queries (nuclear option)
      console.log('🧹 Invalidating ALL queries...')
      await queryClient.invalidateQueries()
      
      // Strategy 2: Also force refetch all queries with task data
      console.log('🔄 Force refetching task queries...')
      const allQueries = queryClient.getQueryCache().getAll()
      
      for (const query of allQueries) {
        if (query.state.data && Array.isArray(query.state.data)) {
          // Check if this looks like task data
          const hasTaskStructure = query.state.data.some((item: any) => 
            item && typeof item === 'object' && 'id' in item && 'completed' in item
          )
          
          if (hasTaskStructure) {
            console.log('🎯 Found task query, force refetching:', query.queryKey)
            await queryClient.refetchQueries({ 
              queryKey: query.queryKey,
              exact: true 
            })
          }
        }
      }
      
      console.log('✅ Cache operations completed')
      
    } catch (error) {
      console.error('❌ Toggle failed:', error)
      throw error
    }
  }
  
  return {
    ...mutation,
    mutate: toggleWithRefresh
  }
}

export function useCompleteTasks() {
  return useApiMutation(
    (ids: string[]) => taskService.completeTasks(ids)
  )
}

export function useDeleteTasks() {
  return useApiMutation(
    (ids: string[]) => taskService.deleteTasks(ids)
  )
}

export function useTaskStats() {
  return useApiQuery(
    () => taskService.getStats(),
    [],
    {
      refetchInterval: 60000 // Refetch every minute
    }
  )
}

export function useTaskStreak() {
  return useApiQuery(
    () => taskService.getStreak(),
    [],
    {
      refetchInterval: 60000 // Refetch every minute
    }
  )
}

export function useAddSubtask() {
  return useApiMutation(
    ({ taskId, title }: { taskId: string; title: string }) => 
      taskService.addSubtask(taskId, title)
  )
}

export function useToggleSubtask() {
  return useApiMutation(
    ({ taskId, subtaskId }: { taskId: string; subtaskId: string }) => 
      taskService.toggleSubtask(taskId, subtaskId)
  )
}

export function useDeleteSubtask() {
  return useApiMutation(
    ({ taskId, subtaskId }: { taskId: string; subtaskId: string }) => 
      taskService.deleteSubtask(taskId, subtaskId)
  )
}

export function useCreateRecurringTask() {
  return useApiMutation(
    (data: CreateTaskRequest & {
      recurring: {
        type: 'daily' | 'weekly' | 'monthly'
        endDate?: string
      }
    }) => taskService.createRecurringTask(data)
  )
}

export function useTaskTags() {
  return useApiQuery(() => taskService.getTags())
}

export function useRelatedCompetitionTasks(competitionId: string) {
  return useApiQuery(
    () => taskService.getRelatedCompetition(competitionId),
    [competitionId],
    {
      enabled: !!competitionId
    }
  )
}

export function useRelatedActivityTasks(activityId: string) {
  return useApiQuery(
    () => taskService.getRelatedActivity(activityId),
    [activityId],
    {
      enabled: !!activityId
    }
  )
}

export function useExportTasks() {
  return useApiMutation(
    (filters?: TaskFilters) => taskService.exportTasks(filters),
    {
      onSuccess: (blob) => {
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `tasks-${new Date().toISOString().split('T')[0]}.csv`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      }
    }
  )
}