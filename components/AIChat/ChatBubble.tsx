interface ChatMessage {
  id: string
  type: "user" | "ai"
  content: string
  timestamp: Date
}

interface ChatBubbleProps {
  message: ChatMessage
}

export function ChatBubble({ message }: ChatBubbleProps) {
  const isUser = message.type === "user"

  return (
    <div className={`flex items-end gap-2 mb-4 ${isUser ? "justify-end" : "justify-start"}`}>
      {!isUser && (
        <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
          AI
        </div>
      )}
      <div
        className={`max-w-xs md:max-w-md px-4 py-3 rounded-2xl ${
          isUser
            ? "bg-blue-500 text-white rounded-br-lg"
            : "bg-gray-100 dark:bg-slate-700 text-gray-800 dark:text-gray-200 rounded-bl-lg"
        }`}
      >
        <p className="text-sm">{message.content}</p>
      </div>
    </div>
  )
}
