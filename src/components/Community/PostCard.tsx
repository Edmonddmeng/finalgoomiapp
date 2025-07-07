"use client"
import Image from "next/image"
import { ArrowUp, ArrowDown, MessageSquare } from "lucide-react"
import type { CommunityPost } from "@/types"

interface PostCardProps {
  post: CommunityPost
  onVote: (postId: string, voteType: "up" | "down") => void
}

export function PostCard({ post, onVote }: PostCardProps) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 p-5 flex gap-4">
      <div className="flex flex-col items-center gap-1 text-gray-500 dark:text-gray-400">
        <button
          onClick={() => onVote(post.id, "up")}
          className="p-1 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-full hover:text-green-500"
        >
          <ArrowUp size={18} />
        </button>
        <span className="text-sm font-bold text-gray-800 dark:text-gray-200">{post.upvotes - post.downvotes}</span>
        <button
          onClick={() => onVote(post.id, "down")}
          className="p-1 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-full hover:text-red-500"
        >
          <ArrowDown size={18} />
        </button>
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-2">
          <Image
            src={post.authorAvatar || "/placeholder.svg"}
            alt={post.author}
            width={20}
            height={20}
            className="rounded-full"
          />
          <span>
            Posted by <span className="font-medium text-gray-700 dark:text-gray-300">{post.author}</span>
          </span>
          <span>•</span>
          <span>{new Date(post.createdAt).toLocaleDateString()}</span>
        </div>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{post.title}</h2>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">{post.content}</p>
        <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-1.5">
            <MessageSquare size={14} />
            <span>{post.comments.length} Comments</span>
          </div>
          <div className="flex gap-2">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
