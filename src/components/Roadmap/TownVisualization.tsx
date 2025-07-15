// // import { TrendingUp } from "lucide-react"

// // interface TownVisualizationProps {
// //   progressLevel: number
// // }

// // export function TownVisualization({ progressLevel }: TownVisualizationProps) {
// //   return (
// //     <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-slate-700">
// //       <div className="flex items-center justify-between mb-4">
// //         <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Your Journey</h3>
// //         <div className="flex items-center gap-2 text-purple-600 font-medium">
// //           <TrendingUp size={18} />
// //           <span>{progressLevel}% Complete</span>
// //         </div>
// //       </div>
// //       <div className="relative h-40 bg-gradient-to-t from-green-100 to-blue-100 dark:from-green-900/30 dark:to-blue-900/30 rounded-lg overflow-hidden">
// //         {/* This is a simplified visualization. A real implementation would use more complex graphics or a library like Three.js */}
// //         <div className="absolute bottom-0 left-0 w-full h-1/3 bg-green-300 dark:bg-green-800/40"></div>
// //         <div className="absolute bottom-0 left-0 w-full h-4 bg-green-400 dark:bg-green-700/50"></div>

// //         {/* Progress Bar */}
// //         <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-5/6 h-2 bg-gray-200 dark:bg-slate-700 rounded-full">
// //           <div
// //             className="h-full bg-purple-500 rounded-full transition-all duration-500"
// //             style={{ width: `${progressLevel}%` }}
// //           ></div>
// //         </div>

// //         {/* "Town" elements */}
// //         <div className="absolute bottom-6 left-1/4 w-8 h-12 bg-yellow-300 dark:bg-yellow-700/60 rounded-t-md"></div>
// //         <div className="absolute bottom-6 left-1/2 w-12 h-16 bg-red-300 dark:bg-red-700/60 rounded-t-lg"></div>
// //         <div className="absolute bottom-6 right-1/4 w-10 h-10 bg-blue-300 dark:bg-blue-700/60 rounded-full"></div>

// //         <div
// //           className="absolute bottom-6 w-10 h-10 bg-purple-500 rounded-full transition-all duration-500 flex items-center justify-center text-white font-bold"
// //           style={{ left: `calc(${progressLevel}% - 20px)` }}
// //         >
// //           You
// //         </div>
// //       </div>
// //     </div>
// //   )
// // }



// import { TrendingUp, Home, Building, Car, Truck, TreePine, Sun, CloudRain, Zap } from "lucide-react"

// interface TownVisualizationProps {
//   progressLevel: number
// }

// export function TownVisualization({ progressLevel }: TownVisualizationProps) {
//   // Calculate what should be visible based on progress
//   const getVisibleElements = () => {
//     const elements = {
//       houses: Math.floor(progressLevel / 10), // 0-10 houses
//       buildings: Math.floor(progressLevel / 20), // 0-5 buildings
//       vehicles: Math.floor(progressLevel / 15), // 0-6 vehicles
//       trees: Math.floor(progressLevel / 12), // 0-8 trees
//       streetLights: Math.floor(progressLevel / 25), // 0-4 street lights
//       hasRoad: progressLevel > 20,
//       hasBridge: progressLevel > 60,
//       hasParks: progressLevel > 40,
//       hasTrafficLights: progressLevel > 80,
//       weather: progressLevel > 90 ? 'sunny' : progressLevel > 70 ? 'cloudy' : 'clear'
//     }
//     return elements
//   }

//   const elements = getVisibleElements()

//   // Building types with different heights and colors
//   const buildingTypes = [
//     { height: 16, color: 'bg-blue-400 dark:bg-blue-600', roof: 'bg-blue-600 dark:bg-blue-800' },
//     { height: 20, color: 'bg-red-400 dark:bg-red-600', roof: 'bg-red-600 dark:bg-red-800' },
//     { height: 12, color: 'bg-green-400 dark:bg-green-600', roof: 'bg-green-600 dark:bg-green-800' },
//     { height: 24, color: 'bg-purple-400 dark:bg-purple-600', roof: 'bg-purple-600 dark:bg-purple-800' },
//     { height: 18, color: 'bg-yellow-400 dark:bg-yellow-600', roof: 'bg-yellow-600 dark:bg-yellow-800' },
//   ]

//   const houseTypes = [
//     { color: 'bg-orange-300 dark:bg-orange-500', roof: 'bg-red-500 dark:bg-red-700' },
//     { color: 'bg-yellow-300 dark:bg-yellow-500', roof: 'bg-green-600 dark:bg-green-800' },
//     { color: 'bg-pink-300 dark:bg-pink-500', roof: 'bg-purple-600 dark:bg-purple-800' },
//     { color: 'bg-cyan-300 dark:bg-cyan-500', roof: 'bg-blue-600 dark:bg-blue-800' },
//   ]

//   const vehicleTypes = [
//     { color: 'bg-red-500', width: 'w-6', height: 'h-3' },
//     { color: 'bg-blue-500', width: 'w-8', height: 'h-4' },
//     { color: 'bg-green-500', width: 'w-5', height: 'h-3' },
//     { color: 'bg-yellow-500', width: 'w-7', height: 'h-3' },
//     { color: 'bg-purple-500', width: 'w-6', height: 'h-4' },
//     { color: 'bg-orange-500', width: 'w-9', height: 'h-4' },
//   ]

