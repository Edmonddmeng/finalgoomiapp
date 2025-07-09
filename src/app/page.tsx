"use client"

import { useState } from "react"
import { TabNavigation } from "@/components/Layout/TabNavigation"
import { Dashboard } from "@/components/Dashboard/Dashboard"
import { Roadmap } from "@/components/Roadmap/Roadmap"
import { Community } from "@/components/Community/Community"
import { Profile } from "@/components/Profile/Profile"
import { AIChat } from "@/components/AIChat/AIChat"
import { useLocalStorage } from "@/hooks/useLocalStorage"
import { mockUser, mockTasks, mockEvents, mockCommunities, mockPosts } from "@/lib/mockData"
import type { Task, Community as CommunityType, CommunityPost } from "@/types"

export default function Home() {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [user, setUser] = useLocalStorage("user", mockUser)
  const [tasks, setTasks] = useLocalStorage<Task[]>("tasks", mockTasks)
  const [communities, setCommunities] = useLocalStorage<CommunityType[]>("communities", mockCommunities)
  const [posts, setPosts] = useLocalStorage<CommunityPost[]>("posts", mockPosts)

  const handleTaskToggle = (taskId: string) => {
    setTasks((prev) => prev.map((task) => (task.id === taskId ? { ...task, completed: !task.completed } : task)))
  }

  const handleTaskCreate = (newTask: Omit<Task, "id">) => {
    const task: Task = {
      ...newTask,
      id: Date.now().toString(),
    }
    setTasks((prev) => [task, ...prev])
  }

  const handleTaskDelete = (taskId: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== taskId))
  }

  const handleJoinCommunity = (communityId: string) => {
    setCommunities((prev) =>
      prev.map((community) => (community.id === communityId ? { ...community, joined: !community.joined } : community)),
    )
  }

  const handleVotePost = (postId: string, voteType: "up" | "down") => {
    setPosts((prev) =>
      prev.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            upvotes: voteType === "up" ? post.upvotes + 1 : post.upvotes,
            downvotes: voteType === "down" ? post.downvotes + 1 : post.downvotes,
          }
        }
        return post
      }),
    )
  }

  const handleCreatePost = (newPost: Omit<CommunityPost, "id" | "createdAt" | "upvotes" | "downvotes" | "comments">) => {
    const post: CommunityPost = {
      ...newPost,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      upvotes: 0,
      downvotes: 0,
      comments: 0,
    }
    setPosts((prev) => [post, ...prev])
  }

  const renderActiveTab = () => {
    switch (activeTab) {
      case "dashboard":
        return <Dashboard user={user} tasks={tasks} setUser={setUser} />
      case "roadmap":
        return (
          <Roadmap
            progressLevel={user.progressLevel}
            tasks={tasks}
            events={mockEvents}
            onTaskToggle={handleTaskToggle}
            onTaskCreate={handleTaskCreate}
            onTaskDelete={handleTaskDelete}
          />
        )
      case "community":
        return (
          <Community
            communities={communities}
            posts={posts}
            onJoinCommunity={handleJoinCommunity}
            onVotePost={handleVotePost}
            onCreatePost={handleCreatePost}
          />
        )
      case "profile":
        return <Profile user={user} />
      default:
        return <Dashboard user={user} tasks={tasks} setUser={setUser} />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-slate-900 dark:via-purple-950 dark:to-pink-950">
      {/* Sidebar Navigation */}
      <TabNavigation
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onChatToggle={() => setIsChatOpen(!isChatOpen)}
        isChatOpen={isChatOpen}
      />

      {/* Main Content Area */}
      <div className="pl-72 min-h-screen">
        <div className="max-w-7xl mx-auto p-8">{renderActiveTab()}</div>
      </div>

      {/* AI Chat */}
      <AIChat isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </div>
  )
}
