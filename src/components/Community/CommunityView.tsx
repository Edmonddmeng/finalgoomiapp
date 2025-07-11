"use client"
import { useState } from "react"
import type { Community as CommunityType, CommunityPost } from "@/types"
import { ChevronLeft, Users, Plus, Send, X, Clock, TrendingUp } from "lucide-react"
import { PostCard } from "./PostCard"

interface CommunityViewProps {
  community: CommunityType
  posts: CommunityPost[]
  userVotes: Record<string, "up" | "down">
  isJoined: boolean
  onBack: () => void
  onJoin: (communityId: string) => void
  onVotePost: (postId: string, voteType: "up" | "down") => void
  onCreatePost: (post: { title: string; content: string; communityId: string; tags?: string[] }) => void
}

export function CommunityView({ 
  community, 
  posts, 
  userVotes,
  isJoined,
  onBack, 
  onJoin, 
  onVotePost,
  onCreatePost 
}: CommunityViewProps) {
  const [showCreatePost, setShowCreatePost] = useState(false)
  const [sortBy, setSortBy] = useState<"recent" | "popular">("recent")
  const [newPost, setNewPost] = useState({
    title: "",
    content: "",
    tags: [] as string[],
    tagInput: ""
  })

  // Filter posts for this specific community
  const communityPosts = posts.filter(post => post.communityId === community.id)

  // Sort posts based on selected criteria
  const sortedCommunityPosts = [...communityPosts].sort((a, b) => {
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

  const handleCreatePost = () => {
    if (!newPost.title.trim() || !newPost.content.trim()) return

    onCreatePost({
      title: newPost.title.trim(),
      content: newPost.content.trim(),
      communityId: community.id,
      tags: newPost.tags
    })

    // Reset form
    setNewPost({ title: "", content: "", tags: [], tagInput: "" })
    setShowCreatePost(false)
  }

  const handleAddTag = () => {
    if (newPost.tagInput.trim() && !newPost.tags.includes(newPost.tagInput.trim())) {
      setNewPost(prev => ({
        ...prev,
        tags: [...prev.tags, prev.tagInput.trim()],
        tagInput: ""
      }))
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setNewPost(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }))
  }

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors font-medium"
      >
        <ChevronLeft size={20} />
        <span>Back to Community Hub</span>
      </button>

      {/* Community Header */}
      <div className="bg-gradient-to-r from-teal-500 to-cyan-500 rounded-3xl p-8 text-white shadow-xl">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <Users size={32} />
              </div>
              <div>
                <h1 className="text-3xl font-bold">{community.name}</h1>
                <p className="text-white/80 text-sm">{community.category}</p>
              </div>
            </div>
            <p className="text-white/90 mt-4 max-w-2xl">{community.description}</p>
            <div className="mt-6 flex items-center gap-6">
              <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/30">
                <span className="text-2xl font-bold">{community.members}</span>
                <span className="text-sm ml-2 text-white/90">Members</span>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/30">
                <span className="text-2xl font-bold">{communityPosts.length}</span>
                <span className="text-sm ml-2 text-white/90">Posts</span>
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            {isJoined && (
              <button
                onClick={() => setShowCreatePost(true)}
                className="bg-white text-teal-600 px-4 py-2 rounded-lg font-medium hover:bg-white/90 transition-colors flex items-center gap-2"
              >
                <Plus size={18} />
                New Post
              </button>
            )}
            <button
              onClick={() => onJoin(community.id)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                isJoined
                  ? "bg-white/20 backdrop-blur-sm text-white border border-white/30 hover:bg-white/30"
                  : "bg-white text-teal-600 hover:bg-white/90"
              }`}
            >
              {isJoined ? "Joined ✓" : "Join Community"}
            </button>
          </div>
        </div>
      </div>

      {/* Create Post Modal */}
      {showCreatePost && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Create New Post</h3>
                <button
                  onClick={() => setShowCreatePost(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-full transition-colors"
                >
                  <X size={20} className="text-gray-600 dark:text-gray-300" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Title *
                  </label>
                  <input
                    type="text"
                    value={newPost.title}
                    onChange={(e) => setNewPost(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="What's your post about?"
                    className="w-full p-3 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Content *
                  </label>
                  <textarea
                    value={newPost.content}
                    onChange={(e) => setNewPost(prev => ({ ...prev, content: e.target.value }))}
                    placeholder="Share your thoughts, questions, or experiences..."
                    className="w-full p-3 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
                    rows={6}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Tags
                  </label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={newPost.tagInput}
                      onChange={(e) => setNewPost(prev => ({ ...prev, tagInput: e.target.value }))}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                      placeholder="Add tags..."
                      className="flex-1 p-3 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    />
                    <button
                      onClick={handleAddTag}
                      className="px-4 py-3 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors"
                    >
                      Add
                    </button>
                  </div>
                  {newPost.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {newPost.tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center gap-1 px-3 py-1 bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 rounded-full text-sm"
                        >
                          {tag}
                          <button
                            onClick={() => handleRemoveTag(tag)}
                            className="hover:text-teal-900 dark:hover:text-teal-100"
                          >
                            <X size={14} />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleCreatePost}
                  disabled={!newPost.title.trim() || !newPost.content.trim()}
                  className="flex-1 px-4 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center justify-center gap-2"
                >
                  <Send size={18} />
                  Post to {community.name}
                </button>
                <button
                  onClick={() => setShowCreatePost(false)}
                  className="px-4 py-3 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Posts Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {isJoined ? "Community Posts" : "Recent Posts"}
          </h2>
          
          {/* Sort Options */}
          <div className="flex gap-2">
            <button
              onClick={() => setSortBy("recent")}
              className={`px-3 py-1.5 rounded-lg font-medium text-sm transition-colors flex items-center gap-1.5 ${
                sortBy === "recent"
                  ? "bg-teal-500 text-white"
                  : "bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600"
              }`}
            >
              <Clock size={14} />
              Recent
            </button>
            <button
              onClick={() => setSortBy("popular")}
              className={`px-3 py-1.5 rounded-lg font-medium text-sm transition-colors flex items-center gap-1.5 ${
                sortBy === "popular"
                  ? "bg-teal-500 text-white"
                  : "bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600"
              }`}
            >
              <TrendingUp size={14} />
              Popular
            </button>
          </div>
        </div>
        
        {!isJoined && (
          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4">
            <p className="text-amber-800 dark:text-amber-200 text-sm">
              Join this community to create posts and engage with other members
            </p>
          </div>
        )}

        {sortedCommunityPosts.length > 0 ? (
          sortedCommunityPosts.map((post) => (
            <PostCard key={post.id} post={post} onVote={onVotePost} userVote={userVotes[post.id]} />
          ))
        ) : (
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 text-center">
            <Users className="mx-auto text-gray-400 mb-4" size={48} />
            <p className="text-gray-600 dark:text-gray-400 mb-2">No posts yet in this community</p>
            {isJoined && (
              <p className="text-sm text-gray-500 dark:text-gray-500">
                Be the first to start a discussion!
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}