//   return (
//     <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-slate-700">
//       <div className="flex items-center justify-between mb-4">
//         <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Your Journey Town</h3>
//         <div className="flex items-center gap-2 text-purple-600 font-medium">
//           <TrendingUp size={18} />
//           <span>{progressLevel}% Complete</span>
//         </div>
//       </div>

//       <div className="relative h-64 bg-gradient-to-t from-green-200 via-blue-200 to-sky-300 dark:from-green-900/40 dark:via-blue-900/40 dark:to-sky-900/40 rounded-lg overflow-hidden">
//         {/* Sky with weather */}
//         <div className="absolute inset-0">
//           {elements.weather === 'sunny' && (
//             <Sun className="absolute top-4 right-8 text-yellow-400 animate-pulse" size={32} />
//           )}
//           {elements.weather === 'cloudy' && (
//             <>
//               <div className="absolute top-6 right-12 w-8 h-6 bg-white/60 dark:bg-white/30 rounded-full"></div>
//               <div className="absolute top-4 right-8 w-12 h-8 bg-white/80 dark:bg-white/40 rounded-full"></div>
//             </>
//           )}
//         </div>

//         {/* Mountains/Hills Background - Multiple layers for depth */}
//         <div className="absolute bottom-0 left-0 w-full">
//           {/* Far mountains layer */}
//           <div className="absolute bottom-12 left-0 w-full h-24 opacity-20">
//             <div className="absolute bottom-0 left-0 w-20 h-16 bg-indigo-400 dark:bg-indigo-600" 
//                  style={{ clipPath: 'polygon(0% 100%, 50% 20%, 100% 100%)' }}></div>
//             <div className="absolute bottom-0 left-16 w-24 h-20 bg-purple-400 dark:bg-purple-600" 
//                  style={{ clipPath: 'polygon(0% 100%, 30% 10%, 70% 30%, 100% 100%)' }}></div>
//             <div className="absolute bottom-0 left-32 w-28 h-18 bg-blue-400 dark:bg-blue-600" 
//                  style={{ clipPath: 'polygon(0% 100%, 40% 25%, 80% 15%, 100% 100%)' }}></div>
//             <div className="absolute bottom-0 right-0 w-32 h-22 bg-indigo-400 dark:bg-indigo-600" 
//                  style={{ clipPath: 'polygon(0% 100%, 25% 40%, 60% 5%, 85% 35%, 100% 100%)' }}></div>
//           </div>
          
//           {/* Middle mountains layer */}
//           <div className="absolute bottom-12 left-0 w-full h-20 opacity-40">
//             <div className="absolute bottom-0 left-8 w-24 h-16 bg-slate-400 dark:bg-slate-600" 
//                  style={{ clipPath: 'polygon(0% 100%, 40% 10%, 100% 100%)' }}></div>
//             <div className="absolute bottom-0 left-28 w-32 h-18 bg-gray-400 dark:bg-gray-600" 
//                  style={{ clipPath: 'polygon(0% 100%, 30% 20%, 70% 5%, 100% 100%)' }}></div>
//             <div className="absolute bottom-0 right-12 w-28 h-20 bg-slate-500 dark:bg-slate-700" 
//                  style={{ clipPath: 'polygon(0% 100%, 50% 8%, 100% 100%)' }}></div>
//             <div className="absolute bottom-0 right-32 w-20 h-14 bg-gray-500 dark:bg-gray-700" 
//                  style={{ clipPath: 'polygon(0% 100%, 60% 15%, 100% 100%)' }}></div>
//           </div>
          
//           {/* Near hills layer */}
//           <div className="absolute bottom-12 left-0 w-full h-16 opacity-60">
//             <div className="absolute bottom-0 left-0 w-28 h-12 bg-green-400 dark:bg-green-600" 
//                  style={{ clipPath: 'polygon(0% 100%, 30% 30%, 70% 10%, 100% 100%)' }}></div>
//             <div className="absolute bottom-0 left-20 w-24 h-14 bg-emerald-400 dark:bg-emerald-600" 
//                  style={{ clipPath: 'polygon(0% 100%, 50% 5%, 100% 100%)' }}></div>
//             <div className="absolute bottom-0 right-8 w-32 h-10 bg-lime-400 dark:bg-lime-600" 
//                  style={{ clipPath: 'polygon(0% 100%, 40% 20%, 80% 40%, 100% 100%)' }}></div>
//             <div className="absolute bottom-0 right-24 w-20 h-12 bg-green-500 dark:bg-green-700" 
//                  style={{ clipPath: 'polygon(0% 100%, 60% 25%, 100% 100%)' }}></div>
//           </div>
          
//           {/* Foreground hills with trees */}
//           <div className="absolute bottom-12 left-0 w-full h-12 opacity-80">
//             <div className="absolute bottom-0 left-4 w-20 h-8 bg-green-500 dark:bg-green-700 rounded-t-full"></div>
//             <div className="absolute bottom-0 left-16 w-16 h-6 bg-emerald-500 dark:bg-emerald-700 rounded-t-full"></div>
//             <div className="absolute bottom-0 right-16 w-24 h-10 bg-green-600 dark:bg-green-800 rounded-t-full"></div>
//             <div className="absolute bottom-0 right-32 w-18 h-7 bg-lime-500 dark:bg-lime-700 rounded-t-full"></div>
            
//             {/* Trees on hills */}
//             <div className="absolute bottom-6 left-8">
//               <TreePine size={12} className="text-green-800 dark:text-green-600" />
//             </div>
//             <div className="absolute bottom-4 left-20">
//               <TreePine size={10} className="text-green-700 dark:text-green-500" />
//             </div>
//             <div className="absolute bottom-8 right-20">
//               <TreePine size={14} className="text-green-900 dark:text-green-700" />
//             </div>
//             <div className="absolute bottom-5 right-28">
//               <TreePine size={11} className="text-green-800 dark:text-green-600" />
//             </div>
//           </div>
          
//           {/* Snow caps on far mountains (only at higher progress) */}
//           {progressLevel > 50 && (
//             <div className="absolute bottom-12 left-0 w-full h-24 opacity-30">
//               <div className="absolute bottom-16 left-16 w-6 h-4 bg-white dark:bg-gray-100 rounded-t-full"></div>
//               <div className="absolute bottom-18 left-32 w-8 h-3 bg-white dark:bg-gray-100 rounded-t-full"></div>
//               <div className="absolute bottom-20 right-8 w-10 h-5 bg-white dark:bg-gray-100 rounded-t-full"></div>
//             </div>
//           )}
          
//           {/* Clouds around mountains */}
//           {progressLevel > 30 && (
//             <div className="absolute bottom-20 left-0 w-full h-16 opacity-40">
//               <div className="absolute bottom-4 left-12 w-8 h-4 bg-white dark:bg-gray-200 rounded-full animate-[float_15s_ease-in-out_infinite]"></div>
//               <div className="absolute bottom-8 left-40 w-6 h-3 bg-white dark:bg-gray-200 rounded-full animate-[float_20s_ease-in-out_infinite_reverse]"></div>
//               <div className="absolute bottom-6 right-20 w-10 h-5 bg-white dark:bg-gray-200 rounded-full animate-[float_18s_ease-in-out_infinite]"></div>
//             </div>
//           )}
//         </div>

//         {/* Ground layers */}
//         <div className="absolute bottom-0 left-0 w-full h-12 bg-green-400 dark:bg-green-700/60"></div>
//         <div className="absolute bottom-0 left-0 w-full h-6 bg-green-500 dark:bg-green-800/60"></div>
        
//         {/* Road */}
//         {elements.hasRoad && (
//           <div className="absolute bottom-6 left-0 w-full h-4 bg-gray-600 dark:bg-gray-700">
//             {/* Road markings */}
//             <div className="absolute top-1/2 left-0 w-full h-0.5 bg-white/60 transform -translate-y-1/2"></div>
//             <div className="absolute top-1/2 left-0 w-full h-px bg-yellow-300 transform -translate-y-1/2 opacity-60"></div>
//           </div>
//         )}

//         {/* Bridge */}
//         {elements.hasBridge && (
//           <div className="absolute bottom-6 left-1/3 w-32 h-6 bg-stone-400 dark:bg-stone-600 rounded-sm">
//             <div className="absolute -top-2 left-2 w-1 h-8 bg-stone-500 dark:bg-stone-700"></div>
//             <div className="absolute -top-2 right-2 w-1 h-8 bg-stone-500 dark:bg-stone-700"></div>
//           </div>
//         )}

//         {/* Street lights */}
//         {Array.from({ length: elements.streetLights }).map((_, i) => (
//           <div
//             key={`light-${i}`}
//             className="absolute bottom-10"
//             style={{ left: `${20 + i * 20}%` }}
//           >
//             <div className="w-1 h-8 bg-gray-700 dark:bg-gray-600"></div>
//             <div className="w-3 h-2 bg-yellow-400 dark:bg-yellow-300 rounded-full -ml-1 animate-pulse"></div>
//           </div>
//         ))}

//         {/* Traffic lights */}
//         {elements.hasTrafficLights && (
//           <div className="absolute bottom-10 left-1/2 -translate-x-1/2">
//             <div className="w-2 h-6 bg-gray-800 dark:bg-gray-700"></div>
//             <div className="w-4 h-8 bg-black dark:bg-gray-900 rounded-sm -ml-1">
//               <div className="w-1 h-1 bg-red-500 rounded-full m-0.5 animate-pulse"></div>
//               <div className="w-1 h-1 bg-yellow-400 rounded-full m-0.5"></div>
//               <div className="w-1 h-1 bg-green-500 rounded-full m-0.5"></div>
//             </div>
//           </div>
//         )}

//         {/* Trees */}
//         {Array.from({ length: elements.trees }).map((_, i) => (
//           <div
//             key={`tree-${i}`}
//             className="absolute bottom-10"
//             style={{ left: `${10 + i * 12}%` }}
//           >
//             <TreePine 
//               size={16 + (i % 3) * 4} 
//               className="text-green-600 dark:text-green-500" 
//             />
//           </div>
//         ))}

//         {/* Houses */}
//         {Array.from({ length: Math.min(elements.houses, 8) }).map((_, i) => {
//           const houseType = houseTypes[i % houseTypes.length]
//           return (
//             <div
//               key={`house-${i}`}
//               className="absolute bottom-10"
//               style={{ left: `${15 + i * 10}%` }}
//             >
//               {/* House body */}
//               <div className={`w-8 h-8 ${houseType.color} rounded-sm relative`}>
//                 {/* Door */}
//                 <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-3 bg-brown-600 dark:bg-brown-800 rounded-t-sm"></div>
//                 {/* Windows */}
//                 <div className="absolute top-1 left-1 w-1.5 h-1.5 bg-cyan-200 dark:bg-cyan-400 rounded-sm"></div>
//                 <div className="absolute top-1 right-1 w-1.5 h-1.5 bg-cyan-200 dark:bg-cyan-400 rounded-sm"></div>
//                 {/* Chimney */}
//                 <div className="absolute -top-1 right-1 w-1 h-2 bg-gray-600 dark:bg-gray-700"></div>
//               </div>
//               {/* Roof */}
//               <div className={`absolute -top-2 left-1/2 -translate-x-1/2 w-10 h-4 ${houseType.roof} transform rotate-0`} 
//                    style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }}>
//               </div>
//             </div>
//           )
//         })}

//         {/* Buildings */}
//         {Array.from({ length: Math.min(elements.buildings, 5) }).map((_, i) => {
//           const buildingType = buildingTypes[i % buildingTypes.length]
//           return (
//             <div
//               key={`building-${i}`}
//               className="absolute bottom-10"
//               style={{ left: `${25 + i * 15}%` }}
//             >
//               {/* Building body */}
//               <div 
//                 className={`w-10 ${buildingType.color} rounded-t-sm relative`}
//                 style={{ height: `${buildingType.height}px` }}
//               >
//                 {/* Windows grid */}
//                 {Array.from({ length: Math.floor(buildingType.height / 6) }).map((_, floor) => (
//                   <div key={floor} className="flex justify-center gap-1 mt-1">
//                     <div className="w-1 h-1 bg-yellow-200 dark:bg-yellow-400 rounded-sm"></div>
//                     <div className="w-1 h-1 bg-yellow-200 dark:bg-yellow-400 rounded-sm"></div>
//                     <div className="w-1 h-1 bg-yellow-200 dark:bg-yellow-400 rounded-sm"></div>
//                   </div>
//                 ))}
//                 {/* Antenna */}
//                 <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-px h-4 bg-gray-600 dark:bg-gray-500"></div>
//                 <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-px bg-gray-600 dark:bg-gray-500"></div>
//               </div>
//               {/* Roof */}
//               <div className={`w-10 h-1 ${buildingType.roof} rounded-t-sm`}></div>
//             </div>
//           )
//         })}

//         {/* Vehicles */}
//         {Array.from({ length: Math.min(elements.vehicles, 6) }).map((_, i) => {
//           const vehicleType = vehicleTypes[i % vehicleTypes.length]
//           return (
//             <div
//               key={`vehicle-${i}`}
//               className="absolute bottom-6"
//               style={{ 
//                 left: `${5 + i * 15}%`,
//                 animationDelay: `${i * 0.5}s`
//               }}
//             >
//               <div className={`${vehicleType.width} ${vehicleType.height} ${vehicleType.color} rounded-sm relative animate-pulse`}>
//                 {/* Wheels */}
//                 <div className="absolute -bottom-0.5 left-1 w-1 h-1 bg-black dark:bg-gray-900 rounded-full"></div>
//                 <div className="absolute -bottom-0.5 right-1 w-1 h-1 bg-black dark:bg-gray-900 rounded-full"></div>
//                 {/* Headlights */}
//                 <div className="absolute top-1/2 -translate-y-1/2 left-0 w-px h-1 bg-yellow-300"></div>
//               </div>
//             </div>
//           )
//         })}

//         {/* Parks */}
//         {elements.hasParks && (
//           <div className="absolute bottom-10 right-8">
//             <div className="w-12 h-8 bg-green-300 dark:bg-green-600 rounded-lg relative">
//               <div className="absolute top-1 left-1 w-2 h-2 bg-brown-400 dark:bg-brown-600 rounded-full"></div>
//               <div className="absolute top-1 right-1 w-1 h-4 bg-brown-600 dark:bg-brown-800"></div>
//               <div className="absolute top-0 right-0.5 w-2 h-2 bg-green-500 dark:bg-green-400 rounded-full"></div>
//               <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-4 h-1 bg-brown-500 dark:bg-brown-700 rounded-full"></div>
//             </div>
//           </div>
//         )}

//         {/* Progress bar */}
//         <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-5/6 h-2 bg-gray-200 dark:bg-slate-700 rounded-full">
//           <div
//             className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-500"
//             style={{ width: `${progressLevel}%` }}
//           ></div>
//         </div>

//         {/* Player character */}
//         <div
//           className="absolute bottom-10 w-4 h-4 bg-purple-600 rounded-full transition-all duration-1000 flex items-center justify-center text-white font-bold text-xs shadow-lg"
//           style={{ left: `calc(${progressLevel}% - 8px)` }}
//         >
//           👤
//         </div>

//         {/* Progress indicator */}
//         <div className="absolute top-2 right-2 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-lg px-2 py-1 text-xs font-mono">
//           {progressLevel}%
//         </div>
//       </div>

//       {/* Town statistics */}
//       <div className="mt-4 grid grid-cols-4 gap-2 text-center">
//         <div className="bg-gray-50 dark:bg-slate-700/50 rounded-lg p-2">
//           <div className="text-lg font-bold text-blue-600">{elements.houses}</div>
//           <div className="text-xs text-gray-600 dark:text-gray-400">Houses</div>
//         </div>
//         <div className="bg-gray-50 dark:bg-slate-700/50 rounded-lg p-2">
//           <div className="text-lg font-bold text-purple-600">{elements.buildings}</div>
//           <div className="text-xs text-gray-600 dark:text-gray-400">Buildings</div>
//         </div>
//         <div className="bg-gray-50 dark:bg-slate-700/50 rounded-lg p-2">
//           <div className="text-lg font-bold text-green-600">{elements.vehicles}</div>
//           <div className="text-xs text-gray-600 dark:text-gray-400">Vehicles</div>
//         </div>
//         <div className="bg-gray-50 dark:bg-slate-700/50 rounded-lg p-2">
//           <div className="text-lg font-bold text-yellow-600">{elements.trees}</div>
//           <div className="text-xs text-gray-600 dark:text-gray-400">Trees</div>
//         </div>
//       </div>

//       {/* Town stage description */}
//       <div className="mt-3 p-3 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
//         <div className="text-sm font-medium text-purple-800 dark:text-purple-200">
//           {progressLevel === 100 ? "🏆 Thriving Metropolis!" :
//            progressLevel >= 80 ? "🌆 Bustling City" :
//            progressLevel >= 60 ? "🏘️ Growing Town" :
//            progressLevel >= 40 ? "🏠 Small Village" :
//            progressLevel >= 20 ? "🌱 Settlement" :
//            "🏕️ Empty Land"}
//         </div>
//         <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
//           {progressLevel === 100 ? "Your town is a magnificent metropolis with everything a citizen could want!" :
//            progressLevel >= 80 ? "Traffic lights keep your busy city organized and efficient." :
//            progressLevel >= 60 ? "Your town now has a bridge connecting different areas!" :
//            progressLevel >= 40 ? "Parks and green spaces make your village more livable." :
//            progressLevel >= 20 ? "Roads are being built to connect your growing settlement." :
//            "Complete tasks to start building your town from the ground up!"}
//         </div>
//       </div>
//     </div>
//   )
// }




import { TrendingUp, Home, Building, Car, Truck, TreePine, Sun, CloudRain, Zap } from "lucide-react"

interface TownVisualizationProps {
  progressLevel: number
}

export function TownVisualization({ progressLevel }: TownVisualizationProps) {
  // Calculate what should be visible based on progress
  const getVisibleElements = () => {
    const elements = {
      houses: Math.floor(progressLevel / 10), // 0-10 houses
      buildings: Math.floor(progressLevel / 20), // 0-5 buildings
      vehicles: Math.floor(progressLevel / 15), // 0-6 vehicles
      trees: Math.floor(progressLevel / 12), // 0-8 trees
      streetLights: Math.floor(progressLevel / 25), // 0-4 street lights
      hasRoad: progressLevel > 20,
      hasBridge: progressLevel > 60,
      hasParks: progressLevel > 40,
      hasTrafficLights: progressLevel > 80,
      weather: progressLevel > 90 ? 'sunny' : progressLevel > 70 ? 'cloudy' : 'clear'
    }
    return elements
  }

  const elements = getVisibleElements()

  // Building types with different heights and colors
  const buildingTypes = [
    { height: 16, color: 'bg-blue-400 dark:bg-blue-600', roof: 'bg-blue-600 dark:bg-blue-800' },
    { height: 20, color: 'bg-red-400 dark:bg-red-600', roof: 'bg-red-600 dark:bg-red-800' },
    { height: 12, color: 'bg-green-400 dark:bg-green-600', roof: 'bg-green-600 dark:bg-green-800' },
    { height: 24, color: 'bg-purple-400 dark:bg-purple-600', roof: 'bg-purple-600 dark:bg-purple-800' },
    { height: 18, color: 'bg-yellow-400 dark:bg-yellow-600', roof: 'bg-yellow-600 dark:bg-yellow-800' },
  ]

  const houseTypes = [
    { color: 'bg-orange-300 dark:bg-orange-500', roof: 'bg-red-500 dark:bg-red-700' },
    { color: 'bg-yellow-300 dark:bg-yellow-500', roof: 'bg-green-600 dark:bg-green-800' },
    { color: 'bg-pink-300 dark:bg-pink-500', roof: 'bg-purple-600 dark:bg-purple-800' },
    { color: 'bg-cyan-300 dark:bg-cyan-500', roof: 'bg-blue-600 dark:bg-blue-800' },
  ]

  const vehicleTypes = [
    { color: 'bg-red-500', width: 'w-6', height: 'h-3' },
    { color: 'bg-blue-500', width: 'w-8', height: 'h-4' },
    { color: 'bg-green-500', width: 'w-5', height: 'h-3' },
    { color: 'bg-yellow-500', width: 'w-7', height: 'h-3' },
    { color: 'bg-purple-500', width: 'w-6', height: 'h-4' },
    { color: 'bg-orange-500', width: 'w-9', height: 'h-4' },
  ]

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-slate-700">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Your Journey Town</h3>
        <div className="flex items-center gap-2 text-purple-600 font-medium">
          <TrendingUp size={18} />
          <span>{progressLevel}% Complete</span>
        </div>
      </div>

      <div className="relative h-64 bg-gradient-to-b from-sky-200 via-sky-300 to-blue-200 dark:from-sky-900/40 dark:via-sky-800/40 dark:to-blue-900/40 rounded-lg overflow-hidden">
        {/* Sky with weather */}
        <div className="absolute inset-0">
          {elements.weather === 'sunny' && (
            <Sun className="absolute top-4 right-8 text-yellow-400 animate-pulse" size={32} />
          )}
          {elements.weather === 'cloudy' && (
            <>
              <div className="absolute top-6 right-12 w-8 h-6 bg-white/60 dark:bg-white/30 rounded-full"></div>
              <div className="absolute top-4 right-8 w-12 h-8 bg-white/80 dark:bg-white/40 rounded-full"></div>
            </>
          )}
        </div>

        {/* Mountains/Hills Background - Multiple layers for depth */}
        <div className="absolute bottom-0 left-0 w-full">
          {/* Far mountains layer */}
          <div className="absolute bottom-20 left-0 w-full h-32 opacity-30">
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-indigo-400 dark:bg-indigo-600" 
                 style={{ clipPath: 'polygon(0% 100%, 50% 20%, 100% 100%)' }}></div>
            <div className="absolute bottom-0 left-20 w-32 h-28 bg-purple-400 dark:bg-purple-600" 
                 style={{ clipPath: 'polygon(0% 100%, 30% 10%, 70% 30%, 100% 100%)' }}></div>
            <div className="absolute bottom-0 left-44 w-36 h-26 bg-blue-400 dark:bg-blue-600" 
                 style={{ clipPath: 'polygon(0% 100%, 40% 25%, 80% 15%, 100% 100%)' }}></div>
            <div className="absolute bottom-0 right-0 w-40 h-30 bg-indigo-500 dark:bg-indigo-700" 
                 style={{ clipPath: 'polygon(0% 100%, 25% 40%, 60% 5%, 85% 35%, 100% 100%)' }}></div>
          </div>
          
          {/* Middle mountains layer */}
          <div className="absolute bottom-20 left-0 w-full h-24 opacity-50">
            <div className="absolute bottom-0 left-8 w-28 h-20 bg-slate-400 dark:bg-slate-600" 
                 style={{ clipPath: 'polygon(0% 100%, 40% 10%, 100% 100%)' }}></div>
            <div className="absolute bottom-0 left-32 w-36 h-22 bg-gray-400 dark:bg-gray-600" 
                 style={{ clipPath: 'polygon(0% 100%, 30% 20%, 70% 5%, 100% 100%)' }}></div>
            <div className="absolute bottom-0 right-8 w-32 h-24 bg-slate-500 dark:bg-slate-700" 
                 style={{ clipPath: 'polygon(0% 100%, 50% 8%, 100% 100%)' }}></div>
          </div>
          
          {/* Near hills layer */}
          <div className="absolute bottom-20 left-0 w-full h-20 opacity-70">
            <div className="absolute bottom-0 left-0 w-32 h-16 bg-green-400 dark:bg-green-600" 
                 style={{ clipPath: 'polygon(0% 100%, 30% 30%, 70% 10%, 100% 100%)' }}></div>
            <div className="absolute bottom-0 left-24 w-28 h-18 bg-emerald-400 dark:bg-emerald-600" 
                 style={{ clipPath: 'polygon(0% 100%, 50% 5%, 100% 100%)' }}></div>
            <div className="absolute bottom-0 right-0 w-36 h-14 bg-lime-400 dark:bg-lime-600" 
                 style={{ clipPath: 'polygon(0% 100%, 40% 20%, 80% 40%, 100% 100%)' }}></div>
          </div>
        </div>

        {/* Snow caps on far mountains (only at higher progress) */}
        {progressLevel > 50 && (
          <div className="absolute bottom-20 left-0 w-full h-32 opacity-40">
            <div className="absolute bottom-20 left-20 w-8 h-6 bg-white dark:bg-gray-100 rounded-t-full"></div>
            <div className="absolute bottom-24 left-44 w-10 h-4 bg-white dark:bg-gray-100 rounded-t-full"></div>
            <div className="absolute bottom-26 right-12 w-12 h-7 bg-white dark:bg-gray-100 rounded-t-full"></div>
          </div>
        )}
        
        {/* Clouds around mountains */}
        {progressLevel > 30 && (
          <div className="absolute bottom-28 left-0 w-full h-20 opacity-50">
            <div className="absolute bottom-8 left-16 w-10 h-6 bg-white dark:bg-gray-200 rounded-full animate-[float_15s_ease-in-out_infinite]"></div>
            <div className="absolute bottom-12 left-48 w-8 h-4 bg-white dark:bg-gray-200 rounded-full animate-[float_20s_ease-in-out_infinite_reverse]"></div>
            <div className="absolute bottom-10 right-24 w-12 h-7 bg-white dark:bg-gray-200 rounded-full animate-[float_18s_ease-in-out_infinite]"></div>
          </div>
        )}

        {/* Ground - positioned properly */}
        <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-green-500 to-green-400 dark:from-green-700 dark:to-green-600"></div>
        <div className="absolute bottom-0 left-0 w-full h-8 bg-green-600 dark:bg-green-800"></div>
        
        {/* Road - properly positioned on ground */}
        {elements.hasRoad && (
          <div className="absolute bottom-8 left-0 w-full h-6 bg-gray-600 dark:bg-gray-700">
            {/* Road markings */}
            <div className="absolute top-1/2 left-0 w-full h-0.5 bg-white/60 transform -translate-y-1/2"></div>
            <div className="absolute top-1/2 left-0 w-full h-px bg-yellow-300 transform -translate-y-1/2 opacity-80"></div>
            {/* Road edge lines */}
            <div className="absolute top-0 left-0 w-full h-px bg-gray-800 dark:bg-gray-900"></div>
            <div className="absolute bottom-0 left-0 w-full h-px bg-gray-800 dark:bg-gray-900"></div>
          </div>
        )}

        {/* Bridge - properly positioned */}
        {elements.hasBridge && (
          <div className="absolute bottom-8 left-1/3 w-32 h-8 bg-stone-400 dark:bg-stone-600">
            <div className="absolute -top-4 left-4 w-1 h-12 bg-stone-500 dark:bg-stone-700"></div>
            <div className="absolute -top-4 right-4 w-1 h-12 bg-stone-500 dark:bg-stone-700"></div>
            <div className="absolute -top-1 left-4 right-4 h-px bg-stone-600 dark:bg-stone-800"></div>
          </div>
        )}

        {/* Trees - properly positioned on ground */}
        {Array.from({ length: elements.trees }).map((_, i) => (
          <div
            key={`tree-${i}`}
            className="absolute bottom-14"
            style={{ left: `${8 + i * 10}%` }}
          >
            <TreePine 
              size={20 + (i % 3) * 4} 
              className="text-green-700 dark:text-green-600 drop-shadow-sm" 
            />
          </div>
        ))}

        {/* Street lights - properly positioned */}
        {Array.from({ length: elements.streetLights }).map((_, i) => (
          <div
            key={`light-${i}`}
            className="absolute bottom-14"
            style={{ left: `${15 + i * 20}%` }}
          >
            <div className="w-1 h-12 bg-gray-700 dark:bg-gray-600 mx-auto"></div>
            <div className="w-4 h-3 bg-yellow-400 dark:bg-yellow-300 rounded-full -mt-1 animate-pulse shadow-lg"></div>
          </div>
        ))}

        {/* Traffic lights - properly positioned */}
        {elements.hasTrafficLights && (
          <div className="absolute bottom-14 left-1/2 -translate-x-1/2">
            <div className="w-2 h-8 bg-gray-800 dark:bg-gray-700 mx-auto"></div>
            <div className="w-5 h-10 bg-black dark:bg-gray-900 rounded-sm -mt-1 border border-gray-600">
              <div className="w-1.5 h-1.5 bg-red-500 rounded-full m-1 animate-pulse"></div>
              <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full m-1 opacity-50"></div>
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full m-1"></div>
            </div>
          </div>
        )}

        {/* Houses - properly aligned on ground */}
        {Array.from({ length: Math.min(elements.houses, 10) }).map((_, i) => {
          const houseType = houseTypes[i % houseTypes.length]
          const housePosition = 10 + (i * 8)
          return (
            <div
              key={`house-${i}`}
              className="absolute bottom-14"
              style={{ left: `${housePosition}%` }}
            >
              {/* House foundation */}
              <div className="w-12 h-1 bg-gray-600 dark:bg-gray-700 mb-0"></div>
              
              {/* House body */}
              <div className={`w-12 h-12 ${houseType.color} relative border border-gray-400 dark:border-gray-600`}>
                {/* Door */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3 h-5 bg-amber-800 dark:bg-amber-900 border border-amber-900 dark:border-amber-950"></div>
                {/* Windows */}
                <div className="absolute top-2 left-2 w-2 h-2 bg-cyan-200 dark:bg-cyan-400 border border-cyan-400 dark:border-cyan-600"></div>
                <div className="absolute top-2 right-2 w-2 h-2 bg-cyan-200 dark:bg-cyan-400 border border-cyan-400 dark:border-cyan-600"></div>
                {/* Chimney */}
                <div className="absolute -top-2 right-2 w-2 h-4 bg-gray-700 dark:bg-gray-800 border border-gray-800 dark:border-gray-900"></div>
                {/* Smoke */}
                {progressLevel > 50 && (
                  <div className="absolute -top-4 right-2 w-1 h-2 bg-gray-400 dark:bg-gray-500 rounded-full opacity-60 animate-pulse"></div>
                )}
              </div>
              
              {/* Roof */}
              <div 
                className={`absolute -top-3 left-1/2 -translate-x-1/2 w-14 h-6 ${houseType.roof} border border-gray-600 dark:border-gray-700`} 
                style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }}
              >
              </div>
            </div>
          )
        })}

        {/* Buildings - properly aligned */}
        {Array.from({ length: Math.min(elements.buildings, 5) }).map((_, i) => {
          const buildingType = buildingTypes[i % buildingTypes.length]
          const buildingPosition = 20 + (i * 15)
          return (
            <div
              key={`building-${i}`}
              className="absolute bottom-14"
              style={{ left: `${buildingPosition}%` }}
            >
              {/* Building foundation */}
              <div className="w-16 h-1 bg-gray-700 dark:bg-gray-800 mb-0"></div>
              
              {/* Building body */}
              <div 
                className={`w-16 ${buildingType.color} relative border border-gray-500 dark:border-gray-600`}
                style={{ height: `${buildingType.height + 20}px` }}
              >
                {/* Windows grid */}
                {Array.from({ length: Math.floor((buildingType.height + 20) / 8) }).map((_, floor) => (
                  <div key={floor} className="flex justify-center gap-1 mt-1">
                    <div className="w-1.5 h-1.5 bg-yellow-200 dark:bg-yellow-400 border border-yellow-400 dark:border-yellow-600"></div>
                    <div className="w-1.5 h-1.5 bg-yellow-200 dark:bg-yellow-400 border border-yellow-400 dark:border-yellow-600"></div>
                    <div className="w-1.5 h-1.5 bg-yellow-200 dark:bg-yellow-400 border border-yellow-400 dark:border-yellow-600"></div>
                    <div className="w-1.5 h-1.5 bg-yellow-200 dark:bg-yellow-400 border border-yellow-400 dark:border-yellow-600"></div>
                  </div>
                ))}
                
                {/* Antenna */}
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-px h-6 bg-gray-600 dark:bg-gray-500"></div>
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-3 h-px bg-gray-600 dark:bg-gray-500"></div>
              </div>
              
              {/* Roof */}
              <div className={`w-16 h-2 ${buildingType.roof} border border-gray-600 dark:border-gray-700`}></div>
            </div>
          )
        })}

        {/* Vehicles - properly positioned on road */}
        {elements.hasRoad && Array.from({ length: Math.min(elements.vehicles, 6) }).map((_, i) => {
          const vehicleType = vehicleTypes[i % vehicleTypes.length]
          const vehiclePosition = 5 + (i * 14)
          return (
            <div
              key={`vehicle-${i}`}
              className="absolute bottom-9"
              style={{ left: `${vehiclePosition}%` }}
            >
              <div className={`${vehicleType.width} ${vehicleType.height} ${vehicleType.color} relative border border-gray-700 dark:border-gray-800`}>
                {/* Wheels */}
                <div className="absolute -bottom-1 left-1 w-1.5 h-1.5 bg-black dark:bg-gray-900 rounded-full border border-gray-600"></div>
                <div className="absolute -bottom-1 right-1 w-1.5 h-1.5 bg-black dark:bg-gray-900 rounded-full border border-gray-600"></div>
                {/* Windshield */}
                <div className="absolute top-0 left-1 right-1 h-1 bg-cyan-200 dark:bg-cyan-400 opacity-60"></div>
                {/* Headlights */}
                <div className="absolute top-1/2 -translate-y-1/2 left-0 w-px h-1 bg-yellow-300"></div>
              </div>
            </div>
          )
        })}

        {/* Parks - better positioned */}
        {elements.hasParks && (
          <div className="absolute bottom-14 right-4">
            <div className="w-16 h-12 bg-green-400 dark:bg-green-600 rounded-lg relative border border-green-600 dark:border-green-800">
              {/* Park bench */}
              <div className="absolute top-2 left-2 w-3 h-2 bg-amber-700 dark:bg-amber-800"></div>
              {/* Tree in park */}
              <div className="absolute top-1 right-2 w-2 h-6 bg-amber-800 dark:bg-amber-900"></div>
              <div className="absolute top-0 right-1 w-4 h-4 bg-green-600 dark:bg-green-500 rounded-full"></div>
              {/* Path */}
              <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-6 h-2 bg-gray-400 dark:bg-gray-600 rounded-full"></div>
            </div>
          </div>
        )}

        {/* Progress bar - properly positioned */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-11/12 h-3 bg-gray-300 dark:bg-slate-700 rounded-full border border-gray-400 dark:border-gray-600">
          <div
            className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-1000 shadow-inner"
            style={{ width: `${progressLevel}%` }}
          ></div>
        </div>

        {/* Player character - properly positioned */}
        <div
          className="absolute bottom-16 w-6 h-6 bg-purple-600 rounded-full transition-all duration-1000 flex items-center justify-center text-white font-bold text-sm shadow-lg border-2 border-purple-800 dark:border-purple-400"
          style={{ left: `calc(${progressLevel}% - 12px)` }}
        >
          👤
        </div>

        {/* Progress indicator */}
        <div className="absolute top-2 right-2 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-lg px-3 py-1 text-sm font-mono border border-gray-300 dark:border-gray-600">
          {progressLevel}%
        </div>
      </div>

      {/* Town statistics */}
      <div className="mt-4 grid grid-cols-4 gap-2 text-center">
        <div className="bg-gray-50 dark:bg-slate-700/50 rounded-lg p-2">
          <div className="text-lg font-bold text-blue-600">{elements.houses}</div>
          <div className="text-xs text-gray-600 dark:text-gray-400">Houses</div>
        </div>
        <div className="bg-gray-50 dark:bg-slate-700/50 rounded-lg p-2">
          <div className="text-lg font-bold text-purple-600">{elements.buildings}</div>
          <div className="text-xs text-gray-600 dark:text-gray-400">Buildings</div>
        </div>
        <div className="bg-gray-50 dark:bg-slate-700/50 rounded-lg p-2">
          <div className="text-lg font-bold text-green-600">{elements.vehicles}</div>
          <div className="text-xs text-gray-600 dark:text-gray-400">Vehicles</div>
        </div>
        <div className="bg-gray-50 dark:bg-slate-700/50 rounded-lg p-2">
          <div className="text-lg font-bold text-yellow-600">{elements.trees}</div>
          <div className="text-xs text-gray-600 dark:text-gray-400">Trees</div>
        </div>
      </div>

      {/* Town stage description */}
      <div className="mt-3 p-3 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
        <div className="text-sm font-medium text-purple-800 dark:text-purple-200">
          {progressLevel === 100 ? "🏆 Thriving Metropolis!" :
           progressLevel >= 80 ? "🌆 Bustling City" :
           progressLevel >= 60 ? "🏘️ Growing Town" :
           progressLevel >= 40 ? "🏠 Small Village" :
           progressLevel >= 20 ? "🌱 Settlement" :
           "🏕️ Empty Land"}
        </div>
        <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
          {progressLevel === 100 ? "Your town is a magnificent metropolis with everything a citizen could want!" :
           progressLevel >= 80 ? "Traffic lights keep your busy city organized and efficient." :
           progressLevel >= 60 ? "Your town now has a bridge connecting different areas!" :
           progressLevel >= 40 ? "Parks and green spaces make your village more livable." :
           progressLevel >= 20 ? "Roads are being built to connect your growing settlement." :
           "Complete tasks to start building your town from the ground up!"}
        </div>
      </div>
    </div>
  )
}