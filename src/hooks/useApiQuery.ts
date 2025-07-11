import { useState, useEffect, useCallback, useRef } from 'react'
import { ApiError } from '@/lib/apiClient'

interface UseApiQueryOptions<T> {
  enabled?: boolean
  refetchInterval?: number
  onSuccess?: (data: T) => void
  onError?: (error: ApiError) => void
  initialData?: T
}

interface UseApiQueryResult<T> {
  data: T | undefined
  error: ApiError | null
  isLoading: boolean
  isError: boolean
  refetch: () => Promise<void>
  mutate: (data: T) => void
}

export function useApiQuery<T>(
  queryFn: () => Promise<T>,
  deps: any[] = [],
  options: UseApiQueryOptions<T> = {}
): UseApiQueryResult<T> {
  const {
    enabled = true,
    refetchInterval,
    onSuccess,
    onError,
    initialData
  } = options

  const [data, setData] = useState<T | undefined>(initialData)
  const [error, setError] = useState<ApiError | null>(null)
  const [isLoading, setIsLoading] = useState(!initialData)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const fetchData = useCallback(async () => {
    if (!enabled) return

    try {
      setIsLoading(true)
      setError(null)
      const result = await queryFn()
      setData(result)
      onSuccess?.(result)
    } catch (err) {
      const apiError = err instanceof ApiError ? err : new ApiError(
        'An unexpected error occurred',
        'UNKNOWN_ERROR'
      )
      setError(apiError)
      onError?.(apiError)
    } finally {
      setIsLoading(false)
    }
  }, [queryFn, enabled, onSuccess, onError])

  // Initial fetch
  useEffect(() => {
    fetchData()
  }, [...deps, enabled])

  // Refetch interval
  useEffect(() => {
    if (refetchInterval && enabled) {
      intervalRef.current = setInterval(fetchData, refetchInterval)
      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current)
        }
      }
    }
  }, [refetchInterval, enabled, fetchData])

  const mutate = useCallback((newData: T) => {
    setData(newData)
  }, [])

  return {
    data,
    error,
    isLoading,
    isError: !!error,
    refetch: fetchData,
    mutate
  }
}

// Mutation hook for POST/PUT/DELETE operations
interface UseApiMutationOptions<T, V> {
  onSuccess?: (data: T, variables: V) => void
  onError?: (error: ApiError, variables: V) => void
  onSettled?: (data: T | undefined, error: ApiError | null, variables: V) => void
}

interface UseApiMutationResult<T, V> {
  mutate: (variables: V) => Promise<T>
  mutateAsync: (variables: V) => Promise<T>
  data: T | undefined
  error: ApiError | null
  isLoading: boolean
  isError: boolean
  isSuccess: boolean
  reset: () => void
}

export function useApiMutation<T = unknown, V = void>(
  mutationFn: (variables: V) => Promise<T>,
  options: UseApiMutationOptions<T, V> = {}
): UseApiMutationResult<T, V> {
  const { onSuccess, onError, onSettled } = options

  const [data, setData] = useState<T | undefined>()
  const [error, setError] = useState<ApiError | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const reset = useCallback(() => {
    setData(undefined)
    setError(null)
    setIsLoading(false)
    setIsSuccess(false)
  }, [])

  const mutateAsync = useCallback(async (variables: V): Promise<T> => {
    try {
      setIsLoading(true)
      setError(null)
      setIsSuccess(false)
      
      const result = await mutationFn(variables)
      
      setData(result)
      setIsSuccess(true)
      onSuccess?.(result, variables)
      onSettled?.(result, null, variables)
      
      return result
    } catch (err) {
      const apiError = err instanceof ApiError ? err : new ApiError(
        'An unexpected error occurred',
        'UNKNOWN_ERROR'
      )
      setError(apiError)
      onError?.(apiError, variables)
      onSettled?.(undefined, apiError, variables)
      throw apiError
    } finally {
      setIsLoading(false)
    }
  }, [mutationFn, onSuccess, onError, onSettled])

  const mutate = useCallback(async (variables: V): Promise<T> => {
    return mutateAsync(variables).catch((error) => {
      // Error is already handled in mutateAsync
      throw error
    })
  }, [mutateAsync])

  return {
    mutate,
    mutateAsync,
    data,
    error,
    isLoading,
    isError: !!error,
    isSuccess,
    reset
  }
}