"use client"

import { useCallback } from 'react'
import { useToast } from '@/components/Utils/Toast'
import { ApiError } from '@/lib/apiClient'

export function useApiError() {
  const { error: showError, warning: showWarning } = useToast()

  const handleError = useCallback((error: any) => {
    if (error instanceof ApiError) {
      // Handle known API errors
      switch (error.code) {
        case 'UNAUTHORIZED':
        case 'FORBIDDEN':
          // These are handled globally by apiClient, no need to show toast
          break
        case 'VALIDATION_ERROR':
          showWarning('Validation Error', error.message)
          break
        case 'NETWORK_ERROR':
          showError('Network Error', 'Please check your internet connection')
          break
        case 'TIMEOUT':
          showError('Request Timeout', 'The request took too long. Please try again.')
          break
        case 'SERVER_ERROR':
          showError('Server Error', 'Something went wrong on our end. Please try again later.')
          break
        default:
          showError('Error', error.message)
      }
    } else {
      // Handle unknown errors
      showError('Error', error.message || 'An unexpected error occurred')
    }
  }, [showError, showWarning])

  return { handleError }
}