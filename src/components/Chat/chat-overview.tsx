
// // Optimized ChatOverview component - removes duplicate Stream Chat connection
// "use client"

// import { useEffect, useState } from "react"
// import { useAuth } from "@/contexts/AuthContext"
// import { StreamChat } from "stream-chat"
// import { Input } from "@/components/Utils/input"
// import { Avatar, AvatarImage, AvatarFallback } from "@/components/Utils/avatar"
// import { Loader2 } from "lucide-react"
// import dayjs from "dayjs"
// import relativeTime from "dayjs/plugin/relativeTime"
// import { apiClient } from "@/lib/apiClient"
// import ChatModal from "@/components/ChatModal/ChatModal"

// dayjs.extend(relativeTime)

// const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY!

// interface Conversation {
//   userId: string
//   username: string
//   avatar?: string
//   unread: number
//   lastMessage?: string
//   lastMessageAt?: string
//   isOnline?: boolean
// }

// const ITEMS_PER_PAGE = 8

// export function ChatOverview() {
//   const { user } = useAuth()
//   const [conversations, setConversations] = useState<Conversation[]>([])
//   const [filteredConversations, setFilteredConversations] = useState<Conversation[]>([])
//   const [searchTerm, setSearchTerm] = useState("")
//   const [currentPage, setCurrentPage] = useState(1)
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState<string | null>(null)
//   const [chatModalOpen, setChatModalOpen] = useState(false)
//   const [chatTargetUserId, setChatTargetUserId] = useState<string | null>(null)
//   const [chatTargetUserName, setChatTargetUserName] = useState<string | null>(null) 

//   // Chat modal handlers
//   const handleOpenChat = (userId: string, userName?: string) => {
//     setChatTargetUserId(userId)
//     setChatTargetUserName(userName || null)
//     setChatModalOpen(true)
//   }

//   const handleCloseChat = () => {
//     setChatModalOpen(false)
//     setChatTargetUserId(null)
//     setChatTargetUserName(null)
//   }

//   useEffect(() => {
//     const token = localStorage.getItem("token")
//     if (!user || !token) {
//       setLoading(false)
//       return
//     }

//     const init = async () => {
//       setLoading(true)
//       setError(null)
      
//       try {
//         // Check if Stream Chat is already connected (from global hook)
//         const chatClient = StreamChat.getInstance(apiKey)
        
//         let needsConnection = false
        
//         // Check if client is already connected
//         if (!chatClient.user) {
//           needsConnection = true
//         }

//         // Connect if needed
//         if (needsConnection) {
//           const tokenRes = await apiClient.post('/chat/token', {
//             userId: user.id
//           })

//           if (tokenRes.status !== 200) {
//             throw new Error("Failed to get chat token")
//           }

//           const { token: streamToken } = tokenRes.data
          
//           await chatClient.connectUser(
//             { 
//               id: user.id, 
//               name: user.username,
//               image: user.avatar 
//             }, 
//             streamToken
//           )
//         }

//         // Query channels to get conversation data
//         const channels = await chatClient.queryChannels({
//           type: "messaging",
//           members: { $in: [user.id] }
//         })

//         const usersMap: Record<string, Conversation> = {}
//         const userIds: string[] = []

//         // Process channels to extract conversation data
//         for (const channel of channels) {
//           const count = channel.countUnread()
//           const lastMessage = channel.state.messages?.[channel.state.messages.length - 1]
//           const member = Object.values(channel.state.members).find(m => m.user?.id !== user.id)

//           if (member?.user) {
//             const { id, name, image, online } = member.user
//             userIds.push(id)
//             usersMap[id] = {
//               userId: id,
//               username: name || id,
//               avatar: image || undefined,
//               unread: (usersMap[id]?.unread || 0) + count,
//               lastMessage: lastMessage?.text || "No messages yet.",
//               lastMessageAt: lastMessage?.created_at?.toString(),
//               isOnline: online ?? false
//             }
//           }
//         }

//         // Fetch additional user profile data
//         if (userIds.length > 0) {
//           const profileRes = await apiClient.post('/users/batch-info', {
//             userIds
//           })

//           if (profileRes.status === 200) {
//             const profileData = profileRes.data
//             const enriched = profileData.users.map((u: any) => ({
//               ...usersMap[u.id],
//               username: u.username || usersMap[u.id].username,
//               avatar: u.profile_picture || usersMap[u.id].avatar
//             }))
//             setConversations(enriched)
//             setFilteredConversations(enriched)
//           } else {
//             // Fall back to Stream Chat data if profile fetch fails
//             setConversations(Object.values(usersMap))
//             setFilteredConversations(Object.values(usersMap))
//           }
//         } else {
//           setConversations([])
//           setFilteredConversations([])
//         }

//       } catch (err) {
//         console.error("Chat initialization failed:", err)
//         setError("Failed to load conversations. Please try again.")
//       } finally {
//         setLoading(false)
//       }
//     }

//     init()

//     // Note: We don't disconnect here since the global hook manages the connection
//   }, [user])

//   // Filter conversations based on search term
//   useEffect(() => {
//     const term = searchTerm.toLowerCase()
//     const filtered = conversations.filter(conv =>
//       conv.username.toLowerCase().includes(term)
//     )
//     setFilteredConversations(filtered)
//     setCurrentPage(1)
//   }, [searchTerm, conversations])

//   // Pagination calculations
//   const totalPages = Math.ceil(filteredConversations.length / ITEMS_PER_PAGE)
//   const paginated = filteredConversations.slice(
//     (currentPage - 1) * ITEMS_PER_PAGE,
//     currentPage * ITEMS_PER_PAGE
//   )

//   if (!user) {
//     return (
//       <div className="flex justify-center items-center min-h-[400px]">
//         <div className="text-center text-gray-500">
//           <p>Please log in to view your messages</p>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="max-w-3xl mx-auto mt-12 px-4">
//       <h1 className="text-3xl font-semibold text-center text-gray-800 dark:text-white mb-6">
//         Your Messages
//       </h1>

//       <Input
//         placeholder="Search username..."
//         className="mb-6 border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500"
//         value={searchTerm}
//         onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
//       />

//       {error && (
//         <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
//           <p className="text-red-600 text-sm">{error}</p>
//         </div>
//       )}

//       {loading ? (
//         <div className="flex justify-center py-20 text-gray-500">
//           <Loader2 className="animate-spin w-6 h-6" />
//           <span className="ml-2">Loading conversations...</span>
//         </div>
//       ) : paginated.length === 0 ? (
//         <div className="text-center py-20">
//           <p className="text-gray-500 text-lg">
//             {searchTerm ? "No conversations found matching your search." : "No conversations found."}
//           </p>
//           {searchTerm && (
//             <button
//               onClick={() => setSearchTerm("")}
//               className="mt-2 text-blue-500 hover:text-blue-700 underline"
//             >
//               Clear search
//             </button>
//           )}
//         </div>
//       ) : (
//         <ul className="space-y-4">
//           {paginated.map(({ userId, username, unread, avatar, lastMessage, lastMessageAt, isOnline }) => (
//             <li key={userId}>
//               <button
//                 onClick={() => handleOpenChat(userId, username)}
//                 className="w-full flex justify-between items-center p-4 rounded-xl border shadow-sm hover:shadow-md transition-all duration-200 bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-left"
//               >
//                 <div className="flex items-center gap-4">
//                   <div className="relative">
//                     <Avatar className="w-12 h-12">
//                       <AvatarImage src={avatar} alt={username} />
//                       <AvatarFallback className="bg-gray-200 dark:bg-slate-600 text-gray-700 dark:text-gray-200">
//                         {username.charAt(0).toUpperCase()}
//                       </AvatarFallback>
//                     </Avatar>
//                     {isOnline && (
//                       <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-slate-800 rounded-full" />
//                     )}
//                   </div>
//                   <div className="flex flex-col min-w-0 flex-1">
//                     <span className="font-medium text-gray-900 dark:text-white truncate">
//                       {username}
//                     </span>
//                     <span className="text-sm text-gray-600 dark:text-gray-300 truncate max-w-xs">
//                       {lastMessage}
//                     </span>
//                   </div>
//                 </div>
//                 <div className="flex flex-col items-end">
//                   {lastMessageAt && (
//                     <span className="text-xs text-gray-400 dark:text-gray-500 mb-1">
//                       {dayjs(lastMessageAt).fromNow()}
//                     </span>
//                   )}
//                   {unread > 0 && (
//                     <span className="text-xs bg-red-500 text-white rounded-full px-2 py-0.5 min-w-[20px] text-center">
//                       {unread > 99 ? '99+' : unread}
//                     </span>
//                   )}
//                 </div>
//               </button>
//             </li>
//           ))}
//         </ul>
//       )}

//       {totalPages > 1 && (
//         <div className="flex justify-center items-center gap-4 mt-10">
//           <button
//             disabled={currentPage === 1}
//             onClick={() => setCurrentPage(prev => prev - 1)}
//             className="px-4 py-2 rounded border text-sm hover:bg-gray-100 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//           >
//             Previous
//           </button>
//           <span className="text-sm text-gray-500 dark:text-gray-400">
//             Page {currentPage} of {totalPages}
//           </span>
//           <button
//             disabled={currentPage === totalPages}
//             onClick={() => setCurrentPage(prev => prev + 1)}
//             className="px-4 py-2 rounded border text-sm hover:bg-gray-100 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//           >
//             Next
//           </button>
//         </div>
//       )}

//       {/* Chat Modal */}
//       <ChatModal 
//         isOpen={chatModalOpen}
//         onClose={handleCloseChat}
//         targetUserId={chatTargetUserId}
//         targetUserName={chatTargetUserName || undefined}
//       />
//     </div>
//   )
// }

// Professional ChatOverview component with modern design
"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { StreamChat } from "stream-chat"
import { Input } from "@/components/Utils/input"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/Utils/avatar"
import { 
  Loader2, 
  Search, 
  MessageCircle, 
  Users, 
  Clock,
  X,
  ChevronLeft,
  ChevronRight
} from "lucide-react"
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

  const totalUnreadCount = conversations.reduce((sum, conv) => sum + conv.unread, 0)

  if (!user) {
    return (
      <div className="min-h-[600px] bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm max-w-md mx-4">
          <MessageCircle className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Access Required</h2>
          <p className="text-gray-600 dark:text-gray-400">Please log in to view your conversations</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-2xl">
              <MessageCircle className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Messages</h1>
              {totalUnreadCount > 0 && (
                <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                  {totalUnreadCount} unread message{totalUnreadCount !== 1 ? 's' : ''}
                </p>
              )}
            </div>
          </div>
          <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
            Stay connected with your network through secure messaging
          </p>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <Users className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{conversations.length}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Conversations</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <MessageCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalUnreadCount}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Unread</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <div className="h-5 w-5 bg-green-500 rounded-full"></div>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {conversations.filter(c => c.isOnline).length}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Online</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search Section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 h-5 w-5" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-12 py-4 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
          {searchTerm && (
            <div className="mt-3 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <Search className="h-4 w-4" />
              <span>Found {filteredConversations.length} result{filteredConversations.length !== 1 ? 's' : ''} for "{searchTerm}"</span>
            </div>
          )}
        </div>

        {/* Error State */}
        {error && (
          <div className="mb-8 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                <X className="h-5 w-5 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <h3 className="font-medium text-red-800 dark:text-red-200">Connection Error</h3>
                <p className="text-red-600 dark:text-red-400 text-sm mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Content Area */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600 dark:text-blue-400 mb-4" />
              <p className="text-gray-600 dark:text-gray-400 font-medium">Loading conversations...</p>
              <p className="text-gray-500 dark:text-gray-500 text-sm mt-1">This may take a moment</p>
            </div>
          ) : paginated.length === 0 ? (
            <div className="text-center py-16">
              {searchTerm ? (
                <>
                  <Search className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No Results Found</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
                    We couldn't find any conversations matching "{searchTerm}". Try adjusting your search terms.
                  </p>
                  <button
                    onClick={() => setSearchTerm("")}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
                  >
                    Clear Search
                  </button>
                </>
              ) : (
                <>
                  <MessageCircle className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No Conversations Yet</h3>
                  <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                    Start connecting with others to begin your messaging journey. Your conversations will appear here.
                  </p>
                </>
              )}
            </div>
          ) : (
            <>
              {/* Conversations List */}
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {paginated.map(({ userId, username, unread, avatar, lastMessage, lastMessageAt, isOnline }) => (
                  <button
                    key={userId}
                    onClick={() => handleOpenChat(userId, username)}
                    className="w-full flex items-center gap-4 p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-200 focus:outline-none focus:bg-blue-50 dark:focus:bg-blue-900/20 focus:ring-2 focus:ring-blue-500 focus:ring-inset text-left group"
                  >
                    {/* Avatar with Online Status */}
                    <div className="relative flex-shrink-0">
                      <Avatar className="w-14 h-14 ring-2 ring-gray-100 dark:ring-gray-700 group-hover:ring-blue-200 dark:group-hover:ring-blue-800 transition-all">
                        <AvatarImage src={avatar} alt={username} />
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold text-lg">
                          {username.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      {isOnline && (
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-3 border-white dark:border-gray-800 rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold text-gray-900 dark:text-white truncate text-lg">
                          {username}
                        </h3>
                        <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                          {lastMessageAt && (
                            <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                              <Clock className="h-3 w-3" />
                              <span>{dayjs(lastMessageAt).fromNow()}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <p className="text-gray-600 dark:text-gray-300 truncate text-sm leading-relaxed max-w-xs sm:max-w-md">
                          {lastMessage}
                        </p>
                        {unread > 0 && (
                          <div className="flex-shrink-0 ml-2">
                            <span className="inline-flex items-center justify-center px-2.5 py-1 text-xs font-bold text-white bg-blue-600 rounded-full min-w-[24px] animate-pulse">
                              {unread > 99 ? '99+' : unread}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <Users className="h-4 w-4" />
                      <span>
                        Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, filteredConversations.length)} of {filteredConversations.length} conversations
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <button
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(prev => prev - 1)}
                        className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <ChevronLeft className="h-4 w-4" />
                        Previous
                      </button>
                      
                      <span className="px-3 py-2 text-sm text-gray-600 dark:text-gray-400">
                        {currentPage} of {totalPages}
                      </span>
                      
                      <button
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage(prev => prev + 1)}
                        className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        Next
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

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