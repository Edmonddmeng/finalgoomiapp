import { CommunityList } from "./CommunityList"
import { PostCard } from "./PostCard"
import type { Community as CommunityType, CommunityPost } from "@/types"

interface CommunityProps {
  communities: CommunityType[]
  posts: CommunityPost[]
  onJoinCommunity: (communityId: string) => void
  onVotePost: (postId: string, voteType: "up" | "down") => void
}

export function Community({ communities, posts, onJoinCommunity, onVotePost }: CommunityProps) {
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

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} onVote={onVotePost} />
          ))}
        </div>
        <div className="lg:col-span-1">
          <CommunityList communities={communities} onJoin={onJoinCommunity} />
        </div>
      </div>
    </div>
  )
}
