// API Response Types
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  error?: ApiError
}

export interface ApiError {
  code: string
  message: string
  details?: Record<string, any>
}

export interface PaginatedResponse<T> {
  items: T[]
  pagination: Pagination
}

export interface Pagination {
  page: number
  limit: number
  total: number
  totalPages: number
}

// Request Types
export interface PaginationParams {
  page?: number
  limit?: number
  sort?: string
  order?: 'asc' | 'desc'
}

export interface DateRangeParams {
  startDate?: string
  endDate?: string
}

// WebSocket Types
export interface WebSocketMessage<T = any> {
  event: string
  data: T
  timestamp: string
}

export interface WebSocketSubscription {
  event: string
  callback: (data: any) => void
}