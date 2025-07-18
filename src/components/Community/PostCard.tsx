
"use client"
import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { ChevronUp, ChevronDown, MessageCircle, Share, MoreHorizontal, Send, Heart, Reply, Edit2, Trash2, Flag, Pin, Lock } from "lucide-react"
import type { CommunityPost, PostComment } from "@/types"
import { useAuth } from "@/contexts/AuthContext"
import { useApiQuery } from "@/hooks/useApiQuery"
import { useApiMutation } from "@/hooks/useApiMutation"
import { communityService } from "@/services/communityService"
import { useConfirm } from "@/components/Utils/ConfirmDialog"

interface PostCardProps {
  post: CommunityPost
  onVote: (postId: string, voteType: "up" | "down") => void
  userVote?: "up" | "down" | null
  onPostUpdate?: (updatedPost: CommunityPost) => void
  onPostDelete?: (postId: string) => void
}

interface CommentItemProps {
  comment: PostComment
  onVoteComment: (commentId: string, vote: "up" | "down") => void
  onReplyToComment: (commentId: string, content: string) => void
  onEditComment: (commentId: string, content: string) => void
  onDeleteComment: (commentId: string) => void
  onReportComment: (commentId: string, reason: string) => void
  currentUserId?: string
  level?: number
}

function CommentItem({ 
  comment, 
  onVoteComment, 
  onReplyToComment, 
  onEditComment, 
  onDeleteComment,
  onReportComment,
  currentUserId,
  level = 0 
}: CommentItemProps) {
  const [showReplyForm, setShowReplyForm] = useState(false)
  const [showEditForm, setShowEditForm] = useState(false)
  const [showReportForm, setShowReportForm] = useState(false)
  const [replyContent, setReplyContent] = useState("")
  const [editContent, setEditContent] = useState(comment.content)
  const [reportReason, setReportReason] = useState("")

  // Optimistic voting state for comments (keep this as it works)
  const [optimisticVote, setOptimisticVote] = useState<"up" | "down" | null>(comment.userVote || null)
  const [optimisticUpvotes, setOptimisticUpvotes] = useState(comment.upvotes)
  const [optimisticDownvotes, setOptimisticDownvotes] = useState(comment.downvotes)

  const handleSubmitReply = () => {
    if (replyContent.trim()) {
      onReplyToComment(comment.id, replyContent.trim())
      setReplyContent("")
      setShowReplyForm(false)
    }
  }

  const handleSubmitEdit = () => {
    if (editContent.trim() && editContent !== comment.content) {
      onEditComment(comment.id, editContent.trim())
      setShowEditForm(false)
    }
  }

  const handleSubmitReport = () => {
    if (reportReason.trim()) {
      onReportComment(comment.id, reportReason.trim())
      setReportReason("")
      setShowReportForm(false)
    }
  }

  const handleVoteComment = (vote: "up" | "down") => {
    // Optimistic update
    const currentVote = optimisticVote
    let newUpvotes = optimisticUpvotes
    let newDownvotes = optimisticDownvotes
    let newVote: "up" | "down" | null = vote

    // Remove previous vote if it exists
    if (currentVote === "up") {
      newUpvotes -= 1
    } else if (currentVote === "down") {
      newDownvotes -= 1
    }

    // If clicking the same vote, remove it (toggle off)
    if (currentVote === vote) {
      newVote = null
    } else {
      // Add new vote
      if (vote === "up") {
        newUpvotes += 1
      } else {
        newDownvotes += 1
      }
    }

    // Update optimistic state
    setOptimisticVote(newVote)
    setOptimisticUpvotes(newUpvotes)
    setOptimisticDownvotes(newDownvotes)

    // Call the actual API
    onVoteComment(comment.id, vote)
  }

  const isOwnComment = currentUserId === comment.author.id
  const maxLevel = 3 // Maximum nesting level

  return (
    <div className={`${level > 0 ? 'ml-8 border-l-2 border-gray-200 dark:border-gray-600 pl-4' : ''}`}>
      <div className="bg-gray-50 dark:bg-slate-700/50 rounded-lg p-4 mb-3">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-3">
            <Image
              src={comment.author.avatar || "/placeholder.svg"}
              alt={comment.author.name}
              width={32}
              height={32}
              className="rounded-full"
            />
            <div>
              <p className="font-medium text-sm text-gray-900 dark:text-white">{comment.author.name}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {new Date(comment.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Comment voting */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => handleVoteComment("up")}
                className={`p-1 rounded transition-colors ${
                  optimisticVote === "up"
                    ? "text-green-600 bg-green-100 dark:bg-green-900/50"
                    : "text-gray-500 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/30"
                }`}
              >
                <ChevronUp size={16} />
              </button>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300 min-w-[1.5rem] text-center">
                {optimisticUpvotes - optimisticDownvotes}
              </span>
              <button
                onClick={() => handleVoteComment("down")}
                className={`p-1 rounded transition-colors ${
                  optimisticVote === "down"
                    ? "text-red-600 bg-red-100 dark:bg-red-900/50"
                    : "text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30"
                }`}
              >
                <ChevronDown size={16} />
              </button>
            </div>

            {/* Comment actions dropdown */}
            <div className="relative group">
              <button className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                <MoreHorizontal size={16} className="text-gray-500" />
              </button>
              <div className="absolute right-0 top-full mt-1 bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg py-1 z-10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                {isOwnComment && (
                  <>
                    <button
                      onClick={() => setShowEditForm(true)}
                      className="w-full px-3 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 flex items-center gap-2"
                    >
                      <Edit2 size={14} />
                      Edit
                    </button>
                    <button
                      onClick={() => onDeleteComment(comment.id)}
                      className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 flex items-center gap-2"
                    >
                      <Trash2 size={14} />
                      Delete
                    </button>
                  </>
                )}
                {!isOwnComment && (
                  <button
                    onClick={() => setShowReportForm(true)}
                    className="w-full px-3 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 flex items-center gap-2"
                  >
                    <Flag size={14} />
                    Report
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Comment content */}
        {showEditForm ? (
          <div className="mb-3">
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white resize-none"
              rows={3}
            />
            <div className="flex gap-2 mt-2">
              <button
                onClick={handleSubmitEdit}
                className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors"
              >
                Save
              </button>
              <button
                onClick={() => {
                  setShowEditForm(false)
                  setEditContent(comment.content)
                }}
                className="px-3 py-1 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded text-sm hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <p className="text-gray-800 dark:text-gray-200 mb-3">{comment.content}</p>
        )}

        {/* Comment actions */}
        <div className="flex items-center gap-4">
          {level < maxLevel && (
            <button
              onClick={() => setShowReplyForm(!showReplyForm)}
              className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
            >
              <Reply size={14} />
              Reply
            </button>
          )}
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {comment.replies?.length || 0} replies
          </span>
        </div>

        {/* Reply form */}
        {showReplyForm && (
          <div className="mt-3 p-3 bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-gray-600">
            <textarea
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              placeholder="Write a reply..."
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white resize-none"
              rows={2}
            />
            <div className="flex gap-2 mt-2">
              <button
                onClick={handleSubmitReply}
                disabled={!replyContent.trim()}
                className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-1"
              >
                <Send size={12} />
                Reply
              </button>
              <button
                onClick={() => {
                  setShowReplyForm(false)
                  setReplyContent("")
                }}
                className="px-3 py-1 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded text-sm hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Report form */}
        {showReportForm && (
          <div className="mt-3 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
            <textarea
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
              placeholder="Why are you reporting this comment?"
              className="w-full p-2 border border-red-300 dark:border-red-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white resize-none"
              rows={2}
            />
            <div className="flex gap-2 mt-2">
              <button
                onClick={handleSubmitReport}
                disabled={!reportReason.trim()}
                className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Report
              </button>
              <button
                onClick={() => {
                  setShowReportForm(false)
                  setReportReason("")
                }}
                className="px-3 py-1 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded text-sm hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Nested replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="space-y-2">
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              onVoteComment={onVoteComment}
              onReplyToComment={onReplyToComment}
              onEditComment={onEditComment}
              onDeleteComment={onDeleteComment}
              onReportComment={onReportComment}
              currentUserId={currentUserId}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export function PostCard({ post, onVote, userVote, onPostUpdate, onPostDelete }: PostCardProps) {
  const { user } = useAuth()
  const [showComments, setShowComments] = useState(false)
  const [showCommentForm, setShowCommentForm] = useState(false)
  const [newComment, setNewComment] = useState("")
  const [imageError, setImageError] = useState(false)
  const [showPostOptions, setShowPostOptions] = useState(false)
  const [showEditForm, setShowEditForm] = useState(false)
  const [editPost, setEditPost] = useState({
    title: post.title,
    content: post.content,
    tags: post.tags || []
  })

  // Local state for optimistic updates
  const [localPost, setLocalPost] = useState(post)
  const { confirm } = useConfirm()

  // Update local state when post prop changes
  useEffect(() => {
    setLocalPost(post)
    setEditPost({
      title: post.title,
      content: post.content,
      tags: post.tags || []
    })
  }, [post])

  // Fetch comments for this post - post should be accessible here
  const { data: commentsData, isLoading: commentsLoading, refetch: refetchComments } = useApiQuery(
    () => communityService.getComments(localPost.id),
    ['comments', localPost.id],
    { enabled: showComments }
  )

  // Mutations for comments
  const createCommentMutation = useApiMutation(
    ({ postId, content }: { postId: string; content: string }) =>
      communityService.createComment(postId, { content })
  )

  const voteCommentMutation = useApiMutation(
    ({ commentId, vote }: { commentId: string; vote: "up" | "down" }) =>
      communityService.voteComment(commentId, vote)
  )

  const editCommentMutation = useApiMutation(
    ({ commentId, content }: { commentId: string; content: string }) =>
      communityService.updateComment(commentId, content)
  )

  const deleteCommentMutation = useApiMutation(
    (commentId: string) => communityService.deleteComment(commentId)
  )

  const reportCommentMutation = useApiMutation(
    ({ commentId, reason }: { commentId: string; reason: string }) =>
      communityService.reportComment(commentId, reason)
  )

  // Post management mutations
  const updatePostMutation = useApiMutation(
    ({ postId, data }: { postId: string; data: any }) =>
      communityService.updatePost(postId, data)
  )

  const deletePostMutation = useApiMutation(
    (postId: string) => communityService.deletePost(postId)
  )

  const pinPostMutation = useApiMutation(
    (postId: string) => communityService.pinPost(postId)
  )

  const unpinPostMutation = useApiMutation(
    (postId: string) => communityService.unpinPost(postId)
  )

  const lockPostMutation = useApiMutation(
    (postId: string) => communityService.lockPost(postId)
  )

  const unlockPostMutation = useApiMutation(
    (postId: string) => communityService.unlockPost(postId)
  )

  const comments = commentsData?.items || []

  // Use post.commentCount if available, fallback to comments.length when expanded
  const displayCommentCount = showComments ? comments.length : (localPost.commentCount || localPost.comments?.length || 0)

  const handleCreateComment = async () => {
    if (!newComment.trim()) return

    await createCommentMutation.mutateAsync({
      postId: localPost.id,
      content: newComment.trim()
    })

    setNewComment("")
    setShowCommentForm(false)
    refetchComments()
  }

  const handleVoteComment = async (commentId: string, vote: "up" | "down") => {
    await voteCommentMutation.mutateAsync({ commentId, vote })
    refetchComments()
  }

  const handleReplyToComment = async (parentId: string, content: string) => {
    await createCommentMutation.mutateAsync({
      postId: localPost.id,
      content: content
    })
    refetchComments()
  }

  const handleEditComment = async (commentId: string, content: string) => {
    await editCommentMutation.mutateAsync({ commentId, content })
    refetchComments()
  }

  const handleDeleteComment = async (commentId: string) => {
    const confirmed = await confirm({
      title: "Delete Comment",
      message: `Are you sure you want to delete this comment?`,
      confirmText: "Delete",
      cancelText: "Cancel",
      type: "danger"
    })
    if (confirmed) {
      await deleteCommentMutation.mutateAsync(commentId)
      refetchComments()
    }
  }

  const handleReportComment = async (commentId: string, reason: string) => {
    await reportCommentMutation.mutateAsync({ commentId, reason })
    alert("Comment reported successfully")
  }

  const toggleComments = () => {
    setShowComments(!showComments)
    if (!showComments) {
      refetchComments()
    }
  }

  const handleImageError = () => {
    setImageError(true)
  }

  // Post management handlers
  const handleEditPost = async () => {
    if (!editPost.title.trim() || !editPost.content.trim()) return

    try {
      const updatedPost = await updatePostMutation.mutateAsync({
        postId: localPost.id,
        data: {
          title: editPost.title.trim(),
          content: editPost.content.trim(),
          tags: editPost.tags
        }
      })

      // Update local state optimistically
      const newPost = {
        ...localPost,
        title: editPost.title.trim(),
        content: editPost.content.trim(),
        tags: editPost.tags
      }
      setLocalPost(newPost)

      // Notify parent component
      if (onPostUpdate) {
        onPostUpdate(newPost)
      }

      setShowEditForm(false)
    } catch (error) {
      console.error('Failed to update post:', error)
    }
  }

  const handleDeletePost = async () => {
    const confirmed = await confirm({
      title: "Delete Post",
      message: `Are you sure you want to delete this post? This action cannot be undone.`,
      confirmText: "Delete",
      cancelText: "Cancel",
      type: "danger"
    })
    if (confirmed) {
      try {
        await deletePostMutation.mutateAsync(localPost.id)
        
        // Notify parent component to remove this post
        if (onPostDelete) {
          onPostDelete(localPost.id)
        }
      } catch (error) {
        console.error('Failed to delete post:', error)
      }
    }
  }

  const handleTogglePin = async () => {
    try {
      // Optimistic update
      const newPost = { ...localPost, isPinned: !localPost.isPinned }
      setLocalPost(newPost)

      if (localPost.isPinned) {
        await unpinPostMutation.mutateAsync(localPost.id)
      } else {
        await pinPostMutation.mutateAsync(localPost.id)
      }

      // Notify parent component
      if (onPostUpdate) {
        onPostUpdate(newPost)
      }
    } catch (error) {
      console.error('Failed to toggle pin:', error)
      // Revert optimistic update on error
      setLocalPost(localPost)
    }
  }

  const handleToggleLock = async () => {
    try {
      // Optimistic update
      const newPost = { ...localPost, isLocked: !localPost.isLocked }
      setLocalPost(newPost)

      if (localPost.isLocked) {
        await unlockPostMutation.mutateAsync(localPost.id)
      } else {
        await lockPostMutation.mutateAsync(localPost.id)
      }

      // Notify parent component
      if (onPostUpdate) {
        onPostUpdate(newPost)
      }
    } catch (error) {
      console.error('Failed to toggle lock:', error)
      // Revert optimistic update on error
      setLocalPost(localPost)
    }
  }

  const isOwnPost = user?.id === localPost.author.id
  const canManagePost = isOwnPost // Add admin check here if needed
  
  // Ref for the dropdown to handle click outside
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowPostOptions(false)
      }
    }

    if (showPostOptions) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showPostOptions])

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 overflow-visible relative">
      {/* Post Header */}
      <div className="p-6 pb-4">
        <div className="flex items-start gap-4">
          <Image
            src={localPost.author.avatar || "/placeholder.svg"}
            alt={localPost.author.name}
            width={48}
            height={48}
            className="rounded-full"
            onError={(e) => {
              e.currentTarget.src = "/placeholder.svg"
            }}
          />
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-gray-900 dark:text-white">{localPost.author.name}</h3>
              <span className="text-gray-500 dark:text-gray-400">•</span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {new Date(localPost.createdAt).toLocaleDateString()}
              </span>
              {localPost.isPinned && (
                <span className="text-xs bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300 px-2 py-1 rounded-full">Pinned</span>
              )}
              {localPost.isLocked && (
                <span className="text-xs bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300 px-2 py-1 rounded-full">Locked</span>
              )}
            </div>
            
            {showEditForm ? (
              <div className="mt-3 space-y-3">
                <input
                  type="text"
                  value={editPost.title}
                  onChange={(e) => setEditPost(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Post title"
                />
                <textarea
                  value={editPost.content}
                  onChange={(e) => setEditPost(prev => ({ ...prev, content: e.target.value }))}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={4}
                  placeholder="Post content"
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleEditPost}
                    disabled={!editPost.title.trim() || !editPost.content.trim() || updatePostMutation.isLoading}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {updatePostMutation.isLoading ? "Saving..." : "Save Changes"}
                  </button>
                  <button
                    onClick={() => {
                      setShowEditForm(false)
                      setEditPost({ title: localPost.title, content: localPost.content, tags: localPost.tags || [] })
                    }}
                    className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-2 mb-3">{localPost.title}</h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{localPost.content}</p>
              </>
            )}
            
            {/* Post Photo - Only show when not editing */}
            {!showEditForm && localPost.photoUrl && !imageError && (
              <div className="mt-4 mb-3">
                <Image
                  src={localPost.photoUrl}
                  alt="Post image"
                  width={600}
                  height={400}
                  className="w-full h-auto max-h-96 object-cover rounded-lg border border-gray-200 dark:border-gray-600 cursor-pointer hover:opacity-95 transition-opacity"
                  onError={handleImageError}
                  onClick={() => {
                    // Optional: Open image in a larger view/modal
                    window.open(localPost.photoUrl, '_blank')
                  }}
                />
              </div>
            )}
            
            {/* Tags - Only show when not editing */}
            {!showEditForm && localPost.tags && localPost.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {localPost.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-block px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Post Actions */}
      <div className="px-6 py-4 border-t border-gray-100 dark:border-slate-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            {/* Post Voting - Use props directly (no internal optimistic state) */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => onVote(localPost.id, "up")}
                className={`p-2 rounded-lg transition-colors ${
                  userVote === "up"
                    ? "text-green-600 bg-green-100 dark:bg-green-900/50"
                    : "text-gray-500 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/30"
                }`}
              >
                <ChevronUp size={20} />
              </button>
              <span className="font-medium text-gray-700 dark:text-gray-300 min-w-[2rem] text-center">
                {localPost.upvotes - localPost.downvotes}
              </span>
              <button
                onClick={() => onVote(localPost.id, "down")}
                className={`p-2 rounded-lg transition-colors ${
                  userVote === "down"
                    ? "text-red-600 bg-red-100 dark:bg-red-900/50"
                    : "text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30"
                }`}
              >
                <ChevronDown size={20} />
              </button>
            </div>

            {/* Comments with proper count */}
            <button
              onClick={toggleComments}
              className="flex items-center gap-2 p-2 rounded-lg text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors"
            >
              <MessageCircle size={20} />
              <span className="font-medium">{displayCommentCount} Comments</span>
            </button>

            {/* Share */}
            <button className="flex items-center gap-2 p-2 rounded-lg text-gray-500 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/30 transition-colors">
              <Share size={20} />
              <span className="font-medium">Share</span>
            </button>
          </div>

          {/* More options */}
          <div className="relative" ref={dropdownRef}>
            <button 
              onClick={() => setShowPostOptions(!showPostOptions)}
              className="p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
            >
              <MoreHorizontal size={20} />
            </button>
            
            {showPostOptions && (
              <div className="absolute right-0 top-full mt-1 bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg py-1 z-50 min-w-[150px]">
                {canManagePost && (
                  <>
                    <button
                      onClick={() => {
                        setShowEditForm(true)
                        setShowPostOptions(false)
                      }}
                      className="w-full px-3 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 flex items-center gap-2"
                    >
                      <Edit2 size={14} />
                      Edit Post
                    </button>
                    <button
                      onClick={() => {
                        handleTogglePin()
                        setShowPostOptions(false)
                      }}
                      disabled={pinPostMutation.isLoading || unpinPostMutation.isLoading}
                      className="w-full px-3 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 flex items-center gap-2 disabled:opacity-50"
                    >
                      <Pin size={14} />
                      {localPost.isPinned ? "Unpin Post" : "Pin Post"}
                    </button>
                    <button
                      onClick={() => {
                        handleToggleLock()
                        setShowPostOptions(false)
                      }}
                      disabled={lockPostMutation.isLoading || unlockPostMutation.isLoading}
                      className="w-full px-3 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 flex items-center gap-2 disabled:opacity-50"
                    >
                      <Lock size={14} />
                      {localPost.isLocked ? "Unlock Post" : "Lock Post"}
                    </button>
                    <hr className="my-1 border-gray-200 dark:border-gray-600" />
                    <button
                      onClick={() => {
                        handleDeletePost()
                        setShowPostOptions(false)
                      }}
                      disabled={deletePostMutation.isLoading}
                      className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 flex items-center gap-2 disabled:opacity-50"
                    >
                      <Trash2 size={14} />
                      Delete Post
                    </button>
                  </>
                )}
                {!canManagePost && (
                  <button
                    onClick={() => {
                      // Add report functionality here
                      alert("Report functionality coming soon")
                      setShowPostOptions(false)
                    }}
                    className="w-full px-3 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 flex items-center gap-2"
                  >
                    <Flag size={14} />
                    Report Post
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="border-t border-gray-100 dark:border-slate-700">
          {/* Comment Form */}
          <div className="p-6 border-b border-gray-100 dark:border-slate-700">
            {user ? (
              localPost.isLocked && !canManagePost ? (
                <div className="text-center py-4">
                  <Lock className="mx-auto text-gray-400 mb-2" size={24} />
                  <p className="text-gray-500 dark:text-gray-400">This post is locked. Comments are disabled.</p>
                </div>
              ) : (
                <div>
                  {!showCommentForm ? (
                    <button
                      onClick={() => setShowCommentForm(true)}
                      className="w-full p-3 text-left bg-gray-50 dark:bg-slate-700 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-600 transition-colors"
                    >
                      Write a comment...
                    </button>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <Image
                          src={user.avatar || "/placeholder.svg"}
                          alt={user.name}
                          width={40}
                          height={40}
                          className="rounded-full"
                        />
                        <div className="flex-1">
                          <textarea
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Share your thoughts..."
                            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            rows={3}
                          />
                        </div>
                      </div>
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => {
                            setShowCommentForm(false)
                            setNewComment("")
                          }}
                          className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleCreateComment}
                          disabled={!newComment.trim() || createCommentMutation.isLoading}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                        >
                          <Send size={16} />
                          Comment
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                Please log in to comment
              </p>
            )}
          </div>

          {/* Comments List */}
          <div className="p-6">
            {commentsLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : comments.length > 0 ? (
              <div className="space-y-4">
                {comments.map((comment) => (
                  <CommentItem
                    key={comment.id}
                    comment={comment}
                    onVoteComment={handleVoteComment}
                    onReplyToComment={handleReplyToComment}
                    onEditComment={handleEditComment}
                    onDeleteComment={handleDeleteComment}
                    onReportComment={handleReportComment}
                    currentUserId={user?.id}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <MessageCircle className="mx-auto text-gray-400 mb-3" size={48} />
                <p className="text-gray-500 dark:text-gray-400">No comments yet</p>
                <p className="text-sm text-gray-400 dark:text-gray-500">Be the first to share your thoughts!</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}