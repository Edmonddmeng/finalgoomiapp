// import { useState } from "react"
// import { useAuth } from "@/contexts/AuthContext"
// import { useTasks } from "@/hooks/useTasks"
// import { SimplePixelVisualization } from "./SimplePixelVisualization"
// import { TaskList } from "./TaskList"
// import { Calendar } from "./Calendar"
// import { Loader2 } from "lucide-react"

// export function Roadmap() {
//   const { user } = useAuth()
//   const { data: tasksData, isLoading } = useTasks({ status: 'all' })
//   const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  
//   const tasks = tasksData || []
//   const completedTasks = tasks.filter(task => task.completed).length
//   const totalTasks = tasks.length
//   const upcomingTasks = tasks.filter(task => {
//     if (!task.dueDate) return false
//     return new Date(task.dueDate) > new Date()
//   })

//   if (isLoading) {
//     return (
//       <div className="flex items-center justify-center min-h-[400px]">
//         <div className="text-center space-y-3">
//           <Loader2 className="animate-spin h-12 w-12 text-purple-600 mx-auto" />
//           <p className="text-gray-500 dark:text-gray-400">Loading your roadmap...</p>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="space-y-8">
//       {/* Title Card Section */}
//       <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-3xl p-8 text-white shadow-xl">
//         <div className="max-w-4xl">
//           <h1 className="text-4xl font-bold mb-3">Your Achievement Roadmap</h1>
//           <p className="text-lg text-white/90 leading-relaxed">
//             Visualize your growth journey, manage your goals, and track your progress. Every task completed 
//             helps you grow stronger and reach new heights.
//           </p>
//         </div>
//       </div>

//       <SimplePixelVisualization completedTasks={completedTasks} totalTasks={totalTasks} />
      
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//         <div className="lg:col-span-2">
//           <TaskList 
//             tasks={tasks}
//             selectedDate={selectedDate}
//             onClearSelectedDate={() => setSelectedDate(null)}
//           />
//         </div>
//         <div className="lg:col-span-1">
//           <Calendar 
//             tasks={tasks}
//             upcomingEvents={upcomingTasks}
//             selectedDate={selectedDate}
//             onDateSelect={setSelectedDate}
//           />
//         </div>
//       </div>
//     </div>
//   )
// }


import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { useTasks } from "@/hooks/useTasks"
import { SimplePixelVisualization } from "./SimplePixelVisualization"
import { TownVisualization } from "./TownVisualization"
import { PixelMosaicVisualization } from "./PixelMosaicVisualization"
import { PixelGardenVisualization } from "./PixelGardenVisualization"
import { TreeVisualization } from "./TreeVisualization"
import { TaskList } from "./TaskList"
import { Calendar } from "./Calendar"
import { Loader2, Palette, Settings2, X, Shuffle } from "lucide-react"

type VisualizationType = 'simple' | 'town' | 'mosaic' | 'garden' | 'tree'

const visualizationOptions = [
  { 
    id: 'simple', 
    name: 'Simple Tracker', 
    icon: '📊', 
    description: 'Clean and minimal progress blocks',
    color: 'bg-blue-500'
  },
  { 
    id: 'town', 
    name: 'Journey Town', 
    icon: '🏘️', 
    description: 'Your progress as a town journey',
    color: 'bg-purple-500'
  },
  { 
    id: 'mosaic', 
    name: 'Pixel Mosaic', 
    icon: '🎨', 
    description: 'Beautiful mosaic patterns',
    color: 'bg-pink-500'
  },
  { 
    id: 'garden', 
    name: 'Pixel Garden', 
    icon: '🌱', 
    description: 'Watch your garden grow',
    color: 'bg-green-500'
  },
  { 
    id: 'tree', 
    name: 'Forest Growth', 
    icon: '🌳', 
    description: 'Grow a lush forest',
    color: 'bg-emerald-500'
  }
]

