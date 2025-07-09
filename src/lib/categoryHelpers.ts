import type { ActivityCategory } from "@/types"

export const categoryDisplayNames: Record<ActivityCategory, string> = {
  sports: "Sports",
  arts: "Arts & Culture",
  volunteer: "Volunteer Work",
  work: "Work Experience",
  clubs: "Clubs & Organizations"
}

export const categoryColors: Record<ActivityCategory, string> = {
  sports: "from-red-500 to-rose-600",
  arts: "from-purple-500 to-pink-600",
  volunteer: "from-green-500 to-teal-600",
  work: "from-blue-500 to-indigo-600",
  clubs: "from-amber-500 to-orange-600"
}

// More vibrant gradients for competition hero sections
export const competitionCategoryColors: Record<ActivityCategory, string> = {
  sports: "from-red-600 via-orange-500 to-yellow-500", // Energetic fire gradient
  arts: "from-purple-600 via-pink-500 to-rose-400", // Creative vibrant gradient
  volunteer: "from-emerald-500 via-teal-400 to-cyan-400", // Fresh, uplifting gradient
  work: "from-blue-600 via-indigo-500 to-purple-500", // Professional yet vibrant
  clubs: "from-amber-500 via-yellow-400 to-lime-400" // Bright, energetic gradient
}

export const categoryBgColors: Record<ActivityCategory, string> = {
  sports: "bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300",
  arts: "bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300",
  volunteer: "bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300",
  work: "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300",
  clubs: "bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300"
}