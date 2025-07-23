"use client"

import React from "react"
import { User, Bot } from "lucide-react"
import { SchoolCard } from "./SchoolCard"
import { useTypewriter } from "@/hooks/useTypewriter"

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
  isGenerating?: boolean
}

interface MessageBlockProps {
  message: ChatMessage
  isLatest?: boolean
}

export function MessageBlock({ message, isLatest = false }: MessageBlockProps) {
  const isUser = message.type === "user"
  
  // Use typewriter effect for the latest AI message
  const shouldAnimate = !isUser && isLatest && !message.isGenerating
  const { displayedText, isTyping, isComplete } = useTypewriter(
    shouldAnimate ? message.content : '',
    {
      speed: 5, // Much faster typing
      startDelay: 50
    }
  )
  
  // Determine what content to show
  const contentToShow = shouldAnimate ? displayedText : message.content
  const showCards = !shouldAnimate || isComplete

  return (
    <div className={`group relative ${isUser ? "bg-white dark:bg-slate-900" : "bg-gray-50 dark:bg-slate-800"}`}>
      <div className="max-w-4xl mx-auto">
        <div className="flex gap-6 px-4 py-6 sm:px-6 lg:px-8">
          {/* Avatar - only show for user */}
          {isUser && (
            <div className="flex-shrink-0">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-gray-900 dark:bg-gray-100">
                <User size={18} className="text-white dark:text-gray-900" />
              </div>
            </div>
          )}

          {/* Content */}
          <div className={`flex-1 min-w-0 ${!isUser ? 'ml-0' : ''}`}>
            <div className="prose prose-sm sm:prose dark:prose-invert max-w-none">
              {/* Show loading dots if generating */}
              {!isUser && message.isGenerating ? (
                <span className="inline-flex items-center gap-1">
                  <span className="animate-pulse">●</span>
                  <span className="animate-pulse animation-delay-200">●</span>
                  <span className="animate-pulse animation-delay-400">●</span>
                </span>
              ) : (
                <>
                  {/* Render content with markdown support */}
                  <div 
                    className="text-gray-900 dark:text-gray-100"
                    dangerouslySetInnerHTML={{ __html: formatContent(contentToShow) }}
                  />
                  
                  {/* Show cursor while typing */}
                  {isTyping && (
                    <span className="inline-block w-0.5 h-5 bg-gray-900 dark:bg-gray-100 animate-pulse ml-0.5" />
                  )}
                </>
              )}
            </div>

            {/* School cards - only show after typing is complete */}
            {!isUser && showCards && message.cards && message.cards.length > 0 && (
              <div className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {message.cards.map((school, index) => (
                    <SchoolCard key={school.id} school={school} index={index} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// Format content to handle markdown-like formatting
function formatContent(content: string): string {
  // Convert markdown bold to HTML
  let formatted = content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
  
  // Convert bullet points
  formatted = formatted.replace(/^• /gm, '<span class="mr-2">•</span>')
  
  // Convert arrows
  formatted = formatted.replace(/→/g, '<span class="mx-1">→</span>')
  
  // Convert line breaks to <br> tags
  formatted = formatted.replace(/\n/g, '<br>')
  
  return formatted
}