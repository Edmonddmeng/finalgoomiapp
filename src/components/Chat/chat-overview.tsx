
"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useAuth } from "@/contexts/AuthContext"
import { StreamChat } from "stream-chat"
import { Input } from "@/components/Utils/input"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/Utils/avatar"
import { Loader2 } from "lucide-react"
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
import { apiClient } from "@/lib/apiClient"

dayjs.extend(relativeTime)

const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY!
const chatClient = StreamChat.getInstance(apiKey)

interface Conversation {
  userId: string
  username: string
  avatar?: string
  unread: number
  lastMessage?: string
  lastMessageAt?: string
  isOnline?: boolean
}

const ITEMS_PER_PAGE = 8

export function ChatOverview() {
  const { user } = useAuth()
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [filteredConversations, setFilteredConversations] = useState<Conversation[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!user || !token) {
      setLoading(false)
      return
    }

    const init = async () => {
      setLoading(true)
      setError(null)
      
      try {
        // Get Stream Chat token from your backend
        // Fix: Send userId directly, not wrapped in data object
        const tokenRes = await apiClient.post('/chat/token', {
          userId: user.id
        })

        if (tokenRes.status !== 200) {
          throw new Error("Failed to get chat token")
        }

        const { token: streamToken } = tokenRes.data
        
        // Connect to Stream Chat
        await chatClient.connectUser(
          { 
            id: user.id, 
            name: user.username,
            image: user.avatar 
          }, 
          streamToken
        )

        // Query channels
        const channels = await chatClient.queryChannels({
          type: "messaging",
          members: { $in: [user.id] }
        })

        const usersMap: Record<string, Conversation> = {}
        const userIds: string[] = []

        // Process channels to extract conversation data
        for (const channel of channels) {
          const count = channel.countUnread()
          const lastMessage = channel.state.messages?.[channel.state.messages.length - 1]
          const member = Object.values(channel.state.members).find(m => m.user?.id !== user.id)

          if (member?.user) {
            const { id, name, image, online } = member.user
            userIds.push(id)
            usersMap[id] = {
              userId: id,
              username: name || id,
              avatar: image || undefined,
              unread: (usersMap[id]?.unread || 0) + count,
              lastMessage: lastMessage?.text || "No messages yet.",
              lastMessageAt: lastMessage?.created_at?.toString(),
              isOnline: online ?? false
            }
          }
        }

        // Fetch additional user profile data
        if (userIds.length > 0) {
          // Fix: Send userIds directly, not wrapped in data object
          const profileRes = await apiClient.post('/users/batch-info', {
            userIds
          })

          if (profileRes.status === 200) {
            const profileData = profileRes.data
            const enriched = profileData.users.map((u: any) => ({
              ...usersMap[u.id],
              username: u.username || usersMap[u.id].username,
              avatar: u.profile_picture || usersMap[u.id].avatar
            }))
            setConversations(enriched)
            setFilteredConversations(enriched)
          } else {
            // Fall back to Stream Chat data if profile fetch fails
            setConversations(Object.values(usersMap))
            setFilteredConversations(Object.values(usersMap))
          }
        } else {
          setConversations([])
          setFilteredConversations([])
        }

      } catch (err) {
        console.error("Chat initialization failed:", err)
        setError("Failed to load conversations. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    init()

    // Cleanup function
    return () => {
      chatClient.disconnectUser().catch(console.error)
    }
  }, [user])

  // Filter conversations based on search term
  useEffect(() => {
    const term = searchTerm.toLowerCase()
    const filtered = conversations.filter(conv =>
      conv.username.toLowerCase().includes(term)
    )
    setFilteredConversations(filtered)
    setCurrentPage(1)
  }, [searchTerm, conversations])

  // Pagination calculations
  const totalPages = Math.ceil(filteredConversations.length / ITEMS_PER_PAGE)
  const paginated = filteredConversations.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-center text-gray-500">
          <p>Please log in to view your messages</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto mt-12 px-4">
      <h1 className="text-3xl font-semibold text-center text-gray-800 mb-6">
        Your Messages
      </h1>

      <Input
        placeholder="Search username..."
        className="mb-6 border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500"
        value={searchTerm}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
      />

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-20 text-gray-500">
          <Loader2 className="animate-spin w-6 h-6" />
          <span className="ml-2">Loading conversations...</span>
        </div>
      ) : paginated.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-500 text-lg">
            {searchTerm ? "No conversations found matching your search." : "No conversations found."}
          </p>
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="mt-2 text-blue-500 hover:text-blue-700 underline"
            >
              Clear search
            </button>
          )}
        </div>
      ) : (
        <ul className="space-y-4">
          {paginated.map(({ userId, username, unread, avatar, lastMessage, lastMessageAt, isOnline }) => (
            <li key={userId}>
              <Link
                href={`/chat/${userId}`}
                className="flex justify-between items-center p-4 rounded-xl border shadow-sm hover:shadow-md transition-shadow duration-200"
              >
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={avatar} alt={username} />
                      <AvatarFallback className="bg-gray-200 text-gray-700">
                        {username.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    {isOnline && (
                      <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
                    )}
                  </div>
                  <div className="flex flex-col min-w-0 flex-1">
                    <span className="font-medium text-gray-900 truncate">
                      {username}
                    </span>
                    <span className="text-sm text-gray-600 truncate max-w-xs">
                      {lastMessage}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  {lastMessageAt && (
                    <span className="text-xs text-gray-400 mb-1">
                      {dayjs(lastMessageAt).fromNow()}
                    </span>
                  )}
                  {unread > 0 && (
                    <span className="text-xs bg-red-500 text-white rounded-full px-2 py-0.5 min-w-[20px] text-center">
                      {unread > 99 ? '99+' : unread}
                    </span>
                  )}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-10">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => prev - 1)}
            className="px-4 py-2 rounded border text-sm hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Previous
          </button>
          <span className="text-sm text-gray-500">
            Page {currentPage} of {totalPages}
          </span>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(prev => prev + 1)}
            className="px-4 py-2 rounded border text-sm hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}