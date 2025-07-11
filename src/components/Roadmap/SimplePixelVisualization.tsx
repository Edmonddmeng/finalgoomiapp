interface SimplePixelVisualizationProps {
  completedTasks: number
  totalTasks: number
}

export function SimplePixelVisualization({ completedTasks, totalTasks }: SimplePixelVisualizationProps) {
  // Create a 20x5 grid (100 blocks) - rectangular to fit screen better
  const gridCols = 20
  const gridRows = 5
  const totalBlocks = gridCols * gridRows
  
  // Generate color for filled blocks - creates a nice gradient
  const getBlockColor = (index: number) => {
    const hue = (index * 3.6) % 360 // Spread across color spectrum
    return `hsl(${hue}, 70%, 60%)`
  }
  
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-slate-700">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Progress Visualization</h3>
      
      {/* Pixel Grid */}
      <div 
        className="grid gap-1 mx-auto"
        style={{
          gridTemplateColumns: `repeat(${gridCols}, minmax(0, 1fr))`,
          maxWidth: '100%'
        }}
      >
        {Array.from({ length: totalBlocks }).map((_, index) => {
          const isFilled = index < completedTasks
          
          return (
            <div
              key={index}
              className={`
                aspect-square rounded-sm transition-all duration-500
                ${isFilled 
                  ? 'scale-100' 
                  : 'scale-95 bg-gray-100 dark:bg-slate-700'
                }
              `}
              style={{
                backgroundColor: isFilled ? getBlockColor(index) : undefined,
                boxShadow: isFilled ? `0 0 8px ${getBlockColor(index)}40` : 'none'
              }}
            />
          )
        })}
      </div>
      
      {/* Simple task counter */}
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {completedTasks} of {totalTasks} tasks completed
        </p>
      </div>
    </div>
  )
}