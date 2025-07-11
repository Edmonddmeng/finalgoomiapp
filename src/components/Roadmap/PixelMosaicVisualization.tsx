import { useState, useEffect, useMemo } from "react"

interface PixelMosaicVisualizationProps {
  progressLevel: number
}

interface Pixel {
  color: string
  revealed: boolean
  delay: number
}

export function PixelMosaicVisualization({ progressLevel }: PixelMosaicVisualizationProps) {
  const gridSize = 20 // 20x20 grid
  const totalPixels = gridSize * gridSize
  const revealedPixels = Math.floor((progressLevel / 100) * totalPixels)
  
  // Create a beautiful gradient mosaic pattern
  const createMosaicPattern = (): string[] => {
    const pattern: string[] = []
    const centerX = gridSize / 2
    const centerY = gridSize / 2
    
    for (let y = 0; y < gridSize; y++) {
      for (let x = 0; x < gridSize; x++) {
        // Calculate distance from center for radial gradient effect
        const distance = Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2))
        const normalizedDistance = distance / (gridSize / 2)
        
        // Create a beautiful color pattern
        const angle = Math.atan2(y - centerY, x - centerX)
        const hue = (angle + Math.PI) / (2 * Math.PI) * 360
        const saturation = 70 - normalizedDistance * 30
        const lightness = 50 + normalizedDistance * 20
        
        // Add some variation based on position
        const variation = Math.sin(x * 0.5) * Math.cos(y * 0.5) * 10
        
        pattern.push(`hsl(${(hue + variation + 360) % 360}, ${saturation}%, ${lightness}%)`)
      }
    }
    
    return pattern
  }
  
  // Alternative patterns
  const createSunsetPattern = (): string[] => {
    const pattern: string[] = []
    
    for (let y = 0; y < gridSize; y++) {
      for (let x = 0; x < gridSize; x++) {
        const yProgress = y / gridSize
        const xWave = Math.sin(x * 0.3) * 0.1
        
        // Sunset colors from top to bottom
        if (yProgress < 0.3) {
          // Sky blues to purples
          const hue = 200 + yProgress * 100 + xWave * 20
          pattern.push(`hsl(${hue}, 70%, ${50 + yProgress * 20}%)`)
        } else if (yProgress < 0.6) {
          // Oranges and pinks
          const hue = 10 + (yProgress - 0.3) * 100 + xWave * 30
          pattern.push(`hsl(${hue}, 80%, ${60 - yProgress * 10}%)`)
        } else {
          // Deep reds and purples
          const hue = 280 + (yProgress - 0.6) * 80 + xWave * 20
          pattern.push(`hsl(${hue}, 60%, ${40 - yProgress * 10}%)`)
        }
      }
    }
    
    return pattern
  }
  
  const createOceanPattern = (): string[] => {
    const pattern: string[] = []
    
    for (let y = 0; y < gridSize; y++) {
      for (let x = 0; x < gridSize; x++) {
        // Wave effect
        const wave = Math.sin(x * 0.3 + y * 0.1) * Math.cos(y * 0.2) * 20
        const depth = y / gridSize
        
        // Ocean colors with wave variation
        const hue = 180 + wave + depth * 40
        const saturation = 70 - depth * 20
        const lightness = 60 - depth * 30
        
        pattern.push(`hsl(${hue}, ${saturation}%, ${lightness}%)`)
      }
    }
    
    return pattern
  }
  
  const createAuroraPattern = (): string[] => {
    const pattern: string[] = []
    
    for (let y = 0; y < gridSize; y++) {
      for (let x = 0; x < gridSize; x++) {
        // Aurora wave effect
        const wave1 = Math.sin(x * 0.2) * Math.cos(y * 0.3) 
        const wave2 = Math.cos(x * 0.3) * Math.sin(y * 0.2)
        const combined = (wave1 + wave2) * 0.5
        
        // Aurora colors - greens, blues, purples
        const baseHue = 120 + combined * 120
        const hue = baseHue + Math.random() * 20
        const saturation = 70 + combined * 20
        const lightness = 30 + Math.abs(combined) * 40
        
        pattern.push(`hsl(${hue}, ${saturation}%, ${lightness}%)`)
      }
    }
    
    return pattern
  }
  
  // Select pattern based on some criteria or randomness
  const patterns = [createMosaicPattern, createSunsetPattern, createOceanPattern, createAuroraPattern]
  const selectedPattern = patterns[Math.floor(Date.now() / 100000) % patterns.length]
  const mosaicColors = useMemo(() => selectedPattern(), [selectedPattern])
  
  // Create reveal order - spiral from center outward
  const createRevealOrder = (): number[] => {
    const order: number[] = []
    const visited = new Set<number>()
    const centerX = Math.floor(gridSize / 2)
    const centerY = Math.floor(gridSize / 2)
    
    // Start from center
    const queue: [number, number][] = [[centerX, centerY]]
    
    while (queue.length > 0 && order.length < totalPixels) {
      const [x, y] = queue.shift()!
      const index = y * gridSize + x
      
      if (visited.has(index) || x < 0 || x >= gridSize || y < 0 || y >= gridSize) {
        continue
      }
      
      visited.add(index)
      order.push(index)
      
      // Add neighbors in a spiral pattern
      const neighbors: [number, number][] = [
        [x + 1, y], [x, y + 1], [x - 1, y], [x, y - 1],
        [x + 1, y + 1], [x - 1, y + 1], [x - 1, y - 1], [x + 1, y - 1]
      ]
      
      neighbors.forEach(([nx, ny]) => {
        const nIndex = ny * gridSize + nx
        if (!visited.has(nIndex)) {
          queue.push([nx, ny])
        }
      })
    }
    
    return order
  }
  
  const revealOrder = useMemo(() => createRevealOrder(), [])
  
  // Create pixel states
  const [pixels, setPixels] = useState<Pixel[]>(() => {
    return mosaicColors.map((color, index) => ({
      color,
      revealed: false,
      delay: 0
    }))
  })
  
  // Update pixels based on progress
  useEffect(() => {
    const newPixels = [...pixels]
    
    // Reset all pixels
    newPixels.forEach(pixel => {
      pixel.revealed = false
      pixel.delay = 0
    })
    
    // Reveal pixels based on progress
    for (let i = 0; i < revealedPixels && i < revealOrder.length; i++) {
      const pixelIndex = revealOrder[i]
      newPixels[pixelIndex].revealed = true
      newPixels[pixelIndex].delay = i * 0.5 // Stagger the reveal
    }
    
    setPixels(newPixels)
  }, [progressLevel, mosaicColors])
  
  const patternName = selectedPattern === createMosaicPattern ? "Radial Harmony" :
                     selectedPattern === createSunsetPattern ? "Sunset Dreams" :
                     selectedPattern === createOceanPattern ? "Ocean Depths" :
                     "Aurora Borealis"
  
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-slate-700">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Mosaic of Achievement</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Revealing "{patternName}" • {revealedPixels} of {totalPixels} pixels
          </p>
        </div>
        <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 font-medium">
          <div className="w-4 h-4 bg-gradient-to-br from-purple-500 to-pink-500 rounded"></div>
          <span>{progressLevel}% Complete</span>
        </div>
      </div>
      
      {/* Mosaic Grid */}
      <div className="relative bg-gray-100 dark:bg-gray-900 rounded-xl p-4">
        <div 
          className="grid gap-0.5 mx-auto"
          style={{
            gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
            maxWidth: '500px'
          }}
        >
          {pixels.map((pixel, index) => (
            <div
              key={index}
              className={`
                aspect-square rounded-sm transition-all duration-700 relative overflow-hidden
                ${pixel.revealed ? 'scale-100' : 'scale-0'}
              `}
              style={{
                backgroundColor: pixel.revealed ? pixel.color : 'transparent',
                transitionDelay: `${pixel.delay}ms`,
                boxShadow: pixel.revealed ? `0 0 10px ${pixel.color}40` : 'none'
              }}
            >
              {/* Shimmer effect on reveal */}
              {pixel.revealed && (
                <div 
                  className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/30 to-transparent animate-shimmer"
                  style={{
                    animationDelay: `${pixel.delay}ms`
                  }}
                />
              )}
            </div>
          ))}
        </div>
        
        {/* Progress overlay */}
        <div className="absolute top-4 right-4 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-lg px-3 py-1 text-sm font-mono">
          {progressLevel}%
        </div>
        
        {/* Center glow effect */}
        {progressLevel > 25 && (
          <div 
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
            style={{
              width: `${progressLevel}%`,
              height: `${progressLevel}%`,
              maxWidth: '200px',
              maxHeight: '200px',
              background: 'radial-gradient(circle, rgba(147,51,234,0.2) 0%, transparent 70%)',
              filter: 'blur(40px)'
            }}
          />
        )}
      </div>
      
      {/* Progress Info */}
      <div className="mt-6 grid grid-cols-4 gap-4">
        <div className={`text-center p-3 rounded-lg ${progressLevel >= 25 ? 'bg-purple-100 dark:bg-purple-900/30' : 'bg-gray-100 dark:bg-gray-800'}`}>
          <div className="text-2xl mb-1">🎨</div>
          <div className="text-xs font-medium">Foundation</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">25%</div>
        </div>
        <div className={`text-center p-3 rounded-lg ${progressLevel >= 50 ? 'bg-purple-100 dark:bg-purple-900/30' : 'bg-gray-100 dark:bg-gray-800'}`}>
          <div className="text-2xl mb-1">🖼️</div>
          <div className="text-xs font-medium">Taking Shape</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">50%</div>
        </div>
        <div className={`text-center p-3 rounded-lg ${progressLevel >= 75 ? 'bg-purple-100 dark:bg-purple-900/30' : 'bg-gray-100 dark:bg-gray-800'}`}>
          <div className="text-2xl mb-1">✨</div>
          <div className="text-xs font-medium">Nearly There</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">75%</div>
        </div>
        <div className={`text-center p-3 rounded-lg ${progressLevel >= 100 ? 'bg-purple-100 dark:bg-purple-900/30' : 'bg-gray-100 dark:bg-gray-800'}`}>
          <div className="text-2xl mb-1">🌟</div>
          <div className="text-xs font-medium">Masterpiece</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">100%</div>
        </div>
      </div>
    </div>
  )
}