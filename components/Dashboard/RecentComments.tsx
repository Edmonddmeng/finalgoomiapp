import type { Comment } from "@/types"
import { MessageSquare, User, GraduationCap, Star } from "lucide-react"

interface RecentCommentsProps {
  comments: Comment[]
}

const roleIcons = {
  parent: <User size={14} />,
  mentor: <Star size={14} />,
  teacher: <GraduationCap size={14} />,
}

const sentimentColors = {
  positive: "border-green-300 dark:border-green-700 bg-green-50 dark:bg-green-900/20",
  neutral: "border-gray-300 dark:border-slate-600 bg-gray-50 dark:bg-slate-700/50",
  constructive: "border-blue-300 dark:border-blue-700 bg-blue-50 dark:bg-blue-900/20",
}

export function RecentComments({ comments }: RecentCommentsProps) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-slate-700">
      <div className="flex items-center gap-2 mb-3">
        <MessageSquare className="text-blue-600" size={20} />
        <h3 className="font-semibold text-gray-900 dark:text-white">Recent Comments</h3>
      </div>
      <div className="space-y-3">
        {comments.length > 0 ? (
          comments.slice(0, 3).map((comment) => (
            <div key={comment.id} className={`p-3 border-l-4 rounded-r-lg ${sentimentColors[comment.sentiment]}`}>
              <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                <div className="flex items-center gap-1.5 font-medium">
                  {roleIcons[comment.role]}
                  <span>
                    {comment.author} ({comment.role})
                  </span>
                </div>
                <span>{new Date(comment.date).toLocaleDateString()}</span>
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-300">{comment.content}</p>
            </div>
          ))
        ) : (
          <div className="text-center py-6 text-gray-500 dark:text-gray-400">
            <MessageSquare size={24} className="mx-auto mb-2 opacity-50" />
            <p className="text-sm">No comments from mentors or teachers yet.</p>
          </div>
        )}
      </div>
    </div>
  )
}
