// "use client"
// import Image from "next/image"
// import { Plus, Check } from "lucide-react"
// import type { Community } from "@/types"

// interface CommunityListProps {
//   communities: Community[]
//   onJoin: (communityId: string) => void
//   onSelectCommunity?: (community: Community) => void
// }

// export function CommunityList({ communities, onJoin, onSelectCommunity }: CommunityListProps) {
//   return (
//     <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-slate-700">
//       <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Popular Communities</h3>
//       <div className="space-y-4">
//         {communities.map((community) => (
//           <div key={community.id} className="flex items-center justify-between">
//             <div 
//               className="flex items-center gap-3 flex-1 cursor-pointer hover:opacity-80 transition-opacity"
//               onClick={() => onSelectCommunity?.(community)}
//             >
//               <Image
//                 src={community.avatar || "/placeholder.svg"}
//                 alt={community.name}
//                 width={40}
//                 height={40}
//                 className="rounded-full"
//               />
//               <div>
//                 <p className="font-medium text-sm text-gray-800 dark:text-gray-200">{community.name}</p>
//                 <p className="text-xs text-gray-500 dark:text-gray-400">{community.members.toLocaleString()} members</p>
//               </div>
//             </div>
//             <button
//               onClick={() => onJoin(community.id)}
//               className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full transition-all ${
//                 community.joined
//                   ? "bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/50 dark:text-green-300 dark:hover:bg-green-900"
//                   : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-slate-700 dark:text-gray-300 dark:hover:bg-slate-600"
//               }`}
//             >
//               {community.joined ? <Check size={14} /> : <Plus size={14} />}
//               <span>{community.joined ? "Joined" : "Join"}</span>
//             </button>
//           </div>
//         ))}
//       </div>
//     </div>
//   )
// }

"use client"
import Image from "next/image"
import { Plus, Check, UserMinus } from "lucide-react"
import type { Community } from "@/types"

interface CommunityListProps {
  communities: Community[]
  onJoin: (communityId: string) => void
  onLeave?: (communityId: string) => void
  onSelectCommunity?: (community: Community) => void
}

export function CommunityList({ communities, onJoin, onLeave, onSelectCommunity }: CommunityListProps) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-slate-700">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Popular Communities</h3>
      <div className="space-y-4">
        {communities.map((community) => (
          <div key={community.id} className="flex items-center justify-between">
            <div 
              className="flex items-center gap-3 flex-1 cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => onSelectCommunity?.(community)}
            >
              <Image
                src={community.avatar || "/placeholder.svg"}
                alt={community.name}
                width={40}
                height={40}
                className="rounded-full"
              />
              <div>
                <p className="font-medium text-sm text-gray-800 dark:text-gray-200">{community.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {(community.members || 0).toLocaleString()} members
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  if (community.joined) {
                    onLeave?.(community.id)
                  } else {
                    onJoin(community.id)
                  }
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full transition-all ${
                  community.joined
                    ? "bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/50 dark:text-green-300 dark:hover:bg-green-900"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-slate-700 dark:text-gray-300 dark:hover:bg-slate-600"
                }`}
              >
                {community.joined ? <Check size={14} /> : <Plus size={14} />}
                <span>{community.joined ? "Joined" : "Join"}</span>
              </button>
              {community.joined && onLeave && (
                <button
                  onClick={() => onLeave(community.id)}
                  className="flex items-center gap-1 px-2 py-1.5 text-xs font-medium rounded-full bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/50 dark:text-red-300 dark:hover:bg-red-900 transition-all"
                  title="Leave community"
                >
                  <UserMinus size={12} />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}