
// Optimized ChatOverview component - removes duplicate Stream Chat connection
"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { StreamChat } from "stream-chat"
import { Input } from "@/components/Utils/input"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/Utils/avatar"
import { Loader2 } from "lucide-react"
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
import { apiClient } from "@/lib/apiClient"
import ChatModal from "@/components/ChatModal/ChatModal"

dayjs.extend(relativeTime)

const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY!

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
  const [chatModalOpen, setChatModalOpen] = useState(false)
  const [chatTargetUserId, setChatTargetUserId] = useState<string | null>(null)
  const [chatTargetUserName, setChatTargetUserName] = useState<string | null>(null) 

  // Chat modal handlers
  const handleOpenChat = (userId: string, userName?: string) => {
    setChatTargetUserId(userId)
    setChatTargetUserName(userName || null)
    setChatModalOpen(true)
  }

  const handleCloseChat = () => {
    setChatModalOpen(false)
    setChatTargetUserId(null)
    setChatTargetUserName(null)
  }

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
        // Check if Stream Chat is already connected (from global hook)
        const chatClient = StreamChat.getInstance(apiKey)
        
        let needsConnection = false
        
        // Check if client is already connected
        if (!chatClient.user) {
          needsConnection = true
        }

        // Connect if needed
        if (needsConnection) {
          const tokenRes = await apiClient.post('/chat/token', {
            userId: user.id
          })

          if (tokenRes.status !== 200) {
            throw new Error("Failed to get chat token")
          }

          const { token: streamToken } = tokenRes.data
          
          await chatClient.connectUser(
            { 
              id: user.id, 
              name: user.username,
              image: user.avatar 
            }, 
            streamToken
          )
        }

        // Query channels to get conversation data
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

    // Note: We don't disconnect here since the global hook manages the connection
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
      <h1 className="text-3xl font-semibold text-center text-gray-800 dark:text-white mb-6">
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
              <button
                onClick={() => handleOpenChat(userId, username)}
                className="w-full flex justify-between items-center p-4 rounded-xl border shadow-sm hover:shadow-md transition-all duration-200 bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-left"
              >
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={avatar} alt={username} />
                      <AvatarFallback className="bg-gray-200 dark:bg-slate-600 text-gray-700 dark:text-gray-200">
                        {username.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    {isOnline && (
                      <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-slate-800 rounded-full" />
                    )}
                  </div>
                  <div className="flex flex-col min-w-0 flex-1">
                    <span className="font-medium text-gray-900 dark:text-white truncate">
                      {username}
                    </span>
                    <span className="text-sm text-gray-600 dark:text-gray-300 truncate max-w-xs">
                      {lastMessage}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  {lastMessageAt && (
                    <span className="text-xs text-gray-400 dark:text-gray-500 mb-1">
                      {dayjs(lastMessageAt).fromNow()}
                    </span>
                  )}
                  {unread > 0 && (
                    <span className="text-xs bg-red-500 text-white rounded-full px-2 py-0.5 min-w-[20px] text-center">
                      {unread > 99 ? '99+' : unread}
                    </span>
                  )}
                </div>
              </button>
            </li>
          ))}
        </ul>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-10">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => prev - 1)}
            className="px-4 py-2 rounded border text-sm hover:bg-gray-100 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Previous
          </button>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Page {currentPage} of {totalPages}
          </span>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(prev => prev + 1)}
            className="px-4 py-2 rounded border text-sm hover:bg-gray-100 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Next
          </button>
        </div>
      )}

      {/* Chat Modal */}
      <ChatModal 
        isOpen={chatModalOpen}
        onClose={handleCloseChat}
        targetUserId={chatTargetUserId}
        targetUserName={chatTargetUserName || undefined}
      />
    </div>
  )
}