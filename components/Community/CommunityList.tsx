"use client"
import Image from "next/image"
import { Plus, Check } from "lucide-react"
import type { Community } from "@/types"

interface CommunityListProps {
  communities: Community[]
  onJoin: (communityId: string) => void
}

export function CommunityList({ communities, onJoin }: CommunityListProps) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-slate-700">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Popular Communities</h3>
      <div className="space-y-4">
        {communities.map((community) => (
          <div key={community.id} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Image
                src={community.avatar || "/placeholder.svg"}
                alt={community.name}
                width={40}
                height={40}
                className="rounded-full"
              />
              <div>
                <p className="font-medium text-sm text-gray-800 dark:text-gray-200">{community.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{community.members.toLocaleString()} members</p>
              </div>
            </div>
            <button
              onClick={() => onJoin(community.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full transition-all ${
                community.joined
                  ? "bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/50 dark:text-green-300 dark:hover:bg-green-900"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-slate-700 dark:text-gray-300 dark:hover:bg-slate-600"
              }`}
            >
              {community.joined ? <Check size={14} /> : <Plus size={14} />}
              <span>{community.joined ? "Joined" : "Join"}</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
