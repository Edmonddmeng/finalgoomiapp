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
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Community Hub</h1>
        {posts.map((post) => (
          <PostCard key={post.id} post={post} onVote={onVotePost} />
        ))}
      </div>
      <div className="lg:col-span-1">
        <CommunityList communities={communities} onJoin={onJoinCommunity} />
      </div>
    </div>
  )
}
