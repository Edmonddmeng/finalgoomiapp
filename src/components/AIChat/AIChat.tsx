"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Send, Mic, X } from "lucide-react"
import { ChatBubble } from "./ChatBubble"
import { useAuth } from "@/contexts/AuthContext"
import { useApiQuery } from "@/hooks/useApiQuery"
import { competitionService } from "@/services/competition.service"
import { academicService } from "@/services/academicService"

interface ChatMessage {
  id: string
  type: "user" | "ai"
  content: string
  timestamp: Date
}

interface AIChatProps {
  isOpen: boolean
  onClose: () => void
}

// Removed - using AcademicInsight from types instead

interface CompetitionInsight {
  id: string
  content: string
  date: string
  competitionId: string
  competitionName: string
}

const initialMessages: ChatMessage[] = [
  {
    id: "1",
    type: "ai",
    content:
      "Hi! I'm your AI academic advisor. I can help you schedule tasks, analyze your progress, suggest study strategies, and much more. I also have access to your personal academic and competition insights to provide more personalized advice. How can I assist you today?",
    timestamp: new Date(),
  },
]

export function AIChat({ isOpen, onClose }: AIChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages)
  const [inputMessage, setInputMessage] = useState("")
  const [isListening, setIsListening] = useState(false)
  const { user } = useAuth()
  
  // Fetch insights from API
  const { data: academicInsights } = useApiQuery(
    () => academicService.getInsights(),
    ['academic-insights'],
    { enabled: !!user && isOpen }
  )
  
  const { data: competitionInsights } = useApiQuery(
    () => competitionService.getAllInsights(),
    ['competition-insights'],
    { enabled: !!user && isOpen }
  )
  
  const personalInsights = academicInsights || []
  const competitionInsightsData = competitionInsights || []
  
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: "user",
      content: inputMessage,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputMessage("")

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content: getAIResponse(inputMessage),
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, aiResponse])
    }, 1000)
  }

  const getAIResponse = (userInput: string): string => {
    const input = userInput.toLowerCase()

    if (input.includes("insight") || input.includes("thought") || input.includes("reflection")) {
      const totalInsights = personalInsights.length + competitionInsightsData.length

      if (totalInsights > 0) {
        let response = `I can see you have ${totalInsights} personal insight${totalInsights > 1 ? "s" : ""} recorded`

        if (personalInsights.length > 0) {
          response += ` including academic reflections`
        }

        if (competitionInsightsData.length > 0) {
          const recentCompetitionInsight = competitionInsightsData[0]
          response += ` and competition insights`
        }

        response += `. Your self-reflection shows great awareness. Based on these insights, I recommend focusing on the patterns you've identified. Would you like specific strategies for the areas you've mentioned?`
        return response
      } else {
        return "I notice you haven't added any personal insights yet. These reflections help me provide more personalized advice. You can add them in the Academic Details or Competition Details sections. What specific challenges are you facing?"
      }
    }

    if (input.includes("competition") || input.includes("contest") || input.includes("tournament")) {
      if (competitionInsightsData.length > 0) {
        return `I can see from your competition insights that you're actively reflecting on your performance. This kind of analysis is crucial for improvement. Based on your insights, I recommend creating specific preparation strategies and tracking your progress. Would you like help developing a competition preparation plan?`
      } else {
        return "Competition preparation is key to success! I can help you develop strategies for training, mental preparation, and performance optimization. Consider tracking your thoughts and reflections in the Competition Details section to help me provide more personalized advice. What competition are you preparing for?"
      }
    }

    if (input.includes("schedule") || input.includes("calendar")) {
      const hasInsights = personalInsights.length > 0 || competitionInsightsData.length > 0
      const insightContext = hasInsights
        ? " Based on your personal reflections, I can see you're focused on improvement."
        : ""
      return `I can help you schedule tasks and events!${insightContext} Based on your current workload, I recommend dedicating 2 hours to your Chemistry lab report tomorrow morning when you're most focused. Would you like me to add this to your calendar?`
    }

    if (input.includes("study") || input.includes("tips")) {
      return `Based on your learning patterns, I suggest using the Pomodoro technique for your upcoming Chemistry exam. You tend to perform better with 25-minute focused sessions. Also, reviewing your AP Chemistry notes from last month could help reinforce key concepts.`
    }

    if (input.includes("progress") || input.includes("goals")) {
      const allInsights = [...personalInsights, ...competitionInsightsData]
      const progressInsights = allInsights.filter(
        (insight) =>
          insight.content.toLowerCase().includes("goal") ||
          insight.content.toLowerCase().includes("improve") ||
          insight.content.toLowerCase().includes("progress"),
      )
      const goalContext =
        progressInsights.length > 0
          ? ` Your personal reflections show you're actively thinking about improvement, which is excellent.`
          : ""
      return `You're making excellent progress!${goalContext} Your GPA has improved by 0.1 points this semester, and you're 75% toward your college readiness goal. To reach 80%, focus on completing your Stanford application essay and maintaining your current academic performance.`
    }

    if (input.includes("college") || input.includes("application")) {
      return "I can help optimize your college applications! Your current profile shows strong STEM focus with leadership experience. Consider highlighting your science fair achievements and volunteer work. Would you like me to suggest specific essay topics that align with your experiences?"
    }

    if (input.includes("grade") || input.includes("academic")) {
      const academicInsights = personalInsights.filter(
        (insight) =>
          insight.content.toLowerCase().includes("grade") ||
          insight.content.toLowerCase().includes("test") ||
          insight.content.toLowerCase().includes("exam"),
      )

      if (academicInsights.length > 0) {
        const recentAcademicInsight = academicInsights[0]
        return `I can see from your recent academic reflection: "${recentAcademicInsight.content.substring(0, 80)}..." This shows great self-awareness. Based on your grade trends and personal insights, I recommend focusing on consistent study habits and seeking help early when you notice challenges. Would you like specific strategies for the subjects you mentioned?`
      }
    }

    return "That's a great question! I can help you with academic planning, study strategies, college preparation, task scheduling, and analyzing your progress. I also have access to your personal academic and competition insights to provide more tailored advice. What specific area would you like to focus on?"
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const toggleListening = () => {
    setIsListening(!isListening)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end justify-center p-4">
      <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl w-full max-w-md h-[600px] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold">AI</span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Academic Advisor</h3>
              <p className="text-xs text-green-600">Online • Has access to your insights</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-full transition-colors"
          >
            <X size={20} className="text-gray-600 dark:text-gray-300" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {messages.map((message) => (
            <ChatBubble key={message.id} message={message} />
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 border-t border-gray-200 dark:border-slate-700">
          <div className="flex items-center gap-2">
            <div className="flex-1 relative">
              <textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me about your academics, competitions, insights, or goals..."
                className="w-full p-3 pr-12 border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                rows={1}
              />
              <button
                onClick={toggleListening}
                className={`absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded-full transition-colors ${
                  isListening
                    ? "bg-red-100 text-red-600"
                    : "hover:bg-gray-100 dark:hover:bg-slate-600 text-gray-600 dark:text-gray-300"
                }`}
              >
                <Mic size={16} />
              </button>
            </div>
            <button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim()}
              className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed hover:from-purple-600 hover:to-pink-600 transition-all"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
