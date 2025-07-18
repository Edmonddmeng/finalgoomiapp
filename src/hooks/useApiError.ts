// "use client"

// import { useCallback } from 'react'
// import { useToast } from '@/components/Utils/Toast'
// import { ApiError } from '@/lib/apiClient'

// export function useApiError() {
//   const { error: showError, warning: showWarning } = useToast()

//   const handleError = useCallback((error: any) => {
//     if (error instanceof ApiError) {
//       // Handle known API errors
//       switch (error.code) {
//         case 'UNAUTHORIZED':
//           break
//         case 'FORBIDDEN':
//           showError('Forbidden', 'You are not authorized to access this resource')
//           // These are handled globally by apiClient, no need to show toast
//           break
//         case 'VALIDATION_ERROR':
//           showWarning('Validation Error', error.message)
//           break
//         case 'NETWORK_ERROR':
//           showError('Network Error', 'Please check your internet connection')
//           break
//         case 'TIMEOUT':
//           showError('Request Timeout', 'The request took too long. Please try again.')
//           break
//         case 'SERVER_ERROR':
//           showError('Server Error', 'Something went wrong on our end. Please try again later.')
//           break
//         default:
//           showError('Error', error.message)
//       }
//     } else {
//       // Handle unknown errors
//       showError('Error', error.message || 'An unexpected error occurred')
//     }
//   }, [showError, showWarning])

//   return { handleError }
// }

// hooks/useApiError.ts
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
          // 401 errors are handled globally by apiClient, no need to show toast
          // User will be redirected to login automatically
          break
          
        case 'FORBIDDEN':
          // 403 errors should show a toast (no redirect)
          showError('Access Denied', error.message || 'You do not have permission to perform this action.')
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
          
        case 'NOT_FOUND':
          showError('Not Found', error.message || 'The requested resource was not found.')
          break
          
        case 'RATE_LIMIT_EXCEEDED':
          showWarning('Rate Limit Exceeded', error.message || 'Too many requests. Please slow down.')
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