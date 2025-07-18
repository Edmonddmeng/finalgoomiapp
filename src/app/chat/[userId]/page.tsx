
// app/chat/[userId]/page.tsx
"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { StreamChat, Channel as StreamChannel } from "stream-chat"
import { Chat, Channel, ChannelHeader, MessageList, MessageInput, Window, Thread } from "stream-chat-react"
import { Loader2, ArrowLeft } from "lucide-react"
import { apiClient } from "@/lib/apiClient"
import Link from "next/link"
import "stream-chat-react/dist/css/v2/index.css"

const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY!

export default function ChatPage() {
  const { userId } = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const [channel, setChannel] = useState<StreamChannel | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [chatClient, setChatClient] = useState<StreamChat | null>(null)
  const [chatClientConnected, setChatClientConnected] = useState(false)


  useEffect(() => {
    if (!user || !userId) {
      setLoading(false)
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

        // Create a new Stream Chat client instance for this page
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
          userId2: userId as string,
          userName1: user.username,
          userName2: `User ${userId}` // This will be updated when you fetch user info
        })

        console.log("dmRes", dmRes)

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

    return () => {
      if (channel) {
        channel.stopWatching()
      }
      // Disconnect client when component unmounts
      if (chatClient) {
        chatClient.disconnectUser().catch(console.error)
      }
      setChatClientConnected(false)
    }
  }, [user, userId])

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center text-gray-500">
          <p>Please log in to access chat</p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="flex items-center text-gray-500">
          <Loader2 className="animate-spin w-6 h-6 mr-2" />
          <span>Loading chat...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => router.back()}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Go Back
          </button>
        </div>
      </div>
    )
  }

  if (!channel || !chatClientConnected || !chatClient) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center text-gray-500">
          <p>Failed to load chat channel</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen flex flex-col">
      {/* Header with back button */}
      <div className="bg-white border-b border-gray-200 p-4 flex items-center">
        <Link 
          href="/messages" 
          className="mr-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-lg font-semibold">Chat</h1>
      </div>

      {/* Chat interface */}
      <div className="flex-1 relative">
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
    </div>
  )
}