export function Roadmap() {
  const { user } = useAuth()
  const { data: tasksData, isLoading } = useTasks({ status: 'all' })
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedVisualization, setSelectedVisualization] = useState<VisualizationType>('simple')
  const [showVisualizationSelector, setShowVisualizationSelector] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)
  
  // Load saved visualization preference
  useEffect(() => {
    const saved = localStorage.getItem('roadmap-visualization')
    if (saved && visualizationOptions.find(v => v.id === saved)) {
      setSelectedVisualization(saved as VisualizationType)
    }
  }, [])

  // Save visualization preference
  const handleVisualizationChange = (newVisualization: VisualizationType) => {
    setIsTransitioning(true)
    setTimeout(() => {
      setSelectedVisualization(newVisualization)
      localStorage.setItem('roadmap-visualization', newVisualization)
      setShowVisualizationSelector(false)
      setIsTransitioning(false)
    }, 150)
  }

  // Random visualization selector
  const handleRandomVisualization = () => {
    const otherOptions = visualizationOptions.filter(v => v.id !== selectedVisualization)
    const randomOption = otherOptions[Math.floor(Math.random() * otherOptions.length)]
    handleVisualizationChange(randomOption.id as VisualizationType)
  }

  const tasks = tasksData || []
  const completedTasks = tasks.filter(task => task.completed).length
  const totalTasks = tasks.length
  const progressLevel = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0
  
  const upcomingTasks = tasks.filter(task => {
    if (!task.dueDate) return false
    return new Date(task.dueDate) > new Date()
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-3">
          <Loader2 className="animate-spin h-12 w-12 text-purple-600 mx-auto" />
          <p className="text-gray-500 dark:text-gray-400">Loading your roadmap...</p>
        </div>
      </div>
    )
  }

  const renderVisualization = () => {
    const currentOption = visualizationOptions.find(v => v.id === selectedVisualization)
    
    return (
      <div className={`transition-all duration-300 ${isTransitioning ? 'opacity-50 scale-95' : 'opacity-100 scale-100'}`}>
        {/* Visualization Header */}
        <div className="mb-4 flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full ${currentOption?.color}`}></div>
          <span className="text-lg font-semibold text-gray-900 dark:text-white">
            {currentOption?.name}
          </span>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {currentOption?.description}
          </span>
        </div>

        {/* Visualization Component */}
        {(() => {
          switch (selectedVisualization) {
            case 'simple':
              return <SimplePixelVisualization completedTasks={completedTasks} totalTasks={totalTasks} />
            case 'town':
              return <TownVisualization progressLevel={progressLevel} />
            case 'mosaic':
              return <PixelMosaicVisualization progressLevel={progressLevel} />
            case 'garden':
              return <PixelGardenVisualization progressLevel={progressLevel} />
            case 'tree':
              return <TreeVisualization progressLevel={progressLevel} />
            default:
              return <SimplePixelVisualization completedTasks={completedTasks} totalTasks={totalTasks} />
          }
        })()}
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Title Card Section */}
      <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-3xl p-8 text-white shadow-xl">
        <div className="max-w-4xl">
          <h1 className="text-4xl font-bold mb-3">Your Achievement Roadmap</h1>
          <p className="text-lg text-white/90 leading-relaxed">
            Visualize your growth journey, manage your goals, and track your progress. Every task completed 
            helps you grow stronger and reach new heights.
          </p>
        </div>
      </div>

      {/* Visualization Section with Selector */}
      <div className="space-y-4">
        {/* Visualization Controls */}
        <div className="flex justify-end">
          <div className="relative">
            <div className="flex gap-2">
              <button
                onClick={handleRandomVisualization}
                className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg shadow-sm hover:shadow-md transition-all"
                title="Random visualization"
              >
                <Shuffle size={16} className="text-purple-600" />
              </button>
              
              <button
                onClick={() => setShowVisualizationSelector(!showVisualizationSelector)}
                className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg shadow-sm hover:shadow-md transition-all"
              >
                <Palette size={16} className="text-purple-600" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {visualizationOptions.find(v => v.id === selectedVisualization)?.name}
                </span>
                <Settings2 size={14} className="text-gray-400" />
              </button>
            </div>

            {/* Visualization Selector Dropdown */}
            {showVisualizationSelector && (
              <>
                {/* Backdrop */}
                <div 
                  className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30"
                  onClick={() => setShowVisualizationSelector(false)}
                />
                
                {/* Dropdown - positioned relative to the button */}
                <div className="absolute top-full right-0 mt-2 w-96 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl shadow-xl z-40">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Choose Your Visualization
                      </h3>
                      <button
                        onClick={() => setShowVisualizationSelector(false)}
                        className="p-1 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-full transition-colors"
                      >
                        <X size={16} className="text-gray-500" />
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-3">
                      {visualizationOptions.map((option) => (
                        <button
                          key={option.id}
                          onClick={() => handleVisualizationChange(option.id as VisualizationType)}
                          className={`flex items-center gap-4 p-4 rounded-lg text-left transition-all ${
                            selectedVisualization === option.id
                              ? 'bg-purple-100 dark:bg-purple-900/30 border-purple-200 dark:border-purple-800 border-2 shadow-sm'
                              : 'hover:bg-gray-50 dark:hover:bg-slate-700/50 border-2 border-transparent'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-4 h-4 rounded-full ${option.color}`}></div>
                            <span className="text-2xl">{option.icon}</span>
                          </div>
                          <div className="flex-1">
                            <div className="font-medium text-gray-900 dark:text-white">{option.name}</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">{option.description}</div>
                          </div>
                          {selectedVisualization === option.id && (
                            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                          )}
                        </button>
                      ))}
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-slate-700">
                      <button
                        onClick={handleRandomVisualization}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                      >
                        <Shuffle size={16} />
                        <span>Surprise Me!</span>
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Render Selected Visualization */}
        {renderVisualization()}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <TaskList 
            tasks={tasks}
            selectedDate={selectedDate} 
            onClearSelectedDate={() => setSelectedDate(null)}
            onRefreshNeeded={() => {
              // This will trigger a re-render of the TaskList component
              console.log('🔄 Roadmap component received refresh request')
            }}
          />
        </div>
        <div className="lg:col-span-1">
          <Calendar 
            tasks={tasks}
            upcomingEvents={upcomingTasks}
            selectedDate={selectedDate}
            onDateSelect={setSelectedDate}
          />
        </div>
      </div>
    </div>
  )
}