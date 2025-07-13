import { apiClient } from '@/lib/apiClient'
import { User } from '@/types'
import { setAuthToken } from '@/lib/apiClient' 

interface LoginResponse {
  user: User
  tokens: {
    accessToken: string
    refreshToken: string
  }
}

interface RegisterData {
  email: string
  password: string
  name: string
  username: string
}

class AuthService {
  private accessToken: string | null = null
  private refreshTokenValue: string | null = null

  

  setTokens(tokens: { accessToken: string; refreshToken: string }) {
    this.accessToken = tokens.accessToken
    this.refreshTokenValue = tokens.refreshToken

    setAuthToken(tokens.accessToken)
    
    // Set default authorization header
    // if (apiClient.defaults) {
    //   apiClient.defaults.headers.common['Authorization'] = `Bearer ${tokens.accessToken}`
    // }
  }

  clearTokens() {
    this.accessToken = null
    this.refreshTokenValue = null

    setAuthToken(null)

    // Remove authorization header
    // if (apiClient.defaults) {
    //   delete apiClient.defaults.headers.common['Authorization']
    // }
  }

  getAccessToken() {
    return this.accessToken
  }

  getRefreshToken() {
    return this.refreshTokenValue
  }

  async login(email: string, password: string): Promise<LoginResponse> {
    const response = await apiClient.post('/auth/login', {
      email,
      password
    })

    const { token, id } = response.data

    // Fetch user separately
    const userResponse = await apiClient.get(`/users/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    const user = userResponse.data
    // Manually construct expected shape
    const loginResponse: LoginResponse = {
      user,
      tokens: {
        accessToken: token,
    refreshToken: '' // or fetch from backend if available
  }
}

this.setTokens(loginResponse.tokens)
console.log('Login success:', user, loginResponse.tokens)

return loginResponse
  }

  async register(data: RegisterData): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>('/auth/register', data)
    
    this.setTokens(response.data.tokens)
    return response.data
  }

  async logout(): Promise<void> {
    try {
      await apiClient.post('/auth/logout')
    } finally {
      this.clearTokens()
    }
  }

  async refreshToken(refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> {
    const response = await apiClient.post<{ 
      accessToken: string; 
      refreshToken: string 
    }>('/auth/refresh', {
      refreshToken
    })
    
    const newTokens = response.data
    this.setTokens(newTokens)
    return newTokens
  }

  async getCurrentUser(): Promise<User> {
  if (!this.accessToken) throw new Error('No access token set')
  const tokenPayload = JSON.parse(atob(this.accessToken.split('.')[1]))
  const userId = tokenPayload.sub || tokenPayload.id // depends on your JWT structure

const response = await apiClient.get<Partial<User>>(`/users/${userId}`)

return {
  ...response.data,
  name: response.data.username ?? "",
  progressLevel: 0,
  currentStreak: 0,
  totalPoints: 0,
  achievements: [],
  stats: {
    totalCompetitions: 0,
    totalActivities: 0,
    averageGPA: 0,
    tasksCompleted: 0,
  },
} as User

  }


  async requestPasswordReset(email: string): Promise<void> {
    await apiClient.post('/auth/forgot-password', { email })
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    await apiClient.post('/auth/reset-password', {
      token,
      newPassword
    })
  }

  async verifyEmail(token: string): Promise<void> {
    await apiClient.post('/auth/verify-email', { token })
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    await apiClient.post('/auth/change-password', {
      currentPassword,
      newPassword
    })
  }
}

export const authService = new AuthService()