import type { ActivityCategory, CompetitionCategory } from "@/types"

export const categoryDisplayNames: Record<ActivityCategory | CompetitionCategory, string> = {
  sports: "Sports",
  arts: "Arts & Culture",
  volunteer: "Volunteer Work",
  leadership: "Leadership",
  academic: "Academic",
  professional: "Professional",
  hobby: "Hobby",
  technology: "Technology",
  business: "Business",
  community: "Community",
  work: "Work",
  clubs: "Clubs",
  other: "Other"
}

export const categoryColors: Record<ActivityCategory | CompetitionCategory, string> = {
  sports: "from-red-500 to-rose-600",
  arts: "from-purple-500 to-pink-600",
  volunteer: "from-green-500 to-teal-600",
  leadership: "from-yellow-500 to-amber-600",
  academic: "from-blue-500 to-indigo-600",
  professional: "from-blue-500 to-indigo-600",
  hobby: "from-pink-500 to-rose-600",
  technology: "from-cyan-500 to-blue-600",
  business: "from-slate-500 to-gray-600",
  community: "from-emerald-500 to-green-600",
  work: "from-blue-500 to-indigo-600",
  clubs: "from-amber-500 to-orange-600",
  other: "from-gray-500 to-slate-600"
}

// More vibrant gradients for competition hero sections
export const competitionCategoryColors: Record<ActivityCategory | CompetitionCategory, string> = {
  sports: "from-red-600 via-orange-500 to-yellow-500", // Energetic fire gradient
  arts: "from-purple-600 via-pink-500 to-rose-400", // Creative vibrant gradient
  volunteer: "from-emerald-500 via-teal-400 to-cyan-400", // Fresh, uplifting gradient
  leadership: "from-amber-600 via-yellow-500 to-orange-400",
  academic: "from-blue-600 via-indigo-500 to-purple-500",
  professional: "from-blue-600 via-indigo-500 to-purple-500", // Professional yet vibrant
  hobby: "from-pink-600 via-rose-500 to-purple-400",
  technology: "from-cyan-600 via-blue-500 to-indigo-500",
  business: "from-slate-600 via-gray-500 to-zinc-500",
  community: "from-emerald-600 via-green-500 to-teal-500",
  work: "from-blue-600 via-indigo-500 to-purple-500",
  clubs: "from-amber-600 via-yellow-500 to-orange-400",
  other: "from-gray-600 via-slate-500 to-zinc-500"
}

export const categoryBgColors: Record<ActivityCategory | CompetitionCategory, string> = {
  sports: "bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300",
  arts: "bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300",
  volunteer: "bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300",
  leadership: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-300",
  academic: "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300",
  professional: "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300",
  hobby: "bg-pink-100 text-pink-700 dark:bg-pink-900/50 dark:text-pink-300",
  technology: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/50 dark:text-cyan-300",
  business: "bg-slate-100 text-slate-700 dark:bg-slate-900/50 dark:text-slate-300",
  community: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300",
  work: "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300",
  clubs: "bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300",
  other: "bg-gray-100 text-gray-700 dark:bg-gray-900/50 dark:text-gray-300"
}