import { Sprout, TreePine, Trees, TreeDeciduous, Cloud, Sun, Bird, Flower } from "lucide-react"

interface TreeVisualizationProps {
  progressLevel: number
}

export function TreeVisualization({ progressLevel }: TreeVisualizationProps) {
  // Calculate forest density based on progress
  const treeDensity = Math.floor(progressLevel / 10) // 0-10 trees
  const undergrowthDensity = Math.floor(progressLevel / 15) // 0-6 plants
  const wildlifeDensity = Math.floor(progressLevel / 25) // 0-4 animals/birds
  
  // Determine forest stage
  const getForestStage = () => {
    if (progressLevel < 25) return 0 // Barren land with seeds
    if (progressLevel < 50) return 1 // Young forest
    if (progressLevel < 75) return 2 // Growing forest
    return 3 // Lush forest
  }

  const forestStage = getForestStage()

  const forestStages = [
    {
      title: "Seeds of Growth",
      description: "The journey begins with small seeds of potential",
      skyGradient: "from-gray-100 via-blue-100 to-blue-200 dark:from-gray-900/20 dark:via-blue-900/20 dark:to-blue-900/30",
      groundColor: "from-amber-200/30 to-amber-300/20 dark:from-amber-900/30 dark:to-amber-800/20",
      sunOpacity: 30
    },
    {
      title: "Young Forest",
      description: "New growth emerges as your efforts take root",
      skyGradient: "from-blue-100 via-blue-200 to-sky-200 dark:from-blue-900/30 dark:via-blue-900/40 dark:to-sky-900/40",
      groundColor: "from-green-300/40 to-amber-300/30 dark:from-green-900/40 dark:to-amber-800/30",
      sunOpacity: 50
    },
    {
      title: "Thriving Ecosystem",
      description: "Your forest grows stronger with diverse achievements",
      skyGradient: "from-sky-200 via-blue-300 to-cyan-200 dark:from-sky-900/40 dark:via-blue-900/50 dark:to-cyan-900/40",
      groundColor: "from-green-400/50 to-green-300/40 dark:from-green-800/50 dark:to-green-900/40",
      sunOpacity: 70
    },
    {
      title: "Lush Paradise",
      description: "A magnificent forest flourishing with your accomplishments",
      skyGradient: "from-cyan-200 via-sky-300 to-blue-400 dark:from-cyan-900/50 dark:via-sky-900/60 dark:to-blue-900/50",
      groundColor: "from-green-500/60 to-green-400/50 dark:from-green-700/60 dark:to-green-800/50",
      sunOpacity: 90
    }
  ]

  const currentStage = forestStages[forestStage]

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-slate-700">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Your Forest of Achievements</h3>
        <div className="flex items-center gap-2 text-green-600 dark:text-green-400 font-medium">
          <Trees size={20} />
          <span>{progressLevel}% Complete</span>
        </div>
      </div>

      {/* Forest visualization area */}
      <div className={`relative h-64 bg-gradient-to-t ${currentStage.skyGradient} rounded-xl overflow-hidden`}>
        {/* Sun */}
        {forestStage > 0 && (
          <div className={`absolute top-4 right-8 transition-all duration-1000`} style={{ opacity: `${currentStage.sunOpacity}%` }}>
            <Sun size={32} className="text-yellow-400 dark:text-yellow-300" />
          </div>
        )}
        
        {/* Clouds */}
        {forestStage >= 2 && (
          <>
            <Cloud size={24} className="absolute top-8 left-12 text-white/40 animate-[float_20s_ease-in-out_infinite]" />
            <Cloud size={20} className="absolute top-12 right-24 text-white/30 animate-[float_25s_ease-in-out_infinite_reverse]" />
          </>
        )}
        
        {/* Birds */}
        {wildlifeDensity > 0 && (
          <>
            {Array.from({ length: Math.min(wildlifeDensity, 3) }).map((_, i) => (
              <Bird 
                key={i} 
                size={16} 
                className={`absolute text-gray-700 dark:text-gray-300 animate-[fly_${15 + i * 5}s_ease-in-out_infinite]`}
                style={{
                  top: `${20 + i * 15}px`,
                  left: `${20 + i * 30}%`,
                  animationDelay: `${i * 2}s`
                }}
              />
            ))}
          </>
        )}
        
        {/* Ground */}
        <div className={`absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t ${currentStage.groundColor}`}></div>
        
        {/* Background trees (far layer) */}
        <div className="absolute bottom-12 left-0 w-full flex justify-around opacity-30">
          {Array.from({ length: Math.min(treeDensity, 5) }).map((_, i) => (
            <TreePine 
              key={`bg-${i}`} 
              size={24 + i * 2} 
              className="text-green-700 dark:text-green-600"
            />
          ))}
        </div>
        
        {/* Middle layer trees */}
        <div className="absolute bottom-10 left-0 w-full flex justify-around opacity-60">
          {Array.from({ length: Math.max(0, treeDensity - 3) }).map((_, i) => (
            <Trees 
              key={`mid-${i}`} 
              size={32 + i * 3} 
              className="text-green-600 dark:text-green-500"
            />
          ))}
        </div>
        
        {/* Foreground trees */}
        <div className="absolute bottom-8 left-0 w-full flex justify-around">
          {Array.from({ length: Math.min(treeDensity, 4) }).map((_, i) => {
            const TreeType = i % 2 === 0 ? TreeDeciduous : TreePine
            return (
              <TreeType 
                key={`front-${i}`} 
                size={40 + i * 4} 
                className="text-green-500 dark:text-green-400 drop-shadow-lg"
              />
            )
          })}
        </div>
        
        {/* Undergrowth and flowers */}
        {undergrowthDensity > 0 && (
          <div className="absolute bottom-0 left-0 w-full flex justify-around">
            {Array.from({ length: undergrowthDensity }).map((_, i) => (
              <div key={`plant-${i}`} className="relative">
                {i % 2 === 0 ? (
                  <Flower size={16} className="text-pink-400 dark:text-pink-300" />
                ) : (
                  <Sprout size={18} className="text-green-400 dark:text-green-300" />
                )}
              </div>
            ))}
          </div>
        )}
        
        {/* Progress bar at bottom */}
        <div className="absolute bottom-2 left-4 right-4 h-1.5 bg-white/40 dark:bg-slate-700/40 rounded-full backdrop-blur-sm">
          <div
            className="h-full bg-gradient-to-r from-green-500 to-emerald-600 rounded-full transition-all duration-500"
            style={{ width: `${progressLevel}%` }}
          />
        </div>
      </div>

      {/* Stage information */}
      <div className="mt-4 p-4 rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800">
        <h4 className="font-semibold text-green-800 dark:text-green-200 mb-1">{currentStage.title}</h4>
        <p className="text-sm text-gray-600 dark:text-gray-400">{currentStage.description}</p>
        
        {/* Forest statistics */}
        <div className="mt-3 grid grid-cols-3 gap-3 text-center">
          <div className="bg-white/50 dark:bg-slate-800/50 rounded-lg p-2">
            <div className="text-xl font-bold text-green-600">{treeDensity}</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Trees</div>
          </div>
          <div className="bg-white/50 dark:bg-slate-800/50 rounded-lg p-2">
            <div className="text-xl font-bold text-pink-600">{undergrowthDensity}</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Plants</div>
          </div>
          <div className="bg-white/50 dark:bg-slate-800/50 rounded-lg p-2">
            <div className="text-xl font-bold text-blue-600">{wildlifeDensity}</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Wildlife</div>
          </div>
        </div>
        
        {/* Progress milestones */}
        <div className="mt-3 flex justify-between items-center">
          <span className="text-xs text-gray-500 dark:text-gray-400">Growth Progress</span>
          <div className="flex gap-1">
            {[0, 25, 50, 75].map((milestone) => (
              <div
                key={milestone}
                className={`w-8 h-1 rounded-full transition-all ${
                  progressLevel > milestone
                    ? 'bg-green-500'
                    : 'bg-gray-300 dark:bg-gray-600'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}