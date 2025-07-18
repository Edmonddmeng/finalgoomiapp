
import { useState, useMemo } from "react"
import Image from "next/image"
import { CommunityList } from "./CommunityList"
import { CommunityView } from "./CommunityView"
import { PostCard } from "./PostCard"
import type { Community as CommunityType, CommunityPost } from "@/types"
import { Search, Hash, Users, Clock, TrendingUp, UserCheck, Loader2, UserMinus, Pin, Lock } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { useApiQuery } from "@/hooks/useApiQuery"
import { useApiMutation } from "@/hooks/useApiMutation"
import { communityService } from "@/services/communityService"
import { useConfirm } from "@/components/Utils/ConfirmDialog"
import ProfileModal from "@/components/ProfileModal/ProfileModal"
import ChatModal from "@/components/ChatModal/ChatModal"

export function Community() {
  const { user } = useAuth()
  const { confirm } = useConfirm()

      // Add modal state
      const [profileModalOpen, setProfileModalOpen] = useState(false)
      const [selectedUserId, setSelectedUserId] = useState<string | null>(null)
      
        // Chat modal state
  const [chatModalOpen, setChatModalOpen] = useState(false)
  const [chatTargetUserId, setChatTargetUserId] = useState<string | null>(null)
  const [chatTargetUserName, setChatTargetUserName] = useState<string | null>(null)
  

        // Add handler for opening profile modal
        const handleOpenProfile = (userId: string) => {
          setSelectedUserId(userId)
          setProfileModalOpen(true)
        }
      
        const handleCloseProfile = () => {
          setProfileModalOpen(false)
          setSelectedUserId(null)
        }

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
  
  // Fetch data from API
  const { data: communitiesData, isLoading: communitiesLoading, refetch: refetchCommunities } = useApiQuery(
    () => communityService.getCommunities(),
    ['communities'],
    { enabled: !!user }
  )
  
  const { data: postsData, isLoading: postsLoading, refetch: refetchPosts } = useApiQuery(
    () => communityService.getPostsList(),
    ['posts'],
    { enabled: !!user }
  )
  
  const { data: userVotesData } = useApiQuery(
    () => communityService.getUserVotes(),
    ['userVotes'],
    { enabled: !!user }
  )
  
  const communities = communitiesData || []
  const posts = postsData || []
  const userVotes = userVotesData || {}
  
  // Optimistic voting state for posts
  const [optimisticPostUpdates, setOptimisticPostUpdates] = useState<Record<string, {
    upvotes: number
    downvotes: number
    userVote: "up" | "down" | null
  }>>({})

  // Post management state
  const [localPosts, setLocalPosts] = useState<CommunityPost[]>([])

  // Mutations
  const joinCommunityMutation = useApiMutation(
    (communityId: string) => communityService.joinCommunity(communityId)
  )

  const leaveCommunityMutation = useApiMutation(
    (communityId: string) => communityService.leaveCommunity(communityId)
  )
  
  const votePostMutation = useApiMutation(
    ({ postId, voteType }: { postId: string; voteType: "up" | "down" }) => 
      communityService.votePost(postId, voteType)
  )
  
  const createPostMutation = useApiMutation(
    (post: { title: string; content: string; communityId: string; tags?: string[]; photo?: string }) => 
      communityService.createPost(post)
  )
  
  const createCommunityMutation = useApiMutation(
    (community: Omit<CommunityType, "id" | "members" | "joined">) => 
      communityService.createCommunity(community)
  )
  
  const [searchTerm, setSearchTerm] = useState("")
  const [searchType, setSearchType] = useState<"all" | "posts" | "communities" | "my-communities" | "pinned" | "locked">("all")
  const [selectedCommunity, setSelectedCommunity] = useState<CommunityType | null>(null)
  const [sortBy, setSortBy] = useState<"recent" | "popular">("recent")

  // Update local posts when data changes
  useMemo(() => {
    if (posts.length > 0) {
      setLocalPosts(posts)
    }
  }, [posts])

  // Merge posts with optimistic updates
  const postsWithOptimisticUpdates = useMemo(() => {
    return localPosts.map(post => {
      const optimisticUpdate = optimisticPostUpdates[post.id]
      if (optimisticUpdate) {
        return {
          ...post,
          upvotes: optimisticUpdate.upvotes,
          downvotes: optimisticUpdate.downvotes,
          userVote: optimisticUpdate.userVote
        }
      }
      return {
        ...post,
        userVote: userVotes[post.id] || null
      }
    })
  }, [localPosts, optimisticPostUpdates, userVotes])

  // Event handlers
  const handleJoinCommunity = async (communityId: string) => {
    await joinCommunityMutation.mutateAsync(communityId)
    refetchCommunities()
  }

  const handleLeaveCommunity = async (communityId: string) => {
        // Use the custom confirmation dialog
        const confirmed = await confirm({
          title: "Leave Community",
          message: `Are you sure you want to leave this community?`,
          confirmText: "Delete",
          cancelText: "Cancel",
          type: "danger"
        })

        if (confirmed) {
          await leaveCommunityMutation.mutateAsync(communityId)
          refetchCommunities()
        }
  }
  
  const handleVotePost = async (postId: string, voteType: "up" | "down") => {
    const post = localPosts.find(p => p.id === postId)
    if (!post) return

    const currentOptimistic = optimisticPostUpdates[postId]
    const currentVote = currentOptimistic?.userVote || userVotes[postId] || null
    const currentUpvotes = currentOptimistic?.upvotes || post.upvotes
    const currentDownvotes = currentOptimistic?.downvotes || post.downvotes

    let newUpvotes = currentUpvotes
    let newDownvotes = currentDownvotes
    let newVote: "up" | "down" | null = voteType

    // Remove previous vote if it exists
    if (currentVote === "up") {
      newUpvotes -= 1
    } else if (currentVote === "down") {
      newDownvotes -= 1
    }

    // If clicking the same vote, remove it (toggle off)
    if (currentVote === voteType) {
      newVote = null
    } else {
      // Add new vote
      if (voteType === "up") {
        newUpvotes += 1
      } else {
        newDownvotes += 1
      }
    }

    // Update optimistic state immediately
    setOptimisticPostUpdates(prev => ({
      ...prev,
      [postId]: {
        upvotes: newUpvotes,
        downvotes: newDownvotes,
        userVote: newVote
      }
    }))

    try {
      // Call the actual API
      await votePostMutation.mutateAsync({ postId, voteType })
      
      // After successful API call, we can either:
      // 1. Keep the optimistic update (current approach)
      // 2. Or refetch and clear optimistic state
      // For now, we'll keep optimistic state and let it sync naturally
      
    } catch (error) {
      // On error, revert the optimistic update
      setOptimisticPostUpdates(prev => {
        const newState = { ...prev }
        delete newState[postId]
        return newState
      })
      console.error('Failed to vote on post:', error)
    }
  }
  
  const handleCreatePost = async (post: { title: string; content: string; communityId: string; tags?: string[]; photo?: string }) => {
    try {
      const newPost = await createPostMutation.mutateAsync(post)
      // Add new post to local state
      setLocalPosts(prevPosts => [newPost, ...prevPosts])
    } catch (error) {
      console.error('Failed to create post:', error)
    }
  }
  
  const handleCreateCommunity = async (community: Omit<CommunityType, "id" | "members" | "joined">) => {
    await createCommunityMutation.mutateAsync(community)
    refetchCommunities()
  }

  // Handle post updates from PostCard
  const handlePostUpdate = (updatedPost: CommunityPost) => {
    setLocalPosts(prevPosts => 
      prevPosts.map(post => 
        post.id === updatedPost.id ? updatedPost : post
      )
    )
  }

  // Handle post deletion from PostCard
  const handlePostDelete = (postId: string) => {
    setLocalPosts(prevPosts => 
      prevPosts.filter(post => post.id !== postId)
    )
  }

  // Get joined communities
  const joinedCommunities = communities.filter(c => c.joined)
  const joinedCommunityIds = joinedCommunities.map(c => c.id)

  // Filter posts based on search and view type
  const filteredPosts = postsWithOptimisticUpdates.filter(post => {
    // Don't show posts when viewing communities
    if (searchType === "communities" || searchType === "my-communities") return false 
    
    // Filter by post type
    if (searchType === "pinned") {
      if (!post.isPinned) return false
    } else if (searchType === "locked") {
      if (!post.isLocked) return false
    }
    
    // Apply search term filter
    if (!searchTerm) return true // Show all posts when not searching
    const searchLower = searchTerm.toLowerCase()
    return (
      post.title.toLowerCase().includes(searchLower) ||
      post.content.toLowerCase().includes(searchLower) ||
      post.author.name.toLowerCase().includes(searchLower) ||
      post.tags?.some(tag => tag.toLowerCase().includes(searchLower))
    )
  })

  // Filter communities based on search and view type
  const filteredCommunities = communities.filter(community => {
    if (searchType === "my-communities") return community.joined // Show only joined communities
    if (searchType === "posts" || searchType === "pinned" || searchType === "locked") return true // Show all communities when searching posts only
    if (!searchTerm) return true // Show all communities when not searching
    const searchLower = searchTerm.toLowerCase()
    return (
      community.name.toLowerCase().includes(searchLower) ||
      community.description.toLowerCase().includes(searchLower) ||
      community.category.toLowerCase().includes(searchLower)
    )
  })

  // Sort posts based on selected criteria
  const sortedPosts = [...filteredPosts].sort((a, b) => {
    if (sortBy === "recent") {
      // Sort by most recent
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    } else {
      // Sort by most liked in the past week
      const oneWeekAgo = new Date()
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
      
      // Filter posts from the past week
      const aIsRecent = new Date(a.createdAt) >= oneWeekAgo
      const bIsRecent = new Date(b.createdAt) >= oneWeekAgo
      
      // If both are from past week, sort by upvotes
      if (aIsRecent && bIsRecent) {
        return b.upvotes - a.upvotes
      }
      // If only one is from past week, prioritize it
      if (aIsRecent) return -1
      if (bIsRecent) return 1
      // If neither is from past week, sort by upvotes
      return b.upvotes - a.upvotes
    }
  })

  // Show loading state
  if (communitiesLoading || postsLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-3">
          <Loader2 className="animate-spin h-12 w-12 text-teal-600 mx-auto" />
          <p className="text-gray-500 dark:text-gray-400">Loading community...</p>
        </div>
      </div>
    )
  }

  // Calculate popular users based on total upvotes
  const userStats = postsWithOptimisticUpdates.reduce((acc, post) => {
    const authorId = post.author.id
    if (!acc[authorId]) {
      acc[authorId] = {
        author: post.author.name,
        authorAvatar: post.author.avatar || "",
        totalUpvotes: 0,
        postCount: 0
      }
    }
    acc[authorId].totalUpvotes += post.upvotes
    acc[authorId].postCount += 1
    return acc
  }, {} as Record<string, { author: string; authorAvatar: string; totalUpvotes: number; postCount: number }>)

  const popularUsers = Object.values(userStats)
    .sort((a, b) => b.totalUpvotes - a.totalUpvotes)
    .slice(0, 6)

  // If a community is selected, show the community view
  if (selectedCommunity) {
    return (
      <CommunityView
        community={selectedCommunity}
        posts={postsWithOptimisticUpdates}
        userVotes={userVotes}
        isJoined={selectedCommunity.joined}
        onBack={() => setSelectedCommunity(null)}
        onJoin={handleJoinCommunity}
        onLeave={handleLeaveCommunity}
        onVotePost={handleVotePost}
        onCreatePost={handleCreatePost}
        onPostUpdate={handlePostUpdate}
        onPostDelete={handlePostDelete}
      />
    )
  }

  return (
    <div className="space-y-6">
      {/* Title Card Section */}
      <div className="bg-gradient-to-r from-green-500 via-teal-500 to-cyan-500 rounded-3xl p-8 text-white shadow-xl">
        <div className="max-w-4xl">
          <h1 className="text-4xl font-bold mb-3">Community Hub</h1>
          <p className="text-lg text-white/90 leading-relaxed">
            Connect with fellow students, share experiences, and learn from each other's journeys. 
            Your success is amplified when shared with others.
          </p>
          <div className="mt-6 flex items-center gap-6">
            <div className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2 border border-white/30">
              <span className="text-2xl font-bold">{communities.filter(c => c.joined).length}</span>
              <span className="text-sm ml-2 text-white/90">Communities Joined</span>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2 border border-white/30">
              <span className="text-2xl font-bold">{localPosts.length}</span>
              <span className="text-sm ml-2 text-white/90">Active Discussions</span>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2 border border-white/30">
              <span className="text-2xl font-bold">{localPosts.filter(p => p.isPinned).length}</span>
              <span className="text-sm ml-2 text-white/90">Pinned Posts</span>
            </div>
          </div>
        </div>
      </div>

      {/* Search Section */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-slate-700">
        <div className="space-y-4">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search posts, communities, or topics..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
            />
          </div>

          {/* Search Type Toggles */}
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setSearchType("all")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                searchType === "all"
                  ? "bg-teal-500 text-white"
                  : "bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setSearchType("posts")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                searchType === "posts"
                  ? "bg-teal-500 text-white"
                  : "bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600"
              }`}
            >
              <Hash size={16} />
              Posts
            </button>
            <button
              onClick={() => setSearchType("pinned")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                searchType === "pinned"
                  ? "bg-teal-500 text-white"
                  : "bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600"
              }`}
            >
              <Pin size={16} />
              Pinned
            </button>
            <button
              onClick={() => setSearchType("locked")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                searchType === "locked"
                  ? "bg-teal-500 text-white"
                  : "bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600"
              }`}
            >
              <Lock size={16} />
              Locked Posts
            </button>
            <button
              onClick={() => setSearchType("communities")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                searchType === "communities"
                  ? "bg-teal-500 text-white"
                  : "bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600"
              }`}
            >
              <Users size={16} />
              Communities
            </button>
            <button
              onClick={() => setSearchType("my-communities")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                searchType === "my-communities"
                  ? "bg-teal-500 text-white"
                  : "bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600"
              }`}
            >
              <UserCheck size={16} />
              My Communities
            </button>
          </div>

          {/* Search Results Summary */}
          {searchTerm && (
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {searchType === "all" && (
                <span>
                  Found {filteredPosts.length} posts and {filteredCommunities.length} communities
                </span>
              )}
              {searchType === "posts" && <span>Found {filteredPosts.length} posts</span>}
              {searchType === "pinned" && <span>Found {filteredPosts.length} pinned posts</span>}
              {searchType === "locked" && <span>Found {filteredPosts.length} locked posts</span>}
              {searchType === "communities" && <span>Found {filteredCommunities.length} communities</span>}
              {searchType === "my-communities" && <span>Found {filteredCommunities.length} joined communities</span>}
            </div>
          )}
        </div>
      </div>

      {/* Sort Options */}
      {searchType !== "communities" && searchType !== "my-communities" && (
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Sort posts by:</span>
            <div className="flex gap-2">
              <button
                onClick={() => setSortBy("recent")}
                className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                  sortBy === "recent"
                    ? "bg-teal-500 text-white"
                    : "bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600"
                }`}
              >
                <Clock size={16} />
                Most Recent
              </button>
              <button
                onClick={() => setSortBy("popular")}
                className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                  sortBy === "popular"
                    ? "bg-teal-500 text-white"
                    : "bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600"
                }`}
              >
                <TrendingUp size={16} />
                Most Liked (Past Week)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className={`grid grid-cols-1 ${searchType === "all" ? "lg:grid-cols-3" : ""} gap-8`}>
        <div className={`${searchType === "all" ? "lg:col-span-2" : ""} space-y-6`}>
          {searchType !== "communities" && searchType !== "my-communities" && sortedPosts.length > 0 ? (
            sortedPosts.map((post) => (
              <PostCard 
                key={post.id} 
                post={post} 
                onVote={handleVotePost} 
                userVote={post.userVote}
                onPostUpdate={handlePostUpdate}
                onPostDelete={handlePostDelete}
                onOpenProfile={handleOpenProfile}
                onCloseProfile={handleCloseProfile}
              />
            ))
          ) : searchType !== "communities" && searchType !== "my-communities" && (searchTerm || searchType !== "all") ? (
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 text-center">
              <Search className="mx-auto text-gray-400 mb-4" size={48} />
              <p className="text-gray-600 dark:text-gray-400">
                {searchTerm 
                  ? `No ${searchType === "pinned" ? "pinned " : searchType === "locked" ? "locked " : ""}posts found matching "${searchTerm}"`
                  : `No ${searchType === "pinned" ? "pinned " : searchType === "locked" ? "locked " : ""}posts found`
                }
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                {searchType === "pinned" 
                  ? "No posts have been pinned yet"
                  : searchType === "locked"
                  ? "No posts are currently locked"
                  : "Try different keywords or browse communities"
                }
              </p>
            </div>
          ) : searchType === "communities" || searchType === "my-communities" ? (
            filteredCommunities.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredCommunities.map((community) => (
                  <div
                    key={community.id}
                    className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-slate-700 hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => setSelectedCommunity(community)}
                  >
                    <div className="flex items-start gap-4">
                      <Image
                        src={community.avatar || "/placeholder.svg"}
                        alt={community.name}
                        width={60}
                        height={60}
                        className="rounded-full"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{community.name}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{community.category}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">{community.description}</p>
                        <div className="mt-3 flex items-center justify-between">
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            <Users size={14} className="inline mr-1" />
                            {(community.members || 0).toLocaleString()} members
                          </span>
                          <div className="flex gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                if (community.joined) {
                                  handleLeaveCommunity(community.id)
                                } else {
                                  handleJoinCommunity(community.id)
                                }
                              }}
                              className={`px-3 py-1 text-xs font-medium rounded-full transition-all ${
                                community.joined
                                  ? "bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/50 dark:text-green-300"
                                  : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-slate-700 dark:text-gray-300"
                              }`}
                            >
                              {community.joined ? "Joined ✓" : "Join"}
                            </button>
                            {community.joined && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleLeaveCommunity(community.id)
                                }}
                                className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/50 dark:text-red-300 transition-all"
                                title="Leave community"
                              >
                                <UserMinus size={12} />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 text-center">
                <Search className="mx-auto text-gray-400 mb-4" size={48} />
                <p className="text-gray-600 dark:text-gray-400">No communities found matching "{searchTerm}"</p>
                <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">Try different keywords or create your own community</p>
              </div>
            )
          ) : (
            sortedPosts.map((post) => (
              <PostCard 
                key={post.id} 
                post={post} 
                onVote={handleVotePost} 
                userVote={post.userVote}
                onPostUpdate={handlePostUpdate}
                onPostDelete={handlePostDelete}
              />
            ))
          )}
        </div>
        
        {/* Sidebar - Only show when viewing "All" */}
        {searchType === "all" && (
          <div className="lg:col-span-1 space-y-6">
            <CommunityList 
              communities={filteredCommunities.slice(0, 6)} 
              onJoin={handleJoinCommunity}
              onLeave={handleLeaveCommunity}
              onSelectCommunity={setSelectedCommunity}
            />
            
            {/* Popular Users Section */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-slate-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Popular Users</h3>
              <div className="space-y-4">
                {popularUsers.map((user, index) => (
                  <div key={user.author} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <Image
                          src={user.authorAvatar || "/placeholder.svg"}
                          alt={user.author}
                          width={40}
                          height={40}
                          className="rounded-full"
                        />
                        {index < 3 && (
                          <div className={`absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                            index === 0 ? "bg-yellow-500 text-white" : 
                            index === 1 ? "bg-gray-400 text-white" : 
                            "bg-amber-700 text-white"
                          }`}>
                            {index + 1}
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-sm text-gray-800 dark:text-gray-200">{user.author}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {user.totalUpvotes.toLocaleString()} upvotes • {user.postCount} posts
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <TrendingUp size={16} className="text-teal-500" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
            {/* Add the Profile Modal */}
      <ProfileModal 
        isOpen={profileModalOpen}
        onClose={handleCloseProfile}
        userId={selectedUserId}
      />
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