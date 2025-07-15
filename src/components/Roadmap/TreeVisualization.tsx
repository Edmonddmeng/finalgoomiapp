// import { Sprout, TreePine, Trees, TreeDeciduous, Cloud, Sun, Bird, Flower } from "lucide-react"

// interface TreeVisualizationProps {
//   progressLevel: number
// }

// export function TreeVisualization({ progressLevel }: TreeVisualizationProps) {
//   // Calculate forest density based on progress
//   const treeDensity = Math.floor(progressLevel / 10) // 0-10 trees
//   const undergrowthDensity = Math.floor(progressLevel / 15) // 0-6 plants
//   const wildlifeDensity = Math.floor(progressLevel / 25) // 0-4 animals/birds
  
//   // Determine forest stage
//   const getForestStage = () => {
//     if (progressLevel < 25) return 0 // Barren land with seeds
//     if (progressLevel < 50) return 1 // Young forest
//     if (progressLevel < 75) return 2 // Growing forest
//     return 3 // Lush forest
//   }

//   const forestStage = getForestStage()

//   const forestStages = [
//     {
//       title: "Seeds of Growth",
//       description: "The journey begins with small seeds of potential",
//       skyGradient: "from-gray-100 via-blue-100 to-blue-200 dark:from-gray-900/20 dark:via-blue-900/20 dark:to-blue-900/30",
//       groundColor: "from-amber-200/30 to-amber-300/20 dark:from-amber-900/30 dark:to-amber-800/20",
//       sunOpacity: 30
//     },
//     {
//       title: "Young Forest",
//       description: "New growth emerges as your efforts take root",
//       skyGradient: "from-blue-100 via-blue-200 to-sky-200 dark:from-blue-900/30 dark:via-blue-900/40 dark:to-sky-900/40",
//       groundColor: "from-green-300/40 to-amber-300/30 dark:from-green-900/40 dark:to-amber-800/30",
//       sunOpacity: 50
//     },
//     {
//       title: "Thriving Ecosystem",
//       description: "Your forest grows stronger with diverse achievements",
//       skyGradient: "from-sky-200 via-blue-300 to-cyan-200 dark:from-sky-900/40 dark:via-blue-900/50 dark:to-cyan-900/40",
//       groundColor: "from-green-400/50 to-green-300/40 dark:from-green-800/50 dark:to-green-900/40",
//       sunOpacity: 70
//     },
//     {
//       title: "Lush Paradise",
//       description: "A magnificent forest flourishing with your accomplishments",
//       skyGradient: "from-cyan-200 via-sky-300 to-blue-400 dark:from-cyan-900/50 dark:via-sky-900/60 dark:to-blue-900/50",
//       groundColor: "from-green-500/60 to-green-400/50 dark:from-green-700/60 dark:to-green-800/50",
//       sunOpacity: 90
//     }
//   ]

//   const currentStage = forestStages[forestStage]

//   return (
//     <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-slate-700">
//       <div className="flex items-center justify-between mb-6">
//         <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Your Forest of Achievements</h3>
//         <div className="flex items-center gap-2 text-green-600 dark:text-green-400 font-medium">
//           <Trees size={20} />
//           <span>{progressLevel}% Complete</span>
//         </div>
//       </div>

//       {/* Forest visualization area */}
//       <div className={`relative h-64 bg-gradient-to-t ${currentStage.skyGradient} rounded-xl overflow-hidden`}>
//         {/* Sun */}
//         {forestStage > 0 && (
//           <div className={`absolute top-4 right-8 transition-all duration-1000`} style={{ opacity: `${currentStage.sunOpacity}%` }}>
//             <Sun size={32} className="text-yellow-400 dark:text-yellow-300" />
//           </div>
//         )}
        
//         {/* Clouds */}
//         {forestStage >= 2 && (
//           <>
//             <Cloud size={24} className="absolute top-8 left-12 text-white/40 animate-[float_20s_ease-in-out_infinite]" />
//             <Cloud size={20} className="absolute top-12 right-24 text-white/30 animate-[float_25s_ease-in-out_infinite_reverse]" />
//           </>
//         )}
        
//         {/* Birds */}
//         {wildlifeDensity > 0 && (
//           <>
//             {Array.from({ length: Math.min(wildlifeDensity, 3) }).map((_, i) => (
//               <Bird 
//                 key={i} 
//                 size={16} 
//                 className={`absolute text-gray-700 dark:text-gray-300 animate-[fly_${15 + i * 5}s_ease-in-out_infinite]`}
//                 style={{
//                   top: `${20 + i * 15}px`,
//                   left: `${20 + i * 30}%`,
//                   animationDelay: `${i * 2}s`
//                 }}
//               />
//             ))}
//           </>
//         )}
        
//         {/* Ground */}
//         <div className={`absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t ${currentStage.groundColor}`}></div>
        
//         {/* Background trees (far layer) */}
//         <div className="absolute bottom-12 left-0 w-full flex justify-around opacity-30">
//           {Array.from({ length: Math.min(treeDensity, 5) }).map((_, i) => (
//             <TreePine 
//               key={`bg-${i}`} 
//               size={24 + i * 2} 
//               className="text-green-700 dark:text-green-600"
//             />
//           ))}
//         </div>
        
//         {/* Middle layer trees */}
//         <div className="absolute bottom-10 left-0 w-full flex justify-around opacity-60">
//           {Array.from({ length: Math.max(0, treeDensity - 3) }).map((_, i) => (
//             <Trees 
//               key={`mid-${i}`} 
//               size={32 + i * 3} 
//               className="text-green-600 dark:text-green-500"
//             />
//           ))}
//         </div>
        
//         {/* Foreground trees */}
//         <div className="absolute bottom-8 left-0 w-full flex justify-around">
//           {Array.from({ length: Math.min(treeDensity, 4) }).map((_, i) => {
//             const TreeType = i % 2 === 0 ? TreeDeciduous : TreePine
//             return (
//               <TreeType 
//                 key={`front-${i}`} 
//                 size={40 + i * 4} 
//                 className="text-green-500 dark:text-green-400 drop-shadow-lg"
//               />
//             )
//           })}
//         </div>
        
//         {/* Undergrowth and flowers */}
//         {undergrowthDensity > 0 && (
//           <div className="absolute bottom-0 left-0 w-full flex justify-around">
//             {Array.from({ length: undergrowthDensity }).map((_, i) => (
//               <div key={`plant-${i}`} className="relative">
//                 {i % 2 === 0 ? (
//                   <Flower size={16} className="text-pink-400 dark:text-pink-300" />
//                 ) : (
//                   <Sprout size={18} className="text-green-400 dark:text-green-300" />
//                 )}
//               </div>
//             ))}
//           </div>
//         )}
        
//         {/* Progress bar at bottom */}
//         <div className="absolute bottom-2 left-4 right-4 h-1.5 bg-white/40 dark:bg-slate-700/40 rounded-full backdrop-blur-sm">
//           <div
//             className="h-full bg-gradient-to-r from-green-500 to-emerald-600 rounded-full transition-all duration-500"
//             style={{ width: `${progressLevel}%` }}
//           />
//         </div>
//       </div>

//       {/* Stage information */}
//       <div className="mt-4 p-4 rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800">
//         <h4 className="font-semibold text-green-800 dark:text-green-200 mb-1">{currentStage.title}</h4>
//         <p className="text-sm text-gray-600 dark:text-gray-400">{currentStage.description}</p>
        
//         {/* Forest statistics */}
//         <div className="mt-3 grid grid-cols-3 gap-3 text-center">
//           <div className="bg-white/50 dark:bg-slate-800/50 rounded-lg p-2">
//             <div className="text-xl font-bold text-green-600">{treeDensity}</div>
//             <div className="text-xs text-gray-600 dark:text-gray-400">Trees</div>
//           </div>
//           <div className="bg-white/50 dark:bg-slate-800/50 rounded-lg p-2">
//             <div className="text-xl font-bold text-pink-600">{undergrowthDensity}</div>
//             <div className="text-xs text-gray-600 dark:text-gray-400">Plants</div>
//           </div>
//           <div className="bg-white/50 dark:bg-slate-800/50 rounded-lg p-2">
//             <div className="text-xl font-bold text-blue-600">{wildlifeDensity}</div>
//             <div className="text-xs text-gray-600 dark:text-gray-400">Wildlife</div>
//           </div>
//         </div>
        
//         {/* Progress milestones */}
//         <div className="mt-3 flex justify-between items-center">
//           <span className="text-xs text-gray-500 dark:text-gray-400">Growth Progress</span>
//           <div className="flex gap-1">
//             {[0, 25, 50, 75].map((milestone) => (
//               <div
//                 key={milestone}
//                 className={`w-8 h-1 rounded-full transition-all ${
//                   progressLevel > milestone
//                     ? 'bg-green-500'
//                     : 'bg-gray-300 dark:bg-gray-600'
//                 }`}
//               />
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }


import { TrendingUp, Sun, Cloud } from "lucide-react"

interface TreeVisualizationProps {
  progressLevel: number
}

export function TreeVisualization({ progressLevel }: TreeVisualizationProps) {
  // Calculate forest density based on progress
  const treeDensity = Math.floor(progressLevel / 5) // 0-20 trees for fuller forest
  const undergrowthDensity = Math.floor(progressLevel / 8) // 0-12 bushes
  const wildlifeDensity = Math.floor(progressLevel / 20) // 0-5 animals
  
  // Determine forest stage
  const getForestStage = () => {
    if (progressLevel < 25) return 0 // Barren land with saplings
    if (progressLevel < 50) return 1 // Young forest
    if (progressLevel < 75) return 2 // Growing forest
    return 3 // Lush forest
  }

  const forestStage = getForestStage()

  const forestStages = [
    {
      title: "Saplings & Seeds",
      description: "Young trees begin to take root in the soil",
      skyGradient: "from-gray-200 via-blue-100 to-blue-200 dark:from-gray-800 dark:via-blue-900/30 dark:to-blue-900/40",
      groundColor: "from-amber-600 via-amber-500 to-yellow-600 dark:from-amber-900 dark:via-amber-800 dark:to-yellow-900",
      sunOpacity: 40
    },
    {
      title: "Young Forest",
      description: "Trees grow taller as your efforts flourish",
      skyGradient: "from-blue-200 via-sky-200 to-cyan-200 dark:from-blue-900/40 dark:via-sky-900/40 dark:to-cyan-900/40",
      groundColor: "from-green-600 via-green-500 to-emerald-600 dark:from-green-900 dark:via-green-800 dark:to-emerald-900",
      sunOpacity: 60
    },
    {
      title: "Thriving Forest",
      description: "A diverse ecosystem with wildlife and undergrowth",
      skyGradient: "from-sky-300 via-blue-300 to-cyan-300 dark:from-sky-900/50 dark:via-blue-900/50 dark:to-cyan-900/50",
      groundColor: "from-green-500 via-emerald-500 to-green-400 dark:from-green-800 dark:via-emerald-800 dark:to-green-700",
      sunOpacity: 80
    },
    {
      title: "Ancient Forest",
      description: "A magnificent old-growth forest teeming with life",
      skyGradient: "from-cyan-300 via-sky-400 to-blue-400 dark:from-cyan-900/60 dark:via-sky-900/60 dark:to-blue-900/60",
      groundColor: "from-green-400 via-emerald-400 to-lime-500 dark:from-green-700 dark:via-emerald-700 dark:to-lime-800",
      sunOpacity: 100
    }
  ]

  const currentStage = forestStages[forestStage]

  // Generate random tree data for consistent positioning
  const generateTrees = () => {
    const trees = []
    const positions: number[] = []
    
    // Generate non-overlapping positions
    for (let i = 0; i < Math.min(treeDensity, 15); i++) {
      let position: number, attempts = 0
      do {
        position = Math.random() * 90 + 5 // 5% to 95% to avoid edges
        attempts++
      } while (attempts < 10 && positions.some(p => Math.abs(p - position) < 8))
      
      positions.push(position)
      
      trees.push({
        id: i,
        position: position,
        height: 60 + Math.random() * 80, // 60-140px height
        width: 40 + Math.random() * 60, // 40-100px width
        type: Math.random() > 0.5 ? 'pine' : 'deciduous',
        layer: Math.random() > 0.7 ? 'back' : Math.random() > 0.4 ? 'middle' : 'front',
        foliageColor: forestStage >= 2 ? 
          ['#22c55e', '#16a34a', '#15803d', '#166534'][Math.floor(Math.random() * 4)] :
          ['#16a34a', '#15803d'][Math.floor(Math.random() * 2)],
        trunkColor: ['#92400e', '#a16207', '#ca8a04'][Math.floor(Math.random() * 3)]
      })
    }
    
    return trees.sort((a, b) => 
      a.layer === 'back' ? -1 : 
      a.layer === 'front' ? 1 : 
      b.layer === 'back' ? 1 : 
      b.layer === 'front' ? -1 : 0
    )
  }

  const trees = generateTrees()

  // Generate bushes
  const generateBushes = () => {
    const bushes = []
    for (let i = 0; i < undergrowthDensity; i++) {
      bushes.push({
        id: i,
        position: Math.random() * 85 + 7.5,
        size: 15 + Math.random() * 25,
        color: ['#16a34a', '#15803d', '#22c55e'][Math.floor(Math.random() * 3)]
      })
    }
    return bushes
  }

  const bushes = generateBushes()

  // Generate wildlife
  const generateWildlife = () => {
    const animals = []
    const animalTypes = ['🦌', '🐿️', '🦉', '🦅', '🐰']
    
    for (let i = 0; i < wildlifeDensity; i++) {
      animals.push({
        id: i,
        position: Math.random() * 80 + 10,
        type: animalTypes[Math.floor(Math.random() * animalTypes.length)],
        yPosition: Math.random() * 60 + 20
      })
    }
    return animals
  }

  const wildlife = generateWildlife()

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-slate-700">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Your Forest of Achievements</h3>
        <div className="flex items-center gap-2 text-green-600 dark:text-green-400 font-medium">
          <div className="w-4 h-4 bg-green-500 rounded-full"></div>
          <span>{progressLevel}% Complete</span>
        </div>
      </div>

      {/* Forest visualization area */}
      <div className={`relative h-80 bg-gradient-to-b ${currentStage.skyGradient} rounded-xl overflow-hidden`}>
        {/* Sun */}
        <div 
          className="absolute top-6 right-12 transition-all duration-1000" 
          style={{ opacity: `${currentStage.sunOpacity}%` }}
        >
          <div className="w-12 h-12 bg-yellow-400 rounded-full shadow-lg animate-pulse">
            <div className="absolute inset-2 bg-yellow-300 rounded-full"></div>
          </div>
        </div>
        
        {/* Clouds */}
        {forestStage >= 2 && (
          <>
            <div className="absolute top-8 left-16 w-16 h-8 bg-white/60 dark:bg-white/40 rounded-full animate-[float_25s_ease-in-out_infinite]">
              <div className="absolute top-2 left-2 w-8 h-4 bg-white/80 dark:bg-white/60 rounded-full"></div>
              <div className="absolute top-1 right-2 w-6 h-5 bg-white/70 dark:bg-white/50 rounded-full"></div>
            </div>
            <div className="absolute top-12 right-32 w-12 h-6 bg-white/50 dark:bg-white/30 rounded-full animate-[float_20s_ease-in-out_infinite_reverse]">
              <div className="absolute top-1 left-1 w-6 h-4 bg-white/70 dark:bg-white/50 rounded-full"></div>
            </div>
          </>
        )}
        
        {/* Mountains in background */}
        <div className="absolute bottom-40 left-0 w-full h-32 opacity-20">
          <div className="absolute bottom-0 left-0 w-40 h-24 bg-gray-600 dark:bg-gray-700" 
               style={{ clipPath: 'polygon(0% 100%, 30% 20%, 70% 30%, 100% 100%)' }}></div>
          <div className="absolute bottom-0 right-0 w-48 h-28 bg-gray-500 dark:bg-gray-600" 
               style={{ clipPath: 'polygon(0% 100%, 40% 10%, 80% 35%, 100% 100%)' }}></div>
        </div>
        
        {/* Ground layers */}
        <div className={`absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t ${currentStage.groundColor}`}></div>
        <div className="absolute bottom-0 left-0 w-full h-8 bg-amber-800 dark:bg-amber-900 opacity-80"></div>
        
        {/* Forest floor details */}
        <div className="absolute bottom-2 left-0 w-full h-6">
          {/* Scattered leaves and debris */}
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-orange-600 dark:bg-orange-700 rounded-full opacity-60"
              style={{
                left: `${Math.random() * 100}%`,
                bottom: `${Math.random() * 20}px`,
                transform: `rotate(${Math.random() * 360}deg)`
              }}
            ></div>
          ))}
          
          {/* Fallen logs */}
          {forestStage >= 2 && (
            <>
              <div className="absolute bottom-2 left-20 w-16 h-2 bg-amber-700 dark:bg-amber-800 rounded-full opacity-70"></div>
              <div className="absolute bottom-4 right-24 w-12 h-1.5 bg-amber-600 dark:bg-amber-700 rounded-full opacity-60"></div>
            </>
          )}
        </div>
        
        {/* Trees - rendered in layers */}
        {trees.map((tree, index) => (
          <div
            key={tree.id}
            className={`absolute transition-all duration-500 ${
              tree.layer === 'back' ? 'opacity-40' : 
              tree.layer === 'middle' ? 'opacity-70' : 
              'opacity-100'
            }`}
            style={{
              left: `${tree.position}%`,
              bottom: tree.layer === 'back' ? '40px' : tree.layer === 'middle' ? '25px' : '8px',
              zIndex: tree.layer === 'back' ? 1 : tree.layer === 'middle' ? 2 : 3
            }}
          >
            {tree.type === 'pine' ? (
              // Pine tree
              <div className="relative">
                {/* Trunk */}
                <div 
                  className="absolute bottom-0 left-1/2 -translate-x-1/2 bg-amber-800 dark:bg-amber-900"
                  style={{ 
                    width: `${tree.width * 0.15}px`, 
                    height: `${tree.height * 0.3}px`,
                    backgroundColor: tree.trunkColor
                  }}
                ></div>
                
                {/* Pine layers */}
                <div className="relative">
                  {/* Bottom layer */}
                  <div 
                    className="absolute bottom-0 left-1/2 -translate-x-1/2"
                    style={{ 
                      width: `${tree.width}px`, 
                      height: `${tree.height * 0.4}px`,
                      backgroundColor: tree.foliageColor,
                      clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)'
                    }}
                  ></div>
                  
                  {/* Middle layer */}
                  <div 
                    className="absolute left-1/2 -translate-x-1/2"
                    style={{ 
                      bottom: `${tree.height * 0.25}px`,
                      width: `${tree.width * 0.8}px`, 
                      height: `${tree.height * 0.35}px`,
                      backgroundColor: tree.foliageColor,
                      clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)'
                    }}
                  ></div>
                  
                  {/* Top layer */}
                  <div 
                    className="absolute left-1/2 -translate-x-1/2"
                    style={{ 
                      bottom: `${tree.height * 0.45}px`,
                      width: `${tree.width * 0.6}px`, 
                      height: `${tree.height * 0.3}px`,
                      backgroundColor: tree.foliageColor,
                      clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)'
                    }}
                  ></div>
                </div>
              </div>
            ) : (
              // Deciduous tree
              <div className="relative">
                {/* Trunk */}
                <div 
                  className="absolute bottom-0 left-1/2 -translate-x-1/2"
                  style={{ 
                    width: `${tree.width * 0.12}px`, 
                    height: `${tree.height * 0.4}px`,
                    backgroundColor: tree.trunkColor
                  }}
                ></div>
                
                {/* Canopy */}
                <div 
                  className="absolute bottom-0 left-1/2 -translate-x-1/2 rounded-full"
                  style={{ 
                    width: `${tree.width}px`, 
                    height: `${tree.height * 0.7}px`,
                    backgroundColor: tree.foliageColor,
                    bottom: `${tree.height * 0.15}px`
                  }}
                ></div>
                
                {/* Additional foliage clusters */}
                <div 
                  className="absolute left-1/2 -translate-x-1/2 rounded-full opacity-90"
                  style={{ 
                    width: `${tree.width * 0.7}px`, 
                    height: `${tree.height * 0.5}px`,
                    backgroundColor: tree.foliageColor,
                    bottom: `${tree.height * 0.3}px`,
                    left: `${tree.width * 0.2}px`
                  }}
                ></div>
                
                <div 
                  className="absolute left-1/2 -translate-x-1/2 rounded-full opacity-80"
                  style={{ 
                    width: `${tree.width * 0.6}px`, 
                    height: `${tree.height * 0.4}px`,
                    backgroundColor: tree.foliageColor,
                    bottom: `${tree.height * 0.4}px`,
                    right: `${tree.width * 0.2}px`
                  }}
                ></div>
              </div>
            )}
          </div>
        ))}
        
        {/* Bushes and undergrowth */}
        {bushes.map((bush) => (
          <div
            key={bush.id}
            className="absolute bottom-8 rounded-full opacity-80"
            style={{
              left: `${bush.position}%`,
              width: `${bush.size}px`,
              height: `${bush.size * 0.6}px`,
              backgroundColor: bush.color
            }}
          >
            {/* Bush texture */}
            <div 
              className="absolute top-1 left-1 rounded-full opacity-70"
              style={{
                width: `${bush.size * 0.5}px`,
                height: `${bush.size * 0.3}px`,
                backgroundColor: bush.color
              }}
            ></div>
            <div 
              className="absolute top-2 right-1 rounded-full opacity-60"
              style={{
                width: `${bush.size * 0.4}px`,
                height: `${bush.size * 0.25}px`,
                backgroundColor: bush.color
              }}
            ></div>
          </div>
        ))}
        
        {/* Wildlife */}
        {wildlife.map((animal) => (
          <div
            key={animal.id}
            className="absolute text-lg animate-pulse"
            style={{
              left: `${animal.position}%`,
              bottom: `${animal.yPosition}px`
            }}
          >
            {animal.type}
          </div>
        ))}
        
        {/* Progress bar */}
        <div className="absolute bottom-2 left-4 right-4 h-2 bg-white/30 dark:bg-slate-700/30 rounded-full backdrop-blur-sm">
          <div
            className="h-full bg-gradient-to-r from-green-500 via-emerald-500 to-green-600 rounded-full transition-all duration-1000"
            style={{ width: `${progressLevel}%` }}
          />
        </div>
      </div>

      {/* Stage information */}
      <div className="mt-6 p-4 rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800">
        <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2">{currentStage.title}</h4>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{currentStage.description}</p>
        
        {/* Forest statistics */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="bg-white/60 dark:bg-slate-800/60 rounded-lg p-3">
            <div className="text-2xl font-bold text-green-600">{Math.min(treeDensity, 15)}</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Trees</div>
          </div>
          <div className="bg-white/60 dark:bg-slate-800/60 rounded-lg p-3">
            <div className="text-2xl font-bold text-emerald-600">{undergrowthDensity}</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Bushes</div>
          </div>
          <div className="bg-white/60 dark:bg-slate-800/60 rounded-lg p-3">
            <div className="text-2xl font-bold text-blue-600">{wildlifeDensity}</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Wildlife</div>
          </div>
        </div>
        
        {/* Progress milestones */}
        <div className="mt-4 flex justify-between items-center">
          <span className="text-xs text-gray-500 dark:text-gray-400">Forest Growth</span>
          <div className="flex gap-1">
            {[0, 25, 50, 75].map((milestone) => (
              <div
                key={milestone}
                className={`w-10 h-2 rounded-full transition-all duration-500 ${
                  progressLevel > milestone
                    ? 'bg-green-500 shadow-sm'
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