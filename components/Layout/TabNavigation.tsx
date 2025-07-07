"use client"
import { LayoutDashboard, Milestone, Users, User, MessageSquare, Settings, LogOut } from "lucide-react"

interface TabNavigationProps {
  activeTab: string
  onTabChange: (tab: string) => void
  onChatToggle: () => void
  isChatOpen: boolean
}

const navItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "roadmap", label: "Roadmap", icon: Milestone },
  { id: "community", label: "Community", icon: Users },
  { id: "profile", label: "Profile", icon: User },
]

export function TabNavigation({ activeTab, onTabChange, onChatToggle, isChatOpen }: TabNavigationProps) {
  return (
    <div className="fixed top-0 left-0 h-full w-72 bg-white dark:bg-slate-800 border-r border-gray-200 dark:border-slate-700 flex flex-col p-6">
      <div className="flex items-center gap-3 mb-10">
        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg"></div>
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">Goomi</h1>
      </div>

      <nav className="flex-1 space-y-2">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
              activeTab === item.id
                ? "bg-purple-500 text-white shadow-md"
                : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 hover:text-gray-900 dark:hover:text-white"
            }`}
          >
            <item.icon size={20} />
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="space-y-2">
        <button
          onClick={onChatToggle}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
            isChatOpen
              ? "bg-pink-500 text-white"
              : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 hover:text-gray-900 dark:hover:text-white"
          }`}
        >
          <MessageSquare size={20} />
          <span>AI Advisor</span>
        </button>
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 hover:text-gray-900 dark:hover:text-white">
          <Settings size={20} />
          <span>Settings</span>
        </button>
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 hover:text-gray-900 dark:hover:text-white">
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  )
}
