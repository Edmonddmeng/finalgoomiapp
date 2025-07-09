import { useState } from "react"
import { CommunityList } from "./CommunityList"
import { CommunityView } from "./CommunityView"
import { PostCard } from "./PostCard"
import type { Community as CommunityType, CommunityPost } from "@/types"
import { Search, Hash, Users } from "lucide-react"

interface CommunityProps {
  communities: CommunityType[]
  posts: CommunityPost[]
  onJoinCommunity: (communityId: string) => void
  onVotePost: (postId: string, voteType: "up" | "down") => void
  onCreatePost?: (post: Omit<CommunityPost, "id" | "createdAt" | "upvotes" | "downvotes" | "comments">) => void
}

export function Community({ communities, posts, onJoinCommunity, onVotePost, onCreatePost }: CommunityProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [searchType, setSearchType] = useState<"all" | "posts" | "communities">("all")
  const [selectedCommunity, setSelectedCommunity] = useState<CommunityType | null>(null)

  // Filter posts based on search
  const filteredPosts = posts.filter(post => {
    if (searchType === "communities") return false // Don't show posts when searching communities only
    if (!searchTerm) return true // Show all posts when not searching
    const searchLower = searchTerm.toLowerCase()
    return (
      post.title.toLowerCase().includes(searchLower) ||
      post.content.toLowerCase().includes(searchLower) ||
      post.author.toLowerCase().includes(searchLower) ||
      post.tags.some(tag => tag.toLowerCase().includes(searchLower))
    )
  })

  // Filter communities based on search
  const filteredCommunities = communities.filter(community => {
    if (searchType === "posts") return true // Show all communities when searching posts only
    if (!searchTerm) return true // Show all communities when not searching
    const searchLower = searchTerm.toLowerCase()
    return (
      community.name.toLowerCase().includes(searchLower) ||
      community.description.toLowerCase().includes(searchLower) ||
      community.category.toLowerCase().includes(searchLower)
    )
  })

  // If a community is selected, show the community view
  if (selectedCommunity) {
    return (
      <CommunityView
        community={selectedCommunity}
        posts={posts}
        isJoined={selectedCommunity.joined}
        onBack={() => setSelectedCommunity(null)}
        onJoin={onJoinCommunity}
        onVotePost={onVotePost}
        onCreatePost={onCreatePost || (() => {})}
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
              <span className="text-2xl font-bold">{posts.length}</span>
              <span className="text-sm ml-2 text-white/90">Active Discussions</span>
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
          <div className="flex gap-2">
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
              {searchType === "communities" && <span>Found {filteredCommunities.length} communities</span>}
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {searchType !== "communities" && filteredPosts.length > 0 ? (
            filteredPosts.map((post) => (
              <PostCard key={post.id} post={post} onVote={onVotePost} />
            ))
          ) : searchType !== "communities" && searchTerm ? (
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 text-center">
              <Search className="mx-auto text-gray-400 mb-4" size={48} />
              <p className="text-gray-600 dark:text-gray-400">No posts found matching "{searchTerm}"</p>
              <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">Try different keywords or browse communities</p>
            </div>
          ) : searchType === "communities" ? (
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 text-center">
              <Users className="mx-auto text-gray-400 mb-4" size={48} />
              <p className="text-gray-600 dark:text-gray-400">Searching communities only</p>
              <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">Check the sidebar for matching communities</p>
            </div>
          ) : (
            filteredPosts.map((post) => (
              <PostCard key={post.id} post={post} onVote={onVotePost} />
            ))
          )}
        </div>
        <div className="lg:col-span-1">
          <CommunityList 
            communities={filteredCommunities} 
            onJoin={onJoinCommunity} 
            onSelectCommunity={setSelectedCommunity}
          />
        </div>
      </div>
    </div>
  )
}
