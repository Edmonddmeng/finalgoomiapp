import { useState } from 'react'

interface MutationOptions<TData> {
  onSuccess?: (data: TData) => void
  onError?: (error: any) => void
}

export function useApiMutation<TParams = void, TData = any>(
  mutationFn: (params: TParams) => Promise<TData>
) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<any>(null)
  const [data, setData] = useState<TData | null>(null)

  const mutate = async (params: TParams, options?: MutationOptions<TData>) => {
    try {
      setIsLoading(true)
      setError(null)
      const result = await mutationFn(params)
      setData(result)
      options?.onSuccess?.(result)
      return result
    } catch (err) {
      setError(err)
      options?.onError?.(err)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const mutateAsync = async (params: TParams) => {
    return mutate(params)
  }

  return {
    mutate,
    mutateAsync,
    isLoading,
    error,
    data
  }
}