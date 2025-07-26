import { apiClient } from '@/lib/apiClient'
import axios from 'axios'
import { v4 as uuidv4 } from 'uuid'

export interface ChatMessage {
  id?: string
  role: 'user' | 'assistant'
  content: string
  created_at?: string
  sequence_number?: number
  token_count?: number
  context_retrieved?: any
}

export interface ChatSession {
  id: string
  user_id: string
  funnel_type: string
  metadata?: any
  token_count?: number
  message_count?: number
  is_active: boolean
  created_at?: string
  last_activity?: string
}

export interface ChatResponse {
  response: string
  sessionId: string
  transcription?: string
  cards?: Array<{
    id: string
    name: string
    imageUrl: string
    acceptanceRate: number
    location: string
    type: "Boarding" | "Day" | "Boarding/Day"
    ranking?: number
    websiteUrl: string
  }>
  usage?: {
    tokensUsed: number
    responseTime: number
    contextItems: number
  }
  actionTaken?: {
    type: 'CREATE_TASK' | 'CREATE_COMPETITION' | 'CREATE_ACTIVITY'
    itemId: string
    details: {
      title: string
      dueDate?: string
      description?: string
      category?: string
      [key: string]: any
    }
  }
  translationId?: string
}

export interface ChatHistoryResponse {
  session: ChatSession
  messages: ChatMessage[]
}

class AIChatService {
  /**
   * Send a chat message to the AI
   */
  async sendMessage(message: string, sessionId: string, funnel: string): Promise<ChatResponse> {
    try {
      const response = await apiClient.post<ChatResponse>('/ai-chat/chat', {
        message,
        sessionId,
        funnel
      })
      
      return response.data
    } catch (error: any) {
      console.error('Error sending chat message:', error)
      
      // Handle specific error cases from backend
      if (error.code === 'RATE_LIMITED') {
        throw new Error(`Too many messages. Please wait ${error.details?.retryAfter || 60} seconds.`)
      }
      
      if (error.code === 'MESSAGE_TOO_LONG') {
        throw new Error('Your message is too long. Please keep it under 2000 characters.')
      }
      
      if (error.code === 'UNSUPPORTED_FUNNEL') {
        throw new Error(`The ${error.details?.funnel || 'selected'} funnel is not yet available.`)
      }
      
      throw error
    }
  }

  /**
   * Get chat history for a specific session
   */
  async getChatHistory(sessionId: string): Promise<ChatHistoryResponse> {
    try {
      const response = await apiClient.get<ChatHistoryResponse>(`/ai-chat/sessions/${sessionId}/history`)
      return response.data
    } catch (error: any) {
      console.error('Error fetching chat history:', error)
      
      if (error.code === 'NOT_FOUND') {
        throw new Error('Chat session not found')
      }
      
      throw error
    }
  }

  /**
   * Get all chat sessions for the current user
   */
  async getUserSessions(funnel?: string): Promise<ChatSession[]> {
    try {
      const params = funnel ? { funnel } : {}
      const response = await apiClient.get<{ sessions: ChatSession[] }>('/ai-chat/sessions', { params })
      return response.data.sessions
    } catch (error) {
      console.error('Error fetching user sessions:', error)
      throw error
    }
  }

  /**
   * Generate a new session ID
   */
  generateSessionId(): string {
    return uuidv4()
  }

  /**
   * Send audio file for speech-to-text and chat processing
   */
  async sendAudioMessage(audioBlob: Blob, sessionId: string, funnel: string): Promise<ChatResponse> {
    try {
      // Create form data
      const formData = new FormData()
      
      // Determine the file extension based on the blob type
      const fileExtension = audioBlob.type.split('/')[1] || 'webm'
      const fileName = `audio_${Date.now()}.${fileExtension}`
      
      // Append the audio file
      formData.append('audio', audioBlob, fileName)
      formData.append('sessionId', sessionId)
      formData.append('funnel', funnel)

      // Get the auth token
      const token = localStorage.getItem('accessToken') || localStorage.getItem('token')
      
      // Make the request with axios to properly handle multipart/form-data
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL || 'https://goomi-community-backend.onrender.com/api'}/ai-chat/speech-to-text-chat`,
        formData,
        {
          headers: {
            'Authorization': token ? `Bearer ${token}` : '',
            // Let axios set the Content-Type with boundary
          },
          timeout: 60000 // 60 seconds timeout for audio processing
        }
      )

      return response.data
    } catch (error: any) {
      console.error('Error sending audio message:', error)
      
      // Handle specific error cases
      if (error.response?.status === 500) {
        console.error('Backend error details:', error.response?.data)
        throw new Error('Server error processing audio. The backend may be missing the speechToTextChat controller or OpenAI configuration.')
      }
      
      if (error.response?.data?.code === 'RATE_LIMITED') {
        throw new Error(`Too many messages. Please wait ${error.response.data.retryAfter || 60} seconds.`)
      }
      
      if (error.response?.data?.code === 'INVALID_AUDIO') {
        throw new Error('Invalid audio file. Please try recording again.')
      }

      if (error.response?.data?.code === 'TRANSCRIPTION_FAILED') {
        throw new Error('Could not understand the audio. Please speak clearly and try again.')
      }
      
      if (error.response?.status === 413) {
        throw new Error('Audio file is too large. Please record a shorter message.')
      }
      
      throw new Error(error.response?.data?.error || error.response?.data?.message || 'Failed to process audio message')
    }
  }

  /**
   * Format messages for display (converts backend format to frontend format)
   */
  formatMessagesForDisplay(messages: ChatMessage[]): Array<{
    id: string
    type: 'user' | 'ai'
    content: string
    timestamp: Date
  }> {
    return messages.map((msg, index) => ({
      id: msg.id || `msg-${index}-${Date.now()}`,
      type: msg.role === 'user' ? 'user' : 'ai',
      content: msg.content,
      timestamp: msg.created_at ? new Date(msg.created_at) : new Date()
    }))
  }
}

export const aiChatService = new AIChatService()