import { useState, useEffect } from "react"

interface PixelGardenVisualizationProps {
  progressLevel: number
}

type PixelType = 'empty' | 'soil' | 'grass' | 'flower-red' | 'flower-yellow' | 'flower-pink' | 'flower-purple' | 'tree' | 'bush' | 'path' | 'water' | 'rock'

interface GardenStage {
  title: string
  description: string
  unlocks: string[]
}

export function PixelGardenVisualization({ progressLevel }: PixelGardenVisualizationProps) {
  const gridWidth = 20
  const gridHeight = 12
  const totalPixels = gridWidth * gridHeight
  const filledPixels = Math.floor((progressLevel / 100) * totalPixels)
  
  // Garden stages
  const getGardenStage = () => {
    if (progressLevel < 25) return 0
    if (progressLevel < 50) return 1
    if (progressLevel < 75) return 2
    return 3
  }
  
  const gardenStage = getGardenStage()
  
  const gardenStages: GardenStage[] = [
    {
      title: "Barren Land",
      description: "Your garden awaits its first seeds",
      unlocks: ["Soil", "Grass", "Paths"]
    },
    {
      title: "Sprouting Garden", 
      description: "First signs of life appear",
      unlocks: ["Red Flowers", "Yellow Flowers", "Bushes"]
    },
    {
      title: "Blooming Paradise",
      description: "Colors burst throughout your garden",
      unlocks: ["Pink Flowers", "Purple Flowers", "Trees"]
    },
    {
      title: "Enchanted Oasis",
      description: "A magical garden in full bloom",
      unlocks: ["Water Features", "Rock Gardens", "Special Plants"]
    }
  ]
  
  const pixelColors: Record<PixelType, string> = {
    'empty': 'bg-amber-100 dark:bg-amber-950',
    'soil': 'bg-amber-700 dark:bg-amber-800',
    'grass': 'bg-green-500 dark:bg-green-600',
    'flower-red': 'bg-red-500 dark:bg-red-600',
    'flower-yellow': 'bg-yellow-400 dark:bg-yellow-500',
    'flower-pink': 'bg-pink-400 dark:bg-pink-500',
    'flower-purple': 'bg-purple-500 dark:bg-purple-600',
    'tree': 'bg-green-700 dark:bg-green-800',
    'bush': 'bg-green-600 dark:bg-green-700',
    'path': 'bg-stone-400 dark:bg-stone-600',
    'water': 'bg-blue-400 dark:bg-blue-500',
    'rock': 'bg-gray-500 dark:bg-gray-600'
  }
  
  // Generate garden pattern based on progress
  const generateGarden = (): PixelType[] => {
    const garden: PixelType[] = new Array(totalPixels).fill('empty')
    
    if (progressLevel === 0) return garden
    
    // Create paths first (every 5 pixels horizontally)
    for (let i = 0; i < gridHeight; i++) {
      for (let j = 4; j < gridWidth; j += 5) {
        const index = i * gridWidth + j
        if (index < filledPixels && Math.random() > 0.3) {
          garden[index] = 'path'
        }
      }
    }
    
    // Fill in the garden based on progress
    let pixelsFilled = 0
    const maxAttempts = filledPixels * 3
    let attempts = 0
    
    while (pixelsFilled < filledPixels && attempts < maxAttempts) {
      const index = Math.floor(Math.random() * totalPixels)
      attempts++
      
      if (garden[index] === 'empty') {
        const rand = Math.random()
        
        // Determine what to place based on stage and randomness
        if (gardenStage === 0) {
          // Stage 0: Basic elements
          if (rand < 0.6) garden[index] = 'grass'
          else if (rand < 0.9) garden[index] = 'soil'
          else garden[index] = 'path'
        } else if (gardenStage === 1) {
          // Stage 1: Add basic flowers
          if (rand < 0.4) garden[index] = 'grass'
          else if (rand < 0.6) garden[index] = 'flower-red'
          else if (rand < 0.75) garden[index] = 'flower-yellow'
          else if (rand < 0.9) garden[index] = 'bush'
          else garden[index] = 'soil'
        } else if (gardenStage === 2) {
          // Stage 2: More variety
          if (rand < 0.3) garden[index] = 'grass'
          else if (rand < 0.45) garden[index] = 'flower-pink'
          else if (rand < 0.6) garden[index] = 'flower-purple'
          else if (rand < 0.7) garden[index] = 'flower-red'
          else if (rand < 0.8) garden[index] = 'flower-yellow'
          else if (rand < 0.9) garden[index] = 'tree'
          else garden[index] = 'bush'
        } else {
          // Stage 3: Full variety
          if (rand < 0.2) garden[index] = 'grass'
          else if (rand < 0.3) garden[index] = 'flower-red'
          else if (rand < 0.4) garden[index] = 'flower-yellow'
          else if (rand < 0.5) garden[index] = 'flower-pink'
          else if (rand < 0.6) garden[index] = 'flower-purple'
          else if (rand < 0.7) garden[index] = 'tree'
          else if (rand < 0.8) garden[index] = 'bush'
          else if (rand < 0.85) garden[index] = 'water'
          else if (rand < 0.9) garden[index] = 'rock'
          else garden[index] = 'soil'
        }
        
        pixelsFilled++
      }
    }
    
    // Fill remaining pixels with grass if needed
    for (let i = 0; i < garden.length && pixelsFilled < filledPixels; i++) {
      if (garden[i] === 'empty') {
        garden[i] = 'grass'
        pixelsFilled++
      }
    }
    
    return garden
  }
  
  const [garden, setGarden] = useState<PixelType[]>(() => generateGarden())
  
  // Regenerate garden when progress changes
  useEffect(() => {
    setGarden(generateGarden())
  }, [progressLevel])
  
  // Add floating animation to some pixels
  const shouldFloat = (index: number, type: PixelType) => {
    return (type.includes('flower') || type === 'tree') && index % 7 === 0
  }
  
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-slate-700">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Your Pixel Garden</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {filledPixels} of {totalPixels} pixels cultivated
          </p>
        </div>
        <div className="flex items-center gap-2 text-green-600 dark:text-green-400 font-medium">
          <div className="w-4 h-4 bg-green-500 dark:bg-green-600"></div>
          <span>{progressLevel}% Complete</span>
        </div>
      </div>
      
      {/* Pixel Grid */}
      <div className="relative">
        <div 
          className="grid gap-0.5 mx-auto bg-amber-50 dark:bg-amber-950/50 p-2 rounded-lg"
          style={{
            gridTemplateColumns: `repeat(${gridWidth}, minmax(0, 1fr))`,
            maxWidth: '600px'
          }}
        >
          {garden.map((pixel, index) => (
            <div
              key={index}
              className={`
                aspect-square ${pixelColors[pixel]} 
                ${shouldFloat(index, pixel) ? 'animate-pulse' : ''}
                transition-all duration-300 rounded-sm
                ${pixel !== 'empty' ? 'scale-100' : 'scale-90 opacity-50'}
              `}
              style={{
                animationDelay: `${(index % 10) * 100}ms`
              }}
            />
          ))}
        </div>
        
        {/* Pixel counter overlay */}
        <div className="absolute top-2 right-2 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-lg px-2 py-1 text-xs font-mono">
          {progressLevel}%
        </div>
      </div>
      
      {/* Stage Info */}
      <div className="mt-6 p-4 rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800">
        <h4 className="font-semibold text-green-800 dark:text-green-200 mb-1">
          {gardenStages[gardenStage].title}
        </h4>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
          {gardenStages[gardenStage].description}
        </p>
        
        {/* Legend */}
        <div className="grid grid-cols-3 gap-2 text-xs">
          {gardenStage >= 0 && (
            <>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 dark:bg-green-600 rounded-sm"></div>
                <span>Grass</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-amber-700 dark:bg-amber-800 rounded-sm"></div>
                <span>Soil</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-stone-400 dark:bg-stone-600 rounded-sm"></div>
                <span>Path</span>
              </div>
            </>
          )}
          {gardenStage >= 1 && (
            <>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 dark:bg-red-600 rounded-sm"></div>
                <span>Flowers</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-600 dark:bg-green-700 rounded-sm"></div>
                <span>Bushes</span>
              </div>
            </>
          )}
          {gardenStage >= 2 && (
            <>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-700 dark:bg-green-800 rounded-sm"></div>
                <span>Trees</span>
              </div>
            </>
          )}
          {gardenStage >= 3 && (
            <>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-400 dark:bg-blue-500 rounded-sm"></div>
                <span>Water</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-gray-500 dark:bg-gray-600 rounded-sm"></div>
                <span>Rocks</span>
              </div>
            </>
          )}
        </div>
        
        {/* Progress milestones */}
        <div className="mt-3 flex justify-between items-center">
          <span className="text-xs text-gray-500 dark:text-gray-400">Garden Stages</span>
          <div className="flex gap-1">
            {[0, 1, 2, 3].map((stage) => (
              <div
                key={stage}
                className={`w-8 h-1 rounded-full transition-all ${
                  gardenStage >= stage
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