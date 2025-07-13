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

    // Handle specific status codes
    switch (status) {
      case 401:
        // Unauthorized - token might be expired
        if (data?.error?.code === 'AUTH_TOKEN_EXPIRED') {
          // Attempt to refresh token
          try {
            const authService = await import('@/services/authService').then(m => m.authService)
            const refreshToken = authService?.getRefreshToken()
            
            if (refreshToken && authService) {
              await (authService as any).refreshToken(refreshToken)
              
              // Retry original request
              const originalRequest = error.config!
              return apiClient(originalRequest)
            }
          } catch (refreshError) {
            // Refresh failed, redirect to login
            if (typeof window !== 'undefined') {
              window.location.href = '/login'
            }
          }
        }
        break

      case 403:
        throw new ApiError(
          data?.error?.message || 'You do not have permission to perform this action.',
          data?.error?.code || 'FORBIDDEN'
        )

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