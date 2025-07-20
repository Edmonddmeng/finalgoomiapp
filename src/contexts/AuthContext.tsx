
"use client"

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { authService as authServiceInstance } from '@/services/authService'
const authService = authServiceInstance
import { User, AuthTokens } from '@/types'
import { apiClient, setAuthToken, setGlobalAuthErrorHandler } from '@/lib/apiClient'

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, name: string, username: string) => Promise<void>
  logout: () => Promise<void>
  updateUser: (user: User) => void
  refreshAuth: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const TOKEN_KEY = 'goomi_auth_tokens'
const USER_KEY = 'goomi_user'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()

  // Global auth error handler for 401/403 errors
  const handleAuthError = useCallback(() => {
    console.log('Handling authentication error - clearing auth state')
    
    // Clear all auth data
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
    localStorage.removeItem('accessToken')
    localStorage.removeItem('token')
    
    // Clear auth token from API client
    setAuthToken(null)
    
    // Clear auth service tokens
    if (authService && (authService as any).clearTokens) {
      (authService as any).clearTokens()
    }
    
    // Update state
    setUser(null)
    setIsAuthenticated(false)
    
    // Redirect to login
    router.push('/login')
  }, [router])

  // Set up global auth error handler on mount
  useEffect(() => {
    setGlobalAuthErrorHandler(handleAuthError)
    
    // Cleanup on unmount
    return () => {
      setGlobalAuthErrorHandler(() => {})
    }
  }, [handleAuthError])

  // Load user and tokens from localStorage on mount
  useEffect(() => {
    const loadStoredAuth = async () => {
      try {
        const storedUser = localStorage.getItem(USER_KEY)
        const storedToken = localStorage.getItem('accessToken') || localStorage.getItem('token')

        if (storedUser && storedToken) {
          // Set token in API client
          setAuthToken(storedToken)
          
          // Parse and set user
          const userData: User = JSON.parse(storedUser)
          setUser(userData)
          setIsAuthenticated(true)
          
          // Optionally verify token is still valid
          // This will automatically trigger auth error handler if token is invalid
          try {
            await authService.getCurrentUser()
          } catch (error) {
            // Token is invalid, auth error handler will be called by API client
            console.log('Token validation failed')
          }
        }
      } catch (error) {
        console.error('Error loading stored auth:', error)
        handleAuthError()
      } finally {
        setIsLoading(false)
      }
    }

    loadStoredAuth()
  }, [handleAuthError])

  const login = useCallback(async (email: string, password: string) => {
    try {
      const response = await authService.login(email, password)
      const { user, tokens } = response
      
      // Set token in API client
      setAuthToken(tokens.accessToken)
      
      // Store tokens in localStorage
      localStorage.setItem('accessToken', tokens.accessToken)
      localStorage.setItem('token', tokens.accessToken)
      localStorage.setItem(TOKEN_KEY, JSON.stringify(tokens))

      // Fetch fresh user data
      const freshUser = await authService.getCurrentUser()
      setUser(freshUser)
      setIsAuthenticated(true)
      localStorage.setItem(USER_KEY, JSON.stringify(freshUser))
      
    } catch (err) {
      console.error('Login failed:', err)
      throw err
    }
  }, [])

  const register = useCallback(async (
    email: string, 
    password: string, 
    name: string, 
    username: string
  ) => {
    try {
      // Make direct API call to signup endpoint
      const response = await apiClient.post("/auth/signup", {
        email,
        password,
        name,
        username
      })

      if (response.status !== 200) {
        throw new Error(response.data.error || response.data.message || "Registration failed")
      }

      // If signup was successful, automatically log the user in
      await login(email, password)
      
    } catch (error) {
      console.error('Registration failed:', error)
      throw error
    }
  }, [login])

  const logout = useCallback(async () => {
    try {
      localStorage.removeItem('goomi_auth_tokens')
      localStorage.removeItem('goomi_user')
      localStorage.removeItem('accessToken')
      localStorage.removeItem('token')

      // Clear API client auth header
      setAuthToken(null)

      // Clear auth service tokens if they exist
      if (authService && (authService as any).clearTokens) {
        (authService as any).clearTokens()
      }

      // Update state
      setUser(null)
      setIsAuthenticated(false)

      // Redirect to login
      router.push('/login')
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      // Clear all auth data
      handleAuthError()
    }
  }, [handleAuthError])

  const updateUser = useCallback((updatedUser: User) => {
    setUser(updatedUser)
    localStorage.setItem(USER_KEY, JSON.stringify(updatedUser))
  }, [])

  const refreshAuth = useCallback(async () => {
    try {
      const storedTokens = localStorage.getItem(TOKEN_KEY)
      if (!storedTokens) throw new Error('No tokens found')
      
      const tokens: AuthTokens = JSON.parse(storedTokens)
      const newTokens = await authService.refreshToken(tokens.refreshToken)
      
      // Update stored tokens
      localStorage.setItem(TOKEN_KEY, JSON.stringify(newTokens))
      localStorage.setItem('accessToken', newTokens.accessToken)
      
      // Update API client with new token
      setAuthToken(newTokens.accessToken)
      
      // Update auth service tokens
      if (authService && (authService as any).setTokens) {
        (authService as any).setTokens(newTokens)
      }
      
      // Refresh user data
      const freshUserData = await authService.getCurrentUser()
      setUser(freshUserData)
      setIsAuthenticated(true)
      
    } catch (error) {
      console.error('Token refresh failed:', error)
      handleAuthError()
      throw error
    }
  }, [handleAuthError])

  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    updateUser,
    refreshAuth
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// Updated HOC for protecting routes
export function withAuth<P extends object>(
  Component: React.ComponentType<P>
): React.ComponentType<P> {
  return function AuthenticatedComponent(props: P) {
    const { isAuthenticated, isLoading } = useAuth()
    const router = useRouter()

    useEffect(() => {
      if (!isLoading && !isAuthenticated) {
        router.push('/login')
      }
    }, [isAuthenticated, isLoading, router])

    if (isLoading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>
      )
    }

    if (!isAuthenticated) {
      return null // Will redirect via useEffect
    }

    return <Component {...props} />
  }
}