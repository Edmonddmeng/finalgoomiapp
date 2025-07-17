import { Sun, Sparkles } from "lucide-react"
import { useMemo } from "react"

interface SolarSystemVisualizationProps {
  progressLevel: number
}

interface Planet {
  name: string
  color: string
  size: number
  distance: number
  unlocked: boolean
  description: string
  moons?: string[]
}

export function SolarSystemVisualization({ progressLevel }: SolarSystemVisualizationProps) {
  const canvasWidth = 700
  const canvasHeight = 400
  
  // All planets in correct order from the Sun - with FULL WIDTH distribution
  const planets: Planet[] = [
    {
      name: "Mercury",
      color: "#8C7853",
      size: 8,
      distance: 100, // Closer to sun
      unlocked: progressLevel >= 10,
      description: "The swift messenger - your first steps"
    },
    {
      name: "Venus",
      color: "#FFC649",
      size: 12,
      distance: 150,
      unlocked: progressLevel >= 20,
      description: "The bright morning star - building momentum"
    },
    {
      name: "Earth",
      color: "#6B93D6",
      size: 14,
      distance: 200,
      unlocked: progressLevel >= 30,
      description: "Your home base - establishing foundations",
      moons: ["Moon"]
    },
    {
      name: "Mars",
      color: "#CD5C5C",
      size: 11,
      distance: 250,
      unlocked: progressLevel >= 40,
      description: "The red planet - conquering challenges"
    },
    {
      name: "Jupiter",
      color: "#D8CA9D",
      size: 28,
      distance: 320,
      unlocked: progressLevel >= 50,
      description: "The giant - massive achievements",
      moons: ["Io", "Europa", "Ganymede", "Callisto"]
    },
    {
      name: "Saturn",
      color: "#FAD5A5",
      size: 24,
      distance: 400,
      unlocked: progressLevel >= 60,
      description: "The ringed beauty - structured success"
    },
    {
      name: "Uranus",
      color: "#4FD0E3",
      size: 18,
      distance: 480,
      unlocked: progressLevel >= 75,
      description: "The ice giant - cool innovation"
    },
    {
      name: "Neptune",
      color: "#4B70DD",
      size: 17,
      distance: 560,
      unlocked: progressLevel >= 90,
      description: "The deep blue - profound mastery"
    }
  ]
  
  // Calculate active planets
  const activePlanets = planets.filter(planet => planet.unlocked)
  const totalPlanets = planets.length
  
  // Get current achievement level
  const getAchievementLevel = () => {
    if (progressLevel < 10) return { title: "Earth Observer", description: "Beginning your cosmic journey" }
    if (progressLevel < 30) return { title: "Inner System Explorer", description: "Discovering the inner planets" }
    if (progressLevel < 50) return { title: "Red Planet Conqueror", description: "Mastering the terrestrial worlds" }
    if (progressLevel < 75) return { title: "Gas Giant Navigator", description: "Exploring the outer system" }
    if (progressLevel < 90) return { title: "Ice World Pioneer", description: "Venturing into the frozen realm" }
    return { title: "Solar System Master", description: "Complete mastery of all celestial bodies" }
  }
  
  const currentLevel = getAchievementLevel()
  
  // Generate asteroid belt
  const asteroids = useMemo(() => {
    const asteroidBelt = []
    const beltDistance = 240
    const beltWidth = 40
    
    for (let i = 0; i < 50; i++) {
      const angle = (i / 50) * 2 * Math.PI
      const distance = beltDistance + (Math.random() - 0.5) * beltWidth
      const x = canvasWidth / 2 + Math.cos(angle) * distance
      const y = canvasHeight / 2 + Math.sin(angle) * distance * 0.3
      
      if (x > 0 && x < canvasWidth && y > 0 && y < canvasHeight - 60) {
        asteroidBelt.push({
          id: i,
          x, y,
          size: Math.random() * 2 + 1,
          opacity: 0.3 + Math.random() * 0.4,
          rotation: Math.random() * 360
        })
      }
    }
    return asteroidBelt
  }, [])
  
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-slate-700">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Your Solar System Journey</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {activePlanets.length} of {totalPlanets} planets discovered
          </p>
        </div>
        <div className="flex items-center gap-2 text-orange-600 dark:text-orange-400 font-medium">
          <Sun className="fill-current" size={18} />
          <span>{progressLevel}% Complete</span>
        </div>
      </div>
      
      {/* Solar System Canvas */}
      <div className="relative rounded-xl overflow-hidden">
        <div 
          className="relative w-full"
          style={{ 
            background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 30%, #16213e 60%, #0f0f23 100%)',
            height: `${canvasHeight}px`
          }}
        >
          {/* Background stars - evenly distributed */}
          {Array.from({ length: 300 }).map((_, i) => {
            const x = Math.random() * (canvasWidth - 10) + 5
            const y = Math.random() * (canvasHeight - 60)
            
            return (
              <div
                key={`star-${i}`}
                className="absolute rounded-full bg-white animate-pulse"
                style={{
                  left: x,
                  top: y,
                  width: Math.random() * 2 + 1,
                  height: Math.random() * 2 + 1,
                  opacity: Math.random() * 0.8 + 0.2,
                  animationDelay: `${Math.random() * 5}s`,
                  animationDuration: `${3 + Math.random() * 4}s`
                }}
              />
            )
          })}
          
          {/* Flying comets */}
          {Array.from({ length: 3 }).map((_, i) => {
            const cometSpeed = 8000 + i * 2000
            const cometY = 80 + i * 100
            
            return (
              <div
                key={`comet-${i}`}
                className="absolute"
                style={{
                  top: cometY,
                  animation: `comet-fly-${i} ${cometSpeed}ms linear infinite`,
                  animationDelay: `${i * 3000}ms`
                }}
              >
                {/* Comet tail */}
                <div 
                  className="absolute h-1 bg-gradient-to-l from-blue-300 via-white to-transparent opacity-80"
                  style={{
                    width: '40px',
                    right: '8px',
                    top: '50%',
                    transform: 'translateY(-50%)'
                  }}
                />
                
                {/* Comet body */}
                <div className="w-2 h-2 bg-white rounded-full shadow-lg animate-pulse" />
              </div>
            )
          })}
          
          {/* The Sun - positioned at far left */}
          <div className="absolute top-1/2 left-4 -translate-y-1/2">
            <div className="relative">
              {/* Sun glow */}
              <div 
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full animate-pulse"
                style={{
                  width: '50px',
                  height: '50px',
                  background: 'radial-gradient(circle, rgba(255,165,0,0.4) 0%, rgba(255,69,0,0.2) 70%, transparent 100%)',
                  filter: 'blur(8px)'
                }}
              />
              
              {/* Sun body */}
              <div 
                className="relative w-10 h-10 rounded-full animate-pulse"
                style={{
                  background: 'radial-gradient(circle, #FFD700 0%, #FFA500 50%, #FF6347 100%)',
                  boxShadow: '0 0 25px rgba(255,165,0,0.8), inset 0 0 8px rgba(255,69,0,0.5)'
                }}
              >
                {/* Sun surface details */}
                <div className="absolute top-1 left-1 w-1.5 h-1.5 bg-orange-600 rounded-full opacity-60"></div>
                <div className="absolute top-6 left-6 w-1 h-1 bg-red-600 rounded-full opacity-80"></div>
                <div className="absolute top-7 left-2 w-1 h-1 bg-yellow-600 rounded-full opacity-70"></div>
              </div>
              
              {/* Sun rays */}
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="absolute top-1/2 left-1/2 w-12 h-0.5 bg-gradient-to-r from-yellow-400 via-orange-400 to-transparent opacity-60 animate-pulse"
                  style={{
                    transform: `translate(-50%, -50%) rotate(${i * 45}deg)`,
                    transformOrigin: 'left center',
                    animationDelay: `${i * 0.2}s`
                  }}
                />
              ))}
            </div>
          </div>
          
          {/* Orbital paths */}
          {planets.map((planet, index) => (
            <div
              key={`orbit-${planet.name}`}
              className="absolute top-1/2 left-8 -translate-y-1/2"
              style={{ zIndex: 1 }}
            >
              <div
                className="border border-gray-600 dark:border-gray-500 rounded-full opacity-30"
                style={{
                  width: planet.distance * 2,
                  height: planet.distance * 2 * 0.6,
                  borderRadius: '50%',
                  transform: 'translateX(-50%) translateY(-50%)'
                }}
              />
            </div>
          ))}
          
          {/* Asteroid Belt */}
          {progressLevel >= 45 && (
            <>
              {asteroids.map((asteroid) => (
                <div
                  key={asteroid.id}
                  className="absolute rounded-full bg-gray-500 animate-pulse"
                  style={{
                    left: asteroid.x,
                    top: asteroid.y,
                    width: asteroid.size,
                    height: asteroid.size,
                    opacity: asteroid.opacity,
                    transform: `rotate(${asteroid.rotation}deg)`
                  }}
                />
              ))}
            </>
          )}
          
          {/* Planets - spread across FULL WIDTH */}
          {planets.map((planet, index) => {
            // Calculate position across the ENTIRE width of the canvas
            const totalWidth = canvasWidth - 80 // Leave margins
            const planetX = 60 + (index / (planets.length - 1)) * totalWidth
            const planetY = canvasHeight / 2 + Math.sin(Date.now() / (3000 + index * 200)) * 30
            
            return (
              <div
                key={planet.name}
                className={`absolute transition-all duration-1000 ${
                  planet.unlocked ? 'scale-100 opacity-100' : 'scale-50 opacity-30'
                }`}
                style={{
                  left: planetX - planet.size / 2,
                  top: planetY - planet.size / 2,
                  zIndex: 10
                }}
              >
                {/* Planet glow */}
                {planet.unlocked && (
                  <div
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full animate-pulse"
                    style={{
                      width: planet.size * 2,
                      height: planet.size * 2,
                      background: `radial-gradient(circle, ${planet.color}30 0%, transparent 70%)`,
                      filter: 'blur(3px)'
                    }}
                  />
                )}
                
                {/* Planet body */}
                <div
                  className="relative rounded-full transition-all duration-500"
                  style={{
                    width: planet.size,
                    height: planet.size,
                    background: planet.unlocked 
                      ? `radial-gradient(circle at 30% 30%, ${planet.color}FF 0%, ${planet.color}CC 60%, ${planet.color}99 100%)`
                      : '#4a5568',
                    boxShadow: planet.unlocked 
                      ? `0 0 ${planet.size}px ${planet.color}40, inset -2px -2px ${planet.size/2}px rgba(0,0,0,0.3)`
                      : '0 0 5px rgba(0,0,0,0.5)',
                    filter: planet.unlocked ? 'none' : 'grayscale(100%)'
                  }}
                >
                  {/* Planet surface details */}
                  {planet.unlocked && (
                    <>
                      <div 
                        className="absolute top-1/4 left-1/4 rounded-full opacity-60"
                        style={{
                          width: planet.size * 0.2,
                          height: planet.size * 0.2,
                          backgroundColor: `${planet.color}80`
                        }}
                      />
                      <div 
                        className="absolute top-3/4 left-3/4 rounded-full opacity-40"
                        style={{
                          width: planet.size * 0.15,
                          height: planet.size * 0.15,
                          backgroundColor: `${planet.color}60`
                        }}
                      />
                    </>
                  )}
                  
                  {/* Saturn's rings */}
                  {planet.name === "Saturn" && planet.unlocked && (
                    <>
                      <div 
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border-2 rounded-full opacity-80"
                        style={{
                          width: planet.size * 1.8,
                          height: planet.size * 1.8,
                          borderColor: `${planet.color}AA`,
                          borderTopColor: 'transparent',
                          borderBottomColor: 'transparent'
                        }}
                      />
                      <div 
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border rounded-full opacity-60"
                        style={{
                          width: planet.size * 1.5,
                          height: planet.size * 1.5,
                          borderColor: `${planet.color}66`,
                          borderTopColor: 'transparent',
                          borderBottomColor: 'transparent'
                        }}
                      />
                    </>
                  )}
                  
                  {/* Earth's moon */}
                  {planet.name === "Earth" && planet.unlocked && (
                    <div
                      className="absolute w-2 h-2 bg-gray-300 rounded-full"
                      style={{
                        left: planet.size + 6,
                        top: planet.size / 2 - 4,
                        boxShadow: '0 0 3px rgba(200,200,200,0.5)'
                      }}
                    />
                  )}
                </div>
                
                {/* Planet label */}
                {planet.unlocked && (
                  <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs text-white font-medium whitespace-nowrap">
                    {planet.name}
                  </div>
                )}
              </div>
            )
          })}
          
          {/* Remove the misplaced spacecraft - it was creating the blue dot */}
          
          {/* Progress bar */}
          <div className="absolute bottom-4 left-4 right-4 bg-black/30 backdrop-blur-sm rounded-full p-2">
            <div className="h-4 bg-gray-700 rounded-full overflow-hidden border border-gray-600">
              <div
                className="h-full bg-gradient-to-r from-orange-500 via-yellow-500 to-blue-500 rounded-full transition-all duration-1000"
                style={{ width: `${progressLevel}%` }}
              />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-xs font-bold text-white">
                {progressLevel}%
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Planet status grid */}
      <div className="mt-6 grid grid-cols-4 gap-3">
        {planets.map((planet, index) => (
          <div
            key={planet.name}
            className={`text-center p-3 rounded-lg border transition-all ${
              planet.unlocked
                ? 'bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600'
                : 'bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-600 opacity-50'
            }`}
          >
            <div
              className="w-6 h-6 rounded-full mx-auto mb-2 transition-all border-2"
              style={{
                backgroundColor: planet.unlocked ? planet.color : '#6b7280',
                borderColor: planet.unlocked ? `${planet.color}AA` : '#9ca3af',
                boxShadow: planet.unlocked ? `0 0 10px ${planet.color}40` : 'none'
              }}
            />
            <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {planet.name}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {planet.unlocked ? 'Discovered' : `${Math.max(10, (index + 1) * 10)}% required`}
            </div>
          </div>
        ))}
      </div>
      
      {/* Achievement level */}
      <div className="mt-4 p-4 rounded-lg bg-gradient-to-r from-orange-50 to-blue-50 dark:from-orange-900/20 dark:to-blue-900/20 border border-orange-200 dark:border-orange-800">
        <h4 className="font-semibold text-orange-800 dark:text-orange-200 mb-1">
          {currentLevel.title}
        </h4>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {currentLevel.description}
        </p>
        
        {/* Progress milestones */}
        <div className="mt-3 flex justify-between items-center">
          <span className="text-xs text-gray-500 dark:text-gray-400">Solar System Progress</span>
          <div className="flex gap-1">
            {[10, 30, 50, 75, 90].map((milestone) => (
              <div
                key={milestone}
                className={`w-8 h-2 rounded-full transition-all duration-500 ${
                  progressLevel >= milestone
                    ? 'bg-gradient-to-r from-orange-400 to-blue-400 shadow-sm'
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