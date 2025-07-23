"use client"

import { useState } from "react"
import { AuthProvider } from "@/contexts/AuthContext"
import { TabNavigation } from "@/components/Layout/TabNavigation"
import { Dashboard } from "@/components/Dashboard/Dashboard"
import { Roadmap } from "@/components/Roadmap/Roadmap"
import { Community } from "@/components/Community/Community"
import { Profile } from "@/components/Profile/Profile"
import { Settings } from "@/components/Settings/Settings"
import { Evaluations } from "@/components/Evaluations/Evaluations"
import { AIChatPage } from "@/components/AIChat/AIChatPage"
import { ChatOverview } from "@/components/Chat/chat-overview"
import SavedProfile from "@/components/SavedProfile/SavedProfile"
import { useGlobalUnreadMessages } from "@/hooks/useGlobalUnreadMessages"

function AppContent() {
  const [activeTab, setActiveTab] = useState("dashboard")
  const { unreadCount, isLoading, error } = useGlobalUnreadMessages()



  const renderActiveTab = () => {
    switch (activeTab) {
      case "dashboard":
        return <Dashboard />
      case "roadmap":
        return <Roadmap />
      case "community":
        return <Community />
      case "profile":
        return <Profile />
      case "evaluations":
        return <Evaluations />
      case "settings":
        return <Settings />
      case "chat":
        return <ChatOverview />
      case "saved-profiles":
        return <SavedProfile />
      case "ai-chat":
        return <AIChatPage />
      default:
        return <Dashboard />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-slate-900 dark:via-purple-950 dark:to-pink-950">
      {/* Sidebar Navigation */}
      <TabNavigation
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onChatToggle={() => setActiveTab(activeTab === "ai-chat" ? "dashboard" : "ai-chat")}
        isChatOpen={activeTab === "ai-chat"}
        unreadMessagesCount={unreadCount}
      />

      {/* Main Content Area */}
      <div className="pl-72 min-h-screen">
        <div className="max-w-7xl mx-auto p-8">{renderActiveTab()}</div>
      </div>

    </div>
  )
}

export default function Home() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}