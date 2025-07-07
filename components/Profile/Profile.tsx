import Image from "next/image"
import type { User } from "@/types"
import { Award, Settings } from "lucide-react"

interface ProfileProps {
  user: User
}

export function Profile({ user }: ProfileProps) {
  return (
    <div className="space-y-8">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 p-6">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <Image
            src={user.avatar || "/placeholder.svg"}
            alt={user.name}
            width={128}
            height={128}
            className="rounded-full border-4 border-purple-200"
          />
          <div className="text-center md:text-left">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{user.name}</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">{user.email}</p>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
              Joined on {new Date(user.joinedDate).toLocaleDateString()}
            </p>
          </div>
          <button className="ml-auto bg-gray-100 hover:bg-gray-200 text-gray-700 dark:bg-slate-700 dark:hover:bg-slate-600 dark:text-gray-300 px-4 py-2 rounded-lg font-medium flex items-center gap-2">
            <Settings size={16} />
            <span>Edit Profile</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Achievements</h3>
          <div className="space-y-3">
            {user.achievements.map((ach) => (
              <div key={ach.id} className="flex items-center gap-3">
                <div className="p-2 bg-yellow-100 text-yellow-600 rounded-full">
                  <Award size={16} />
                </div>
                <div>
                  <p className="font-medium text-sm text-gray-800 dark:text-gray-200">{ach.title}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date(ach.dateEarned).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Friends</h3>
          <div className="space-y-3">
            {/* Mock friends data */}
            {[
              { name: "Alice Johnson", avatar: "/IMG_2464.jpg" },
              { name: "Bob Williams", avatar: "/IMG_2464.jpg" },
              { name: "Charlie Brown", avatar: "/IMG_2464.jpg" },
            ].map((friend) => (
              <div key={friend.name} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Image
                    src={friend.avatar || "/placeholder.svg"}
                    alt={friend.name}
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                  <p className="font-medium text-sm text-gray-800 dark:text-gray-200">{friend.name}</p>
                </div>
                <button className="text-xs text-blue-600 hover:underline">View Profile</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
