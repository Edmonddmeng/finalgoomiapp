// hooks/useGlobalUnreadMessages.ts - Global hook that runs independently
import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { StreamChat } from 'stream-chat'
import { apiClient } from '@/lib/apiClient'

const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY!

export function useGlobalUnreadMessages() {
  const { user } = useAuth()
  const [unreadCount, setUnreadCount] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!user) {
      setUnreadCount(0)
      setIsLoading(false)
      return
    }

    const token = localStorage.getItem("token")
    if (!token) {
      setUnreadCount(0)
      setIsLoading(false)
      return
    }

    let chatClient: StreamChat | null = null
    let isSubscribed = true

    const initializeAndListen = async () => {
      try {
        setIsLoading(true)
        setError(null)

        // Create a new Stream Chat client instance
        chatClient = StreamChat.getInstance(apiKey)

        // Get Stream Chat token
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

        // Function to calculate total unread
        const calculateUnread = async () => {
          try {
            if (!chatClient || !isSubscribed) return

            const channels = await chatClient.queryChannels({
              type: "messaging",
              members: { $in: [user.id] }
            })

            const totalUnread = channels.reduce((total, channel) => {
              return total + channel.countUnread()
            }, 0)

            if (isSubscribed) {
              setUnreadCount(totalUnread)
            }
          } catch (error) {
            console.error('Error calculating unread messages:', error)
            if (isSubscribed) {
              setError('Failed to load unread count')
            }
          }
        }

        // Initial count calculation
        await calculateUnread()

        // Listen for new messages and mark as read events
        const handleEvent = (event: any) => {
          if (event.type === 'message.new' || event.type === 'message.read') {
            calculateUnread()
          }
        }

        chatClient.on('message.new', handleEvent)
        chatClient.on('message.read', handleEvent)

        // Cleanup function
        return () => {
          if (chatClient) {
            chatClient.off('message.new', handleEvent)
            chatClient.off('message.read', handleEvent)
          }
        }
      } catch (error) {
        console.error('Error initializing unread messages:', error)
        if (isSubscribed) {
          setError('Failed to initialize unread messages')
          setUnreadCount(0)
        }
      } finally {
        if (isSubscribed) {
          setIsLoading(false)
        }
      }
    }

    const cleanup = initializeAndListen()

    return () => {
      isSubscribed = false
      cleanup.then(cleanupFn => {
        cleanupFn?.()
        if (chatClient) {
          chatClient.disconnectUser().catch(console.error)
        }
      })
    }
  }, [user])

  return { unreadCount, isLoading, error }
}