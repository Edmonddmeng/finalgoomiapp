export interface User {
  id: string
  name: string
  email: string
  avatar: string
  gpa: number
  standardizedScores: {
    sat?: number
    act?: number
    ap?: { subject: string; score: number }[]
  }
  achievements: Achievement[]
  activities: Activity[]
  academics: Academic[]
  competitions: Competition[]
  comments: Comment[]
  progressLevel: number
  totalPoints: number
  streak: number
  joinedDate: string
}

export interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  dateEarned: string
  category: "academic" | "sports" | "community" | "personal"
}

export interface Activity {
  id: string
  name: string
  category: "sports" | "arts" | "volunteer" | "work" | "clubs"
  description: string
  startDate: string
  endDate?: string
  hours: number
  position?: string
  totalPoints?: number
}

export interface Academic {
  id: string
  subject: string
  grade: string
  credits: number
  term: string
  year: number
}

export interface Competition {
  id: string
  name: string
  category: string
  placement: string
  date: string
  description: string
  notes?: string
  satisfaction?: number
  resultsAdded?: boolean
}

export interface Comment {
  id: string
  author: string
  role: "parent" | "mentor" | "teacher"
  content: string
  date: string
  sentiment: "positive" | "neutral" | "constructive"
}

export interface Task {
  id: string
  title: string
  description: string
  dueDate: string
  priority: "low" | "medium" | "high"
  category: "academic" | "personal" | "extracurricular"
  completed: boolean
  createdAt: string
}

export interface Event {
  id: string
  title: string
  description: string
  date: string
  time: string
  type: "class" | "meeting" | "deadline" | "competition" | "personal"
  priority: "low" | "medium" | "high"
}

export interface PostComment {
  id: string
  content: string
  author: string
  authorAvatar: string
  date: string
  upvotes: number
}

export interface CommunityPost {
  id: string
  title: string
  content: string
  author: string
  authorAvatar: string
  community: string
  upvotes: number
  downvotes: number
  comments: PostComment[]
  tags: string[]
  communityId: string
  createdAt: string
}

export interface Community {
  id: string
  name: string
  description: string
  members: number
  category: string
  avatar: string
  joined: boolean
}
