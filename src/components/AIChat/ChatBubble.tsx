import { SchoolCard } from "./SchoolCard"

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
}

interface ChatBubbleProps {
  message: ChatMessage
}

export function ChatBubble({ message }: ChatBubbleProps) {
  const isUser = message.type === "user"

  return (
    <>
      <div className={`flex items-start gap-3 mb-6 ${isUser ? "justify-end" : "justify-start"}`}>
        {!isUser && (
          <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0 mt-1">
            AI
          </div>
        )}
        <div
          className={`max-w-[85%] md:max-w-[75%] lg:max-w-[70%] px-5 py-4 rounded-2xl ${
            isUser
              ? "bg-blue-500 text-white rounded-br-lg"
              : "bg-gray-100 dark:bg-slate-700 text-gray-800 dark:text-gray-200 rounded-bl-lg"
          }`}
        >
          <div className="text-sm md:text-base leading-relaxed whitespace-pre-wrap break-words">
            {message.content}
          </div>
        </div>
      </div>
      
      {/* Render school cards if present */}
      {!isUser && message.cards && message.cards.length > 0 && (
        <div className="ml-13 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-[90%]">
            {message.cards.map((school, index) => (
              <SchoolCard key={school.id} school={school} index={index} />
            ))}
          </div>
        </div>
      )}
    </>
  )
}
