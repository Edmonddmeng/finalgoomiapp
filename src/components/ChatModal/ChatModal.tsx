// components/ChatModal/ChatModal.tsx
"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { StreamChat, Channel as StreamChannel } from "stream-chat"
import { Chat, Channel, ChannelHeader, MessageList, MessageInput, Window, Thread } from "stream-chat-react"
import { Loader2, X, MessageCircle } from "lucide-react"
import { apiClient } from "@/lib/apiClient"
import "stream-chat-react/dist/css/v2/index.css"

const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY!

interface ChatModalProps {
  isOpen: boolean
  onClose: () => void
  targetUserId: string | null
  targetUserName?: string
}

export default function ChatModal({ isOpen, onClose, targetUserId, targetUserName }: ChatModalProps) {
  const { user } = useAuth()
  const [channel, setChannel] = useState<StreamChannel | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [chatClient, setChatClient] = useState<StreamChat | null>(null)
  const [chatClientConnected, setChatClientConnected] = useState(false)

  // Close modal when clicking outside or pressing escape
  useEffect(() => {
    if (!isOpen) return

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }

    document.addEventListener('keydown', handleEscape)
    document.body.style.overflow = 'hidden' // Prevent background scroll

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  // Initialize chat when modal opens
  useEffect(() => {
    if (!isOpen || !user || !targetUserId) {
      return
    }

    const initChat = async () => {
      setLoading(true)
      setError(null)

      try {
        const token = localStorage.getItem("token")
        if (!token) {
          throw new Error("No auth token found")
        }

        // Create a new Stream Chat client instance
        const client = StreamChat.getInstance(apiKey)
        setChatClient(client)

        // Get Stream Chat token
        const tokenRes = await apiClient.post('/chat/token', {
          userId: user.id
        })

        if (tokenRes.status !== 200) {
          throw new Error("Failed to get chat token")
        }

        const { token: streamToken } = tokenRes.data

        // Connect to Stream Chat
        await client.connectUser(
          {
            id: user.id,
            name: user.username,
            image: user.avatar
          },
          streamToken
        )

        // Set client as connected
        setChatClientConnected(true)

        // Create or get DM channel
        const dmRes = await apiClient.post('/chat/dm', {
          userId1: user.id,
          userId2: targetUserId,
          userName1: user.username,
          userName2: targetUserName || `User ${targetUserId}`
        })

        if (dmRes.status !== 200) {
          throw new Error("Failed to create/get channel")
        }

        const { channelId } = dmRes.data

        // Get the channel
        const streamChannel = client.channel('messaging', channelId)
        await streamChannel.watch()

        setChannel(streamChannel)
      } catch (err) {
        console.error("Chat initialization failed:", err)
        setError("Failed to load chat. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    initChat()
  }, [isOpen, user, targetUserId, targetUserName])

  // Cleanup when modal closes
  useEffect(() => {
    if (!isOpen) {
      // Cleanup when modal closes
      if (channel) {
        channel.stopWatching()
        setChannel(null)
      }
      if (chatClient && chatClientConnected) {
        chatClient.disconnectUser().catch(console.error)
        setChatClient(null)
        setChatClientConnected(false)
      }
    }
  }, [isOpen, channel, chatClient, chatClientConnected])

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop with blur */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
        onClick={handleBackdropClick}
      />
      
      {/* Modal Content */}
      <div className="relative bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-4xl h-[80vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-800">
          <div className="flex items-center gap-3">
            <MessageCircle className="w-6 h-6 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Chat with {targetUserName || `User ${targetUserId}`}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-full transition-colors"
          >
            <X size={20} className="text-gray-600 dark:text-gray-300" />
          </button>
        </div>

        {/* Chat Content */}
        <div className="flex-1 relative overflow-hidden">
          {loading ? (
            <div className="flex justify-center items-center h-full">
              <div className="flex items-center text-gray-500">
                <Loader2 className="animate-spin w-6 h-6 mr-2" />
                <span>Loading chat...</span>
              </div>
            </div>
          ) : error ? (
            <div className="flex justify-center items-center h-full">
              <div className="text-center">
                <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-red-600 mb-4">{error}</p>
                <button
                  onClick={onClose}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          ) : !user ? (
            <div className="flex justify-center items-center h-full">
              <div className="text-center text-gray-500">
                <p>Please log in to access chat</p>
              </div>
            </div>
          ) : !channel || !chatClientConnected || !chatClient ? (
            <div className="flex justify-center items-center h-full">
              <div className="text-center text-gray-500">
                <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p>Failed to load chat channel</p>
                <button
                  onClick={onClose}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          ) : (
            <div className="h-full">
              <Chat client={chatClient}>
                <Channel channel={channel}>
                  <Window>
                    <ChannelHeader />
                    <MessageList />
                    <MessageInput />
                  </Window>
                  <Thread />
                </Channel>
              </Chat>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

