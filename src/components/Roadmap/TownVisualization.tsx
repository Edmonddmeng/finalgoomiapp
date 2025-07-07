import { TrendingUp } from "lucide-react"

interface TownVisualizationProps {
  progressLevel: number
}

export function TownVisualization({ progressLevel }: TownVisualizationProps) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-slate-700">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Your Journey</h3>
        <div className="flex items-center gap-2 text-purple-600 font-medium">
          <TrendingUp size={18} />
          <span>{progressLevel}% Complete</span>
        </div>
      </div>
      <div className="relative h-40 bg-gradient-to-t from-green-100 to-blue-100 dark:from-green-900/30 dark:to-blue-900/30 rounded-lg overflow-hidden">
        {/* This is a simplified visualization. A real implementation would use more complex graphics or a library like Three.js */}
        <div className="absolute bottom-0 left-0 w-full h-1/3 bg-green-300 dark:bg-green-800/40"></div>
        <div className="absolute bottom-0 left-0 w-full h-4 bg-green-400 dark:bg-green-700/50"></div>

        {/* Progress Bar */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-5/6 h-2 bg-gray-200 dark:bg-slate-700 rounded-full">
          <div
            className="h-full bg-purple-500 rounded-full transition-all duration-500"
            style={{ width: `${progressLevel}%` }}
          ></div>
        </div>

        {/* "Town" elements */}
        <div className="absolute bottom-6 left-1/4 w-8 h-12 bg-yellow-300 dark:bg-yellow-700/60 rounded-t-md"></div>
        <div className="absolute bottom-6 left-1/2 w-12 h-16 bg-red-300 dark:bg-red-700/60 rounded-t-lg"></div>
        <div className="absolute bottom-6 right-1/4 w-10 h-10 bg-blue-300 dark:bg-blue-700/60 rounded-full"></div>

        <div
          className="absolute bottom-6 w-10 h-10 bg-purple-500 rounded-full transition-all duration-500 flex items-center justify-center text-white font-bold"
          style={{ left: `calc(${progressLevel}% - 20px)` }}
        >
          You
        </div>
      </div>
    </div>
  )
}
