"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Send, Mic, MicOff, GraduationCap, School, Target, Heart, TrendingUp, Loader2, Square, Plus } from "lucide-react"
import { MessageBlock } from "./MessageBlock"
import { aiChatService } from "@/services/aiChatService"
import { toast } from "sonner"
import { useAudioRecorder } from "@/hooks/useAudioRecorder"
import { parseSchoolRecommendations } from "@/utils/parseSchoolRecommendations"

interface ChatMessage {
  id: string
  type: "user" | "ai"
  content: string
  timestamp: Date
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
}

interface ConversationStarter {
  id: string
  title: string
  iconType: "school" | "graduation" | "target" | "heart" | "trending"
  prompt: string
  gradient: string
  delay: number
}

const conversationStarters: ConversationStarter[] = [
  {
    id: "assistant",
    title: "AI Assistant",
    iconType: "target",
    prompt: "Help me manage my tasks, competitions, and activities.",
    gradient: "from-indigo-500 to-purple-500",
    delay: 0
  },
  {
    id: "prep-school",
    title: "Prep School Pick",
    iconType: "school",
    prompt: "I'd like help choosing the right prep school for my academic goals.",
    gradient: "from-blue-500 to-cyan-500",
    delay: 100
  },
  {
    id: "college-pick",
    title: "College Pick",
    iconType: "graduation",
    prompt: "I need guidance on selecting colleges that fit my profile and interests.",
    gradient: "from-purple-500 to-pink-500",
    delay: 200
  },
  {
    id: "chance-me",
    title: "Chance me",
    iconType: "target",
    prompt: "Can you assess my chances of getting into my target schools?",
    gradient: "from-orange-500 to-red-500",
    delay: 300
  },
  {
    id: "support-me",
    title: "Support me",
    iconType: "heart",
    prompt: "I need support with my academic challenges and stress management.",
    gradient: "from-pink-500 to-rose-500",
    delay: 400
  },
  {
    id: "progress-check",
    title: "Progress check",
    iconType: "trending",
    prompt: "Let's review my academic progress and set new goals.",
    gradient: "from-green-500 to-emerald-500",
    delay: 500
  }
]

export function AIChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [inputMessage, setInputMessage] = useState("")
  const [showStarters, setShowStarters] = useState(true)
  const [hoveredStarter, setHoveredStarter] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [sessionId, setSessionId] = useState<string>("")
  const [currentFunnel, setCurrentFunnel] = useState<string>("")
  
  const messagesEndRef = useRef<HTMLDivElement>(null)
  
  // Audio recording hook
  const {
    isRecording,
    recordingTime,
    startRecording,
    stopRecording,
    error: recordingError
  } = useAudioRecorder()

  const getIcon = (iconType: string) => {
    const iconClass = "w-5 h-5"
    switch (iconType) {
      case "school":
        return <School className={iconClass} />
      case "graduation":
        return <GraduationCap className={iconClass} />
      case "target":
        return <Target className={iconClass} />
      case "heart":
        return <Heart className={iconClass} />
      case "trending":
        return <TrendingUp className={iconClass} />
      default:
        return <GraduationCap className={iconClass} />
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    // Initialize session ID when component mounts
    const newSessionId = aiChatService.generateSessionId()
    setSessionId(newSessionId)
  }, [])

  const handleStarterClick = async (starter: ConversationStarter) => {
    try {
      setIsLoading(true)
      setShowStarters(false)
      setCurrentFunnel(starter.id)

      const userMessage: ChatMessage = {
        id: Date.now().toString(),
        type: "user",
        content: starter.prompt,
        timestamp: new Date(),
      }
      
      setMessages([userMessage])

      // Send message to backend
      const response = await aiChatService.sendMessage(
        starter.prompt,
        sessionId,
        starter.id
      )

      // Parse school recommendations if this is a prep-school conversation
      const parsedCards = starter.id === 'prep-school' 
        ? parseSchoolRecommendations(response.response)
        : undefined

      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content: response.response,
        timestamp: new Date(),
        cards: parsedCards && parsedCards.length > 0 ? parsedCards : undefined
      }

      setMessages(prev => [...prev, aiMessage])
    } catch (error: any) {
      console.error('Error starting conversation:', error)
      toast.error(error.message || 'Failed to start conversation')
      setShowStarters(true)
    } finally {
      setIsLoading(false)
    }
  }

  const getStarterResponse = (starterId: string): string => {
    const responses: Record<string, string> = {
      "assistant": "I'm your AI assistant! I can help you create and manage tasks, competitions, and activities. Just tell me what you need - for example: 'Create a task to study for my SAT', 'Add a competition for Science Olympiad', or 'Create an activity for my volunteer work'. How can I help you organize your academic life?",
      "prep-school": "I'd be happy to help you find the perfect prep school! To give you the best recommendations, could you tell me about your academic interests, location preferences, and what matters most to you in a school environment?",
      "college-pick": "Let's find colleges that align with your goals! I'll need to know about your academic performance, intended major, preferred locations, campus size, and any specific programs or activities you're interested in.",
      "chance-me": "I'll help evaluate your admission chances! Please share your GPA, standardized test scores, extracurricular activities, and the schools you're targeting. The more details you provide, the more accurate my assessment will be.",
      "support-me": "I'm here to support you through your academic journey! Whether you're dealing with study stress, time management issues, or need motivation, I'm ready to help. What specific challenges are you facing right now?",
      "progress-check": "Let's review your academic progress together! I can analyze your grades, track your goals, and help you identify areas for improvement. What would you like to focus on first - recent achievements, current challenges, or future goals?"
    }
    return responses[starterId] || "How can I help you today?"
  }

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return

    const messageText = inputMessage.trim()
    setInputMessage("")
    setIsLoading(true)

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: "user",
      content: messageText,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setShowStarters(false)

    try {
      // Make sure we have a funnel set
      const funnelToUse = currentFunnel || "prep-school"
      
      // Send message to backend
      const response = await aiChatService.sendMessage(
        messageText,
        sessionId,
        funnelToUse
      )

      // Parse school recommendations if this is a prep-school conversation
      const parsedCards = currentFunnel === 'prep-school' 
        ? parseSchoolRecommendations(response.response)
        : undefined

      const aiResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content: response.response,
        timestamp: new Date(),
        cards: parsedCards && parsedCards.length > 0 ? parsedCards : undefined,
        actionTaken: response.actionTaken
      }
      
      setMessages((prev) => [...prev, aiResponse])
      
      // Show success notification if an item was created
      if (response.actionTaken) {
        const actionMessages = {
          CREATE_TASK: `Task "${response.actionTaken.details.title}" created successfully!`,
          CREATE_COMPETITION: `Competition "${response.actionTaken.details.title}" added successfully!`,
          CREATE_ACTIVITY: `Activity "${response.actionTaken.details.title}" created successfully!`
        }
        toast.success(actionMessages[response.actionTaken.type])
      }
    } catch (error: any) {
      console.error('Error sending message:', error)
      toast.error(error.message || 'Failed to send message')
      
      // Remove the user message if sending failed
      setMessages((prev) => prev.slice(0, -1))
      setInputMessage(messageText) // Restore the message
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const formatRecordingTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handleAudioRecording = async () => {
    if (!isRecording) {
      // Start recording
      await startRecording()
    } else {
      // Stop recording and send audio
      try {
        setIsLoading(true)
        const audioBlob = await stopRecording()
        
        if (!audioBlob) {
          toast.error('No audio recorded')
          return
        }

        // Check audio size (max 10MB)
        if (audioBlob.size > 10 * 1024 * 1024) {
          toast.error('Audio is too large. Please record a shorter message.')
          return
        }

        setShowStarters(false)
        
        // Add a placeholder message while processing
        const placeholderMessage: ChatMessage = {
          id: Date.now().toString(),
          type: "user",
          content: "🎤 Processing audio...",
          timestamp: new Date(),
        }
        
        setMessages(prev => [...prev, placeholderMessage])

        // Make sure we have a funnel set
        const funnelToUse = currentFunnel || "prep-school"
        
        // Send audio to backend
        const response = await aiChatService.sendAudioMessage(
          audioBlob,
          sessionId,
          funnelToUse
        )

        // Replace placeholder with actual transcribed message
        setMessages(prev => {
          const newMessages = [...prev]
          const lastIndex = newMessages.length - 1
          if (lastIndex >= 0 && newMessages[lastIndex].content === "🎤 Processing audio...") {
            newMessages[lastIndex] = {
              ...newMessages[lastIndex],
              content: response.transcription || "Audio message"
            }
          }
          return newMessages
        })

        // Parse school recommendations if this is a prep-school conversation
        const parsedCards = currentFunnel === 'prep-school' 
          ? parseSchoolRecommendations(response.response)
          : undefined

        // Add AI response
        const aiResponse: ChatMessage = {
          id: (Date.now() + 1).toString(),
          type: "ai",
          content: response.response,
          timestamp: new Date(),
          cards: parsedCards && parsedCards.length > 0 ? parsedCards : undefined,
          actionTaken: response.actionTaken
        }
        
        setMessages(prev => [...prev, aiResponse])
        
        // Show success notification if an item was created
        if (response.actionTaken) {
          const actionMessages = {
            CREATE_TASK: `Task "${response.actionTaken.details.title}" created successfully!`,
            CREATE_COMPETITION: `Competition "${response.actionTaken.details.title}" added successfully!`,
            CREATE_ACTIVITY: `Activity "${response.actionTaken.details.title}" created successfully!`
          }
          toast.success(actionMessages[response.actionTaken.type])
        }
      } catch (error: any) {
        console.error('Error processing audio:', error)
        toast.error(error.message || 'Failed to process audio message')
        
        // Remove the placeholder message
        setMessages(prev => {
          const filtered = prev.filter(msg => msg.content !== "🎤 Processing audio...")
          return filtered
        })
      } finally {
        setIsLoading(false)
      }
    }
  }

  // Show recording error if any
  useEffect(() => {
    if (recordingError) {
      toast.error(recordingError)
    }
  }, [recordingError])

  return (
    <div className="flex flex-col h-screen bg-white dark:bg-slate-900">
      {/* Simplified header */}
      <div className="flex-shrink-0 border-b border-gray-200 dark:border-slate-700">
        <div className="max-w-4xl mx-auto px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <h1 className="text-lg font-semibold text-gray-900 dark:text-white">Academic Advisor</h1>
            <button
              onClick={() => {
                setMessages([])
                setShowStarters(true)
                setSessionId(aiChatService.generateSessionId())
              }}
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
              title="New conversation"
            >
              <Plus size={20} />
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {showStarters && messages.length === 0 ? (
          <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">How can I help you today?</h2>
              <p className="text-gray-600 dark:text-gray-400">Choose a topic to get started</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl mx-auto">
              {conversationStarters.map((starter) => (
                <button
                  key={starter.id}
                  onClick={() => handleStarterClick(starter)}
                  disabled={isLoading}
                  className="group relative p-4 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl hover:border-gray-300 dark:hover:border-slate-600 hover:shadow-sm transition-all text-left"
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg bg-gradient-to-br ${starter.gradient} text-white flex-shrink-0`}>
                      {getIcon(starter.iconType)}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 dark:text-white mb-1">
                        {starter.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                        {starter.prompt}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="messages-container">
            {messages.map((message, index) => (
              <div key={message.id} className="message-fade-in">
                <MessageBlock 
                  message={message} 
                  isLatest={index === messages.length - 1 && message.type === "ai"}
                />
              </div>
            ))}
            {isLoading && (
              <MessageBlock 
                message={{
                  id: "loading",
                  type: "ai",
                  content: "",
                  timestamp: new Date(),
                  isGenerating: true
                }}
              />
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input area - Claude style */}
      <div className="flex-shrink-0 border-t border-gray-200 dark:border-slate-700">
        <div className="max-w-4xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="relative">
            <textarea
              value={inputMessage}
              onChange={(e) => {
                setInputMessage(e.target.value)
                // Auto-resize textarea
                e.target.style.height = 'auto'
                e.target.style.height = Math.min(e.target.scrollHeight, 200) + 'px'
              }}
              onKeyDown={handleKeyDown}
              placeholder="Message Academic Advisor..."
              className="w-full px-4 py-3 pr-24 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white rounded-lg border border-gray-300 dark:border-slate-600 focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none transition-all"
              rows={1}
              style={{ minHeight: '52px' }}
            />
            
            {/* Action buttons */}
            <div className="absolute right-2 bottom-2 flex items-center gap-2">
              <button
                onClick={handleAudioRecording}
                disabled={isLoading}
                className={`p-2 rounded-lg transition-all ${
                  isRecording
                    ? "bg-red-100 text-red-600 animate-pulse"
                    : "text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700"
                }`}
                title={isRecording ? `Recording... ${formatRecordingTime(recordingTime)}` : "Record audio"}
              >
                {isRecording ? (
                  <div className="relative">
                    <Square size={20} fill="currentColor" />
                    {recordingTime > 0 && (
                      <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-xs font-medium bg-red-100 text-red-600 px-2 py-1 rounded-md whitespace-nowrap">
                        {formatRecordingTime(recordingTime)}
                      </span>
                    )}
                  </div>
                ) : (
                  <Mic size={20} />
                )}
              </button>
              
              <button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isLoading}
                className={`p-2 rounded-lg transition-all ${
                  inputMessage.trim() && !isLoading
                    ? "bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-200"
                    : "bg-gray-100 dark:bg-slate-700 text-gray-400 dark:text-gray-500 cursor-not-allowed"
                }`}
              >
                {isLoading ? (
                  <Loader2 size={20} className="animate-spin" />
                ) : (
                  <Send size={20} />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}