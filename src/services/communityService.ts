import { apiClient } from '@/lib/apiClient'
import { 
  Community, 
  CommunityPost, 
  PostComment,
  CommunityStats,
  CreateCommunityRequest,
  UpdateCommunityRequest,
  CreatePostRequest,
  CreateCommentRequest,
  VoteRequest,
  CommunityFilters,
  PostFilters,
  CommunityCategory
} from '@/types/community'
import { PaginatedResponse, PaginationParams } from '@/types/api'

class CommunityService {
  // Simple method overloads for Community component
  async getPostsList(): Promise<CommunityPost[]> {
    const response = await this.getAllPosts()
    return response.items || []
  }

  async getUserVotes(): Promise<Record<string, "up" | "down">> {
    const response = await apiClient.get<Record<string, "up" | "down">>('/user/votes')
    return response.data
  }


  // Community CRUD
  async getCommunities(filters?: CommunityFilters): Promise<Community[]> {
    const response = await apiClient.get<Community[]>('/communities/new', { 
      params: filters 
    })
    return response.data
  }

  async getCommunity(id: string): Promise<Community> {
    const response = await apiClient.get<Community>(`/communities/new/${id}`)
    return response.data
  }

  async createCommunity(data: CreateCommunityRequest | Omit<Community, "id" | "members" | "joined"> | { name: string; description: string; category: CommunityCategory; avatar?: string }): Promise<Community> {
    const response = await apiClient.post<Community>('/communities/new', data)
    return response.data
  }

  async updateCommunity(id: string, data: UpdateCommunityRequest): Promise<Community> {
    const response = await apiClient.put<Community>(`/communities/new/${id}`, data)
    return response.data
  }

  async deleteCommunity(id: string): Promise<void> {
    await apiClient.delete(`/communities/new/${id}`)
  }

  // Community membership
  async joinCommunity(id: string): Promise<void> {
    await apiClient.put(`/communities/new/${id}/join`)
  }

  async leaveCommunity(id: string): Promise<void> {
    await apiClient.put(`/communities/new/${id}/leave`)
  }

  async getCommunityMembers(id: string, params?: PaginationParams): Promise<PaginatedResponse<{
    id: string
    name: string
    avatar?: string
    role: 'member' | 'moderator' | 'admin'
    joinedAt: string
  }>> {
    const response = await apiClient.get(`/communities/new/${id}/members`, { params })
    return response.data
  }

  // Posts
  async getPosts(
    communityId: string, 
    filters?: PostFilters & PaginationParams
  ): Promise<PaginatedResponse<CommunityPost>> {
    const response = await apiClient.get<PaginatedResponse<CommunityPost>>(
      `/communities/new/${communityId}/posts`, 
      { params: filters }
    )
    return response.data
  }

  async getAllPosts(filters?: PostFilters & PaginationParams): Promise<PaginatedResponse<CommunityPost>> {
    const response = await apiClient.get<PaginatedResponse<CommunityPost>>('/posts/new', { 
      params: filters 
    })
    return response.data
  }

  async getPost(id: string): Promise<CommunityPost> {
    const response = await apiClient.get<CommunityPost>(`/posts/new/${id}`)
    return response.data
  }

  async createPost(communityId: string, data: CreatePostRequest): Promise<CommunityPost>
  async createPost(data: { title: string; content: string; communityId: string; tags?: string[] }): Promise<CommunityPost>
  async createPost(arg1: string | { title: string; content: string; communityId: string; tags?: string[] }, arg2?: CreatePostRequest): Promise<CommunityPost> {
    if (typeof arg1 === 'string' && arg2) {
      // Original method signature
      const response = await apiClient.post<CommunityPost>(
        `/communities/new/${arg1}/posts`, 
        arg2
      )
      return response.data
    } else {
      // New signature for Community component
      const response = await apiClient.post<CommunityPost>('/posts/new', arg1)
      return response.data
    }
  }

  async updatePost(id: string, data: Partial<CreatePostRequest>): Promise<CommunityPost> {
    const response = await apiClient.put<CommunityPost>(`/posts/new/${id}`, data)
    return response.data
  }

  async deletePost(id: string): Promise<void> {
    await apiClient.delete(`/posts/new/${id}`)
  }

  async pinPost(id: string): Promise<void> {
    await apiClient.put(`/posts/new/${id}/pin`)
  }

  async unpinPost(id: string): Promise<void> {
    await apiClient.put(`/posts/new/${id}/unpin`)
  }

  async lockPost(id: string): Promise<void> {
    await apiClient.put(`/posts/new/${id}/lock`)
  }

  async unlockPost(id: string): Promise<void> {
    await apiClient.put(`/posts/new/${id}/unlock`)
  }

  // Voting
  async votePost(postId: string, vote: 'up' | 'down'): Promise<any> {
    const response = await apiClient.post(`/posts/new/${postId}/vote`, { vote })
    return response.data
  }

  async removeVote(postId: string): Promise<void> {
    await apiClient.delete(`/posts/new/${postId}/vote`)
  }

  // Comments
  async getComments(postId: string, params?: PaginationParams): Promise<PaginatedResponse<PostComment>> {
    const response = await apiClient.get<PaginatedResponse<PostComment>>(
      `/comments/new/posts/${postId}/comments`,
      { params }
    )
    return response.data
  }

  async createComment(postId: string, data: CreateCommentRequest): Promise<PostComment> {
    const response = await apiClient.post<PostComment>(
      `/comments/new/posts/${postId}/comments`,
      data
    )
    return response.data
  }

  async updateComment(commentId: string, content: string): Promise<PostComment> {
    const response = await apiClient.put<PostComment>(`/comments/new/${commentId}`, { content })
    return response.data
  }

  async deleteComment(commentId: string): Promise<void> {
    await apiClient.delete(`/comments/new/${commentId}`)
  }

  async voteComment(commentId: string, vote: 'up' | 'down'): Promise<{
    upvotes: number
    downvotes: number
    userVote: 'up' | 'down' | null
  }> {
    const response = await apiClient.post(`/comments/new/${commentId}/vote`, { vote })
    return response.data
  }

  // Statistics
  async getStats(): Promise<CommunityStats> {
    const response = await apiClient.get<CommunityStats>('/communities/new/stats')
    return response.data
  }

  // Moderation
  async reportPost(postId: string, reason: string): Promise<void> {
    await apiClient.post(`/posts/new/${postId}/report`, { reason })
  }

  async reportComment(commentId: string, reason: string): Promise<void> {
    await apiClient.post(`/comments/new/${commentId}/report`, { reason })
  }

  // Search
  async searchCommunities(query: string): Promise<Community[]> {
    const response = await apiClient.get<Community[]>('/communities/new/search', {
      params: { q: query }
    })
    return response.data
  }

  async searchPosts(query: string, communityId?: string): Promise<PaginatedResponse<CommunityPost>> {
    const response = await apiClient.get<PaginatedResponse<CommunityPost>>('/posts/new/search', {
      params: { q: query, communityId }
    })
    return response.data
  }
}

export const communityService = new CommunityService()