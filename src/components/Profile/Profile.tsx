import Image from "next/image"
import type { User } from "@/types"
import { Award, Settings } from "lucide-react"

interface ProfileProps {
  user: User
}

export function Profile({ user }: ProfileProps) {
  const totalAchievements = user.achievements.length
  const averageGrade = user.academics.length > 0 
    ? (user.academics.reduce((sum, course) => {
        const gradePoints = { 'A': 4, 'A-': 3.7, 'B+': 3.3, 'B': 3, 'B-': 2.7, 'C+': 2.3, 'C': 2, 'C-': 1.7, 'D': 1, 'F': 0 }
        return sum + (gradePoints[course.grade as keyof typeof gradePoints] || 0)
      }, 0) / user.academics.length).toFixed(2)
    : '0.00'

  return (
    <div className="space-y-8">
      {/* Profile Title Card */}
      <div className="bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 rounded-3xl p-8 text-white shadow-xl">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <Image
            src={user.avatar || "/placeholder.svg"}
            alt={user.name}
            width={128}
            height={128}
            className="rounded-full border-4 border-white/30 shadow-xl"
          />
          <div className="text-center md:text-left flex-1">
            <h1 className="text-4xl font-bold mb-2">{user.name}</h1>
            <p className="text-white/90 text-lg">{user.email}</p>
            <p className="text-sm text-white/70 mt-2">
              Member since {new Date(user.joinedDate).toLocaleDateString()}
            </p>
            <div className="mt-4 flex flex-wrap gap-4">
              <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-1 border border-white/30">
                <span className="font-bold">{user.progressLevel}%</span>
                <span className="text-sm ml-1 text-white/90">Progress</span>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-1 border border-white/30">
                <span className="font-bold">{totalAchievements}</span>
                <span className="text-sm ml-1 text-white/90">Achievements</span>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-1 border border-white/30">
                <span className="font-bold">{user.gpa}</span>
                <span className="text-sm ml-1 text-white/90">GPA</span>
              </div>
            </div>
          </div>
          <button className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 border border-white/30 transition-colors">
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
              { name: "Alice Johnson", avatar: "/IMG_2464.png" },
              { name: "Bob Williams", avatar: "/IMG_2464.png" },
              { name: "Charlie Brown", avatar: "/IMG_2464.png" },
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
