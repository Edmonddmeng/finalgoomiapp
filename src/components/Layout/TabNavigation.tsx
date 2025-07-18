
"use client"
import { LayoutDashboard, Milestone, Users, User, MessageSquare, Settings, LogOut, ClipboardCheck } from "lucide-react"
import { LogoIconDashboard } from "../Utils/logo"
import { useAuth } from "@/contexts/AuthContext"
import { useConfirm } from "@/components/Utils/ConfirmDialog"
import { useRouter } from "next/navigation"

interface TabNavigationProps {
  activeTab: string
  onTabChange: (tab: string) => void
  onChatToggle: () => void
  isChatOpen: boolean
}

const navItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "roadmap", label: "Roadmap", icon: Milestone },
  { id: "evaluations", label: "Evaluations", icon: ClipboardCheck },
  { id: "community", label: "Community", icon: Users },
  { id: "profile", label: "Profile", icon: User },
]

export function TabNavigation({ activeTab, onTabChange, onChatToggle, isChatOpen }: TabNavigationProps) {
  const { logout, user } = useAuth()
  const { confirm } = useConfirm()
  const router = useRouter()

  const handleLogout = async () => {
    const confirmed = await confirm({
      title: "Logout",
      message: `Are you sure you want to logout${user?.name ? `, ${user.name}` : ''}? You'll need to sign in again to access your account.`,
      confirmText: "Logout",
      cancelText: "Stay Logged In",
      type: "warning"
    })

    if (confirmed) {
      try {
        await logout()
      } catch (error) {
        console.error('Logout failed:', error)
        // Fallback: manually clear and redirect if logout fails
        localStorage.clear()
        router.push('/login')
      }
    }
  }

  return (
    <div className="fixed top-0 left-0 h-full w-72 bg-white dark:bg-slate-800 border-r border-gray-200 dark:border-slate-700 flex flex-col p-6">
      <div className="flex items-center gap-3 mb-10">
        <LogoIconDashboard className="w-12 h-12 bg-gradient-to-br from-orange-300 to-yellow-500 rounded-lg" />
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
        
        <button 
          onClick={() => onTabChange("settings")}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
            activeTab === "settings"
              ? "bg-purple-500 text-white shadow-md"
              : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 hover:text-gray-900 dark:hover:text-white"
          }`}
        >
          <Settings size={20} />
          <span>Settings</span>
        </button>
        
        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 hover:text-red-600 dark:hover:text-red-400 transition-colors"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  )
}