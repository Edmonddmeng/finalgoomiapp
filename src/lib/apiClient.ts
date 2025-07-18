
// import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios'

// // Define API response format
// interface ApiResponse<T = any> {
//   success: boolean
//   data?: T
//   message?: string
//   error?: {
//     code: string
//     message: string
//     details?: any
//   }
// }

// // Define custom error class
// export class ApiError extends Error {
//   code: string
//   details?: any

//   constructor(message: string, code: string, details?: any) {
//     super(message)
//     this.code = code
//     this.details = details
//     this.name = 'ApiError'
//   }
// }

// // Global auth error handler - will be set by AuthContext
// let globalAuthErrorHandler: (() => void) | null = null

// // Function to set the global auth error handler
// export const setGlobalAuthErrorHandler = (handler: () => void) => {
//   globalAuthErrorHandler = handler
// }

// // Create axios instance
// const apiClient: AxiosInstance = axios.create({
//   baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://goomi-community-backend.onrender.com/api',
//   timeout: 30000,
//   headers: {
//     'Content-Type': 'application/json',
//   },
// })

// // Request interceptor
// apiClient.interceptors.request.use(
//   (config: InternalAxiosRequestConfig) => {
//     // Add auth token automatically
//     const token = localStorage.getItem('accessToken') || localStorage.getItem('token')
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`
//     }

//     // Add timestamp to prevent caching
//     if (config.method === 'get') {
//       config.params = {
//         ...config.params,
//         _t: Date.now(),
//       }
//     }

//     // Log request in development
//     if (process.env.NODE_ENV === 'development') {
//       console.log('API Request:', {
//         method: config.method,
//         url: config.url,
//         data: config.data,
//         params: config.params,
//       })
//     }

//     return config
//   },
//   (error: AxiosError) => {
//     return Promise.reject(error)
//   }
// )

// // Response interceptor
// apiClient.interceptors.response.use(
//   (response) => {
//     // Log response in development
//     if (process.env.NODE_ENV === 'development') {
//       console.log('API Response:', {
//         url: response.config.url,
//         status: response.status,
//         data: response.data,
//       })
//     }

//     // Handle API response format
//     const apiResponse = response.data as ApiResponse
    
//     if (apiResponse.success === false && apiResponse.error) {
//       throw new ApiError(
//         apiResponse.error.message,
//         apiResponse.error.code,
//         apiResponse.error.details
//       )
//     }

//     // Return data directly for successful responses
//     return apiResponse.data ? { ...response, data: apiResponse.data } : response
//   },
//   async (error: AxiosError<ApiResponse>) => {
//     // Log error in development
//     if (process.env.NODE_ENV === 'development') {
//       console.error('API Error:', {
//         url: error.config?.url,
//         status: error.response?.status,
//         data: error.response?.data,
//       })
//     }

//     // Handle network errors
//     if (!error.response) {
//       throw new ApiError(
//         'Network error. Please check your connection.',
//         'NETWORK_ERROR'
//       )
//     }

//     // Handle timeout
//     if (error.code === 'ECONNABORTED') {
//       throw new ApiError(
//         'Request timeout. Please try again.',
//         'TIMEOUT'
//       )
//     }

//     // Handle API errors
//     const { status, data } = error.response

//     // Handle 401 and 403 errors globally
//     if (status === 401) {
//       console.log(`Authentication error detected: ${status}`)
      
//       // Call global auth error handler if available
//       if (globalAuthErrorHandler) {
//         globalAuthErrorHandler()
//       } else {
//         // Fallback: redirect to login directly
//         if (typeof window !== 'undefined') {
//           window.location.href = '/login'
//         }
//       }
      
//       // Still throw the error for the component to handle if needed
//       throw new ApiError(
//         status === 401 ? 'Authentication required. Please log in.' : 'Access denied.',
//         status === 401 ? 'UNAUTHORIZED' : 'FORBIDDEN'
//       )
//     }

//     // Handle other specific status codes
//     switch (status) {
//       case 404:
//         throw new ApiError(
//           data?.error?.message || 'Resource not found.',
//           data?.error?.code || 'NOT_FOUND'
//         )

//       case 422:
//         throw new ApiError(
//           data?.error?.message || 'Validation failed.',
//           data?.error?.code || 'VALIDATION_ERROR',
//           data?.error?.details
//         )

//       case 429:
//         throw new ApiError(
//           data?.error?.message || 'Too many requests. Please try again later.',
//           data?.error?.code || 'RATE_LIMIT_EXCEEDED'
//         )

//       case 500:
//       case 502:
//       case 503:
//       case 504:
//         throw new ApiError(
//           'Server error. Please try again later.',
//           'SERVER_ERROR'
//         )
//     }

//     const fallbackMessage =
//       typeof data?.error === 'string'
//         ? data.error
//         : data?.error?.message || data?.message || 'An unexpected error occurred.'

//     throw new ApiError(
//       fallbackMessage,
//       data?.error?.code || 'UNKNOWN_ERROR',
//       data?.error?.details
//     )
//   }
// )

// // Utility functions
// export const setAuthToken = (token: string | null) => {
//   if (token) {
//     apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`
//   } else {
//     delete apiClient.defaults.headers.common['Authorization']
//   }
// }

// // Export configured client
// export { apiClient }

// // Export types
// export type { ApiResponse }

// lib/apiClient.ts
import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios'

// Define API response format
interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  error?: {
    code: string
    message: string
    details?: any
  }
}

// Define custom error class
export class ApiError extends Error {
  code: string
  details?: any

  constructor(message: string, code: string, details?: any) {
    super(message)
    this.code = code
    this.details = details
    this.name = 'ApiError'
  }
}

// Global auth error handler - will be set by AuthContext
// This will ONLY be called for 401 errors now
let globalAuthErrorHandler: (() => void) | null = null

// Function to set the global auth error handler
export const setGlobalAuthErrorHandler = (handler: () => void) => {
  globalAuthErrorHandler = handler
}

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://goomi-community-backend.onrender.com/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Add auth token automatically
    const token = localStorage.getItem('accessToken') || localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    // Add timestamp to prevent caching
    if (config.method === 'get') {
      config.params = {
        ...config.params,
        _t: Date.now(),
      }
    }

    // Log request in development
    if (process.env.NODE_ENV === 'development') {
      console.log('API Request:', {
        method: config.method,
        url: config.url,
        data: config.data,
        params: config.params,
      })
    }

    return config
  },
  (error: AxiosError) => {
    return Promise.reject(error)
  }
)

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    // Log response in development
    if (process.env.NODE_ENV === 'development') {
      console.log('API Response:', {
        url: response.config.url,
        status: response.status,
        data: response.data,
      })
    }

    // Handle API response format
    const apiResponse = response.data as ApiResponse
    
    if (apiResponse.success === false && apiResponse.error) {
      throw new ApiError(
        apiResponse.error.message,
        apiResponse.error.code,
        apiResponse.error.details
      )
    }

    // Return data directly for successful responses
    return apiResponse.data ? { ...response, data: apiResponse.data } : response
  },
  async (error: AxiosError<ApiResponse>) => {
    // Log error in development
    if (process.env.NODE_ENV === 'development') {
      console.error('API Error:', {
        url: error.config?.url,
        status: error.response?.status,
        data: error.response?.data,
      })
    }

    // Handle network errors
    if (!error.response) {
      throw new ApiError(
        'Network error. Please check your connection.',
        'NETWORK_ERROR'
      )
    }

    // Handle timeout
    if (error.code === 'ECONNABORTED') {
      throw new ApiError(
        'Request timeout. Please try again.',
        'TIMEOUT'
      )
    }

    // Handle API errors
    const { status, data } = error.response

    // Handle 401 errors globally - REDIRECT TO LOGIN
    if (status === 401) {
      console.log('🔒 401 Unauthorized detected - logging out user')
      
      // Call global auth error handler if available
      if (globalAuthErrorHandler) {
        globalAuthErrorHandler()
      } else {
        // Fallback: redirect to login directly
        if (typeof window !== 'undefined') {
          window.location.href = '/login'
        }
      }
      
      // Still throw the error for the component to handle if needed
      throw new ApiError(
        'Authentication required. Please log in.',
        'UNAUTHORIZED'
      )
    }

    // Handle 403 errors differently - NO REDIRECT, just show error
    if (status === 403) {
      console.log('🚫 403 Forbidden detected - access denied but user stays logged in')
      
      throw new ApiError(
        data?.error?.message || 'Access denied. You do not have permission to perform this action.',
        'FORBIDDEN',
        data?.error?.details
      )
    }

    // Handle other specific status codes
    switch (status) {
      case 404:
        throw new ApiError(
          data?.error?.message || 'Resource not found.',
          data?.error?.code || 'NOT_FOUND'
        )

      case 422:
        throw new ApiError(
          data?.error?.message || 'Validation failed.',
          data?.error?.code || 'VALIDATION_ERROR',
          data?.error?.details
        )

      case 429:
        throw new ApiError(
          data?.error?.message || 'Too many requests. Please try again later.',
          data?.error?.code || 'RATE_LIMIT_EXCEEDED'
        )

      case 500:
      case 502:
      case 503:
      case 504:
        throw new ApiError(
          'Server error. Please try again later.',
          'SERVER_ERROR'
        )
    }

    const fallbackMessage =
      typeof data?.error === 'string'
        ? data.error
        : data?.error?.message || data?.message || 'An unexpected error occurred.'

    throw new ApiError(
      fallbackMessage,
      data?.error?.code || 'UNKNOWN_ERROR',
      data?.error?.details
    )
  }
)

// Utility functions
export const setAuthToken = (token: string | null) => {
  if (token) {
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`
  } else {
    delete apiClient.defaults.headers.common['Authorization']
  }
}

// Export configured client
export { apiClient }

// Export types
export type { ApiResponse }