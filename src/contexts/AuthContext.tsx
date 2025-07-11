"use client"

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { authService as authServiceInstance } from '@/services/authService'
const authService = authServiceInstance
import { User, AuthTokens } from '@/types'

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

  // TODO: DEMO MODE - Remove this before production!
  // This automatically logs in a demo user for presentation purposes
  useEffect(() => {
    const initDemoUser = () => {
      const demoUser: User = {
        id: 'demo-user-123',
        email: 'demo@goomiapp.com',
        name: 'Alex Johnson',
        username: 'alexj',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
        progressLevel: 78,
        currentStreak: 12,
        totalPoints: 2450,
        achievements: [
          {
            id: '1',
            title: 'First Steps',
            description: 'Completed your first task',
            icon: 'trophy',
            unlockedAt: '2024-01-15',
            category: 'milestone',
            points: 100
          },
          {
            id: '2',
            title: 'Dedicated Student',
            description: 'Maintained a 7-day streak',
            icon: 'fire',
            unlockedAt: '2024-02-01',
            category: 'streak',
            points: 200
          }
        ],
        stats: {
          totalCompetitions: 5,
          totalActivities: 8,
          averageGPA: 3.85,
          tasksCompleted: 127,
          hoursStudied: 245,
          satScore: 1520,
          actScore: 34
        },
        createdAt: '2023-09-01',
        updatedAt: '2024-03-15'
      };

      setUser(demoUser);
      setIsAuthenticated(true);
      setIsLoading(false);
    };

    // Initialize demo user immediately
    initDemoUser();
  }, []);

  // Load user and tokens from localStorage on mount
  // COMMENTED OUT FOR DEMO MODE
  /*
  useEffect(() => {
    const loadStoredAuth = async () => {
      try {
        const storedTokens = localStorage.getItem(TOKEN_KEY)
        const storedUser = localStorage.getItem(USER_KEY)

        if (storedTokens && storedUser) {
          const tokens: AuthTokens = JSON.parse(storedTokens)
          const userData: User = JSON.parse(storedUser)
          
          // Set tokens in auth service
          (authService as any).setTokens(tokens)
          
          // Verify token is still valid by fetching user profile
          const freshUserData = await (authService as any).getCurrentUser()
          setUser(freshUserData)
          setIsAuthenticated(true)
        }
      } catch (error) {
        // Token invalid or expired, clear storage
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
        (authService as any).clearTokens();
      } finally {
        setIsLoading(false)
      }
    }

    loadStoredAuth()
  }, [])
  */

  const login = useCallback(async (email: string, password: string) => {
    try {
      const response = await (authService as any).login(email, password)
      const { user, tokens } = response
      
      // Store tokens and user
      localStorage.setItem(TOKEN_KEY, JSON.stringify(tokens))
      localStorage.setItem(USER_KEY, JSON.stringify(user))
      
      // Update state
      setUser(user)
      setIsAuthenticated(true)
    } catch (error) {
      throw error
    }
  }, [])

  const register = useCallback(async (
    email: string, 
    password: string, 
    name: string, 
    username: string
  ) => {
    try {
      const response = await (authService as any).register({ email, password, name, username })
      const { user, tokens } = response
      
      // Store tokens and user
      localStorage.setItem(TOKEN_KEY, JSON.stringify(tokens))
      localStorage.setItem(USER_KEY, JSON.stringify(user))
      
      // Update state
      setUser(user)
      setIsAuthenticated(true)
    } catch (error) {
      throw error
    }
  }, [])

  const logout = useCallback(async () => {
    try {
      await (authService as any).logout()
    } catch (error) {
      // Even if logout fails on server, clear local state
      console.error('Logout error:', error)
    } finally {
      // Clear local storage and state
      localStorage.removeItem(TOKEN_KEY)
      localStorage.removeItem(USER_KEY)
      authService.clearTokens()
      setUser(null)
      setIsAuthenticated(false)
    }
  }, [])

  const updateUser = useCallback((updatedUser: User) => {
    setUser(updatedUser)
    localStorage.setItem(USER_KEY, JSON.stringify(updatedUser))
  }, [])

  const refreshAuth = useCallback(async () => {
    try {
      const storedTokens = localStorage.getItem(TOKEN_KEY);
      if (!storedTokens) throw new Error('No tokens found');
      
      const tokens: AuthTokens = JSON.parse(storedTokens);
      
      if (!authService) {
        throw new Error('Auth service not initialized');
      }
      
      const newTokens = await (authService as any).refreshToken(tokens.refreshToken);
      
      // Update stored tokens
      localStorage.setItem(TOKEN_KEY, JSON.stringify(newTokens));
      (authService as any).setTokens(newTokens);
      
      // Refresh user data
      const freshUserData = await (authService as any).getCurrentUser();
      setUser(freshUserData);
      setIsAuthenticated(true);
    } catch (error) {
      // Refresh failed, logout user
      await logout()
      throw error
    }
  }, [logout])

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

// HOC for protecting routes
export function withAuth<P extends object>(
  Component: React.ComponentType<P>
): React.ComponentType<P> {
  return function AuthenticatedComponent(props: P) {
    const { isAuthenticated, isLoading } = useAuth()

    if (isLoading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>
      )
    }

    if (!isAuthenticated) {
      // In a real app, redirect to login
      return (
        <div className="flex items-center justify-center min-h-screen">
          <p className="text-gray-600">Please log in to continue</p>
        </div>
      )
    }

    return <Component {...props} />
  }
}