export interface Community {
  id: string
  name: string
  description: string
  category: CommunityCategory
  members: number
  joined: boolean
  createdBy: string
  moderators: string[]
  rules?: string[]
  avatar?: string
  banner?: string
  isPrivate: boolean
  createdAt: string
  updatedAt: string
}

export type CommunityCategory = 
  | "academic"
  | "sports"
  | "arts"
  | "technology"
  | "lifestyle"
  | "career"
  | "general"

  export interface CommunityPost {
    id: string
    communityId: string
    author: {
      id: string
      name: string
      avatar?: string
    }
    title: string
    content: string
    tags?: string[]
    upvotes: number
    downvotes: number
    userVote?: 'up' | 'down' | null
    comments: PostComment[]
    photoUrl?: string 
    commentCount?: number // Add this field for the total comment count
    isPinned: boolean
    isLocked: boolean
    createdAt: string
    updatedAt: string
  }

  export interface PostComment {
    id: string
    postId: string
    author: {
      id: string
      name: string
      avatar?: string
    }
    content: string
    upvotes: number
    downvotes: number
    userVote?: 'up' | 'down' | null
    parentId?: string // For nested comments
    replies?: PostComment[]
    // Remove commentCount from here - it belongs on CommunityPost, not PostComment
    createdAt: string
    updatedAt: string
  }

export interface CommunityStats {
  totalCommunities: number
  joinedCommunities: number
  createdCommunities: number
  totalPosts: number
  totalComments: number
  karma: number // upvotes - downvotes across all posts/comments
}

// Request Types
export interface CreateCommunityRequest {
  name: string
  description: string
  category: CommunityCategory
  rules?: string[]
  isPrivate?: boolean
}

export interface UpdateCommunityRequest {
  name?: string
  description?: string
  category?: CommunityCategory
  rules?: string[]
  avatar?: string
  banner?: string
  isPrivate?: boolean
}

export interface CreatePostRequest {
  title: string
  content: string
  tags?: string[]
}

export interface CreateCommentRequest {
  content: string
  parentId?: string
}

export interface VoteRequest {
  vote: 'up' | 'down'
}

export interface CommunityFilters {
  category?: CommunityCategory
  joined?: boolean
  search?: string
  sortBy?: 'members' | 'recent' | 'active'
}

export interface PostFilters {
  communityId?: string
  authorId?: string
  tags?: string[]
  sortBy?: 'recent' | 'popular' | 'controversial'
  timeRange?: 'day' | 'week' | 'month' | 'year' | 'all'
}