
// import { apiClient } from "@/lib/apiClient"

// export interface StreakData {
//   current_streak: number
//   streak_date: string // ISO date string
//   streak_high: number
// }

// export interface StreakUpdateResult {
//   current_streak: number
//   streak_date: string
//   streak_high: number
//   isNewStreak: boolean
//   isStreakBroken: boolean
//   isNewRecord: boolean
// }

// /**
//  * Calculate and update streak based on last login date
//  * @param lastStreakData - Current streak data from database
//  * @returns Updated streak data with flags for UI feedback
//  */
// export function calculateStreak(lastStreakData: StreakData | null): StreakUpdateResult {
//   const today = new Date()
//   const todayString = today.toISOString().split('T')[0] // YYYY-MM-DD format
  
//   console.log('🔍 Calculating streak for:', {
//     lastStreakData,
//     today: todayString
//   })
  
//   // Handle first time user (no previous streak data)
//   if (!lastStreakData || !lastStreakData.streak_date) {
//     console.log('✨ First time user - starting new streak')
//     return {
//       current_streak: 1,
//       streak_date: todayString,
//       streak_high: 1,
//       isNewStreak: true,
//       isStreakBroken: false,
//       isNewRecord: true
//     }
//   }

//   const lastStreakDate = new Date(lastStreakData.streak_date)
//   const daysDifference = getDaysDifference(lastStreakDate, today)
  
//   console.log('📅 Days difference:', {
//     lastStreakDate: lastStreakData.streak_date,
//     today: todayString,
//     daysDifference
//   })

//   // Same day login - no changes
//   if (daysDifference === 0) {
//     console.log('🔄 Same day login - no streak changes')
//     return {
//       current_streak: lastStreakData.current_streak,
//       streak_date: lastStreakData.streak_date,
//       streak_high: lastStreakData.streak_high,
//       isNewStreak: false,
//       isStreakBroken: false,
//       isNewRecord: false
//     }
//   }

//   // Consecutive day login (exactly 1 day difference)
//   if (daysDifference === 1) {
//     const newCurrentStreak = lastStreakData.current_streak + 1
//     const newStreakHigh = Math.max(newCurrentStreak, lastStreakData.streak_high)
    
//     console.log('🔥 Consecutive day - streak increased!', {
//       oldStreak: lastStreakData.current_streak,
//       newStreak: newCurrentStreak,
//       newHigh: newStreakHigh
//     })
    
//     return {
//       current_streak: newCurrentStreak,
//       streak_date: todayString,
//       streak_high: newStreakHigh,
//       isNewStreak: false,
//       isStreakBroken: false,
//       isNewRecord: newCurrentStreak > lastStreakData.streak_high
//     }
//   }

//   // Gap in days (more than 1 day) - streak broken, start new streak
//   console.log('💔 Streak broken - starting fresh', {
//     daysMissed: daysDifference - 1,
//     oldStreak: lastStreakData.current_streak
//   })
  
//   return {
//     current_streak: 1,
//     streak_date: todayString,
//     streak_high: lastStreakData.streak_high, // Keep the previous high
//     isNewStreak: true,
//     isStreakBroken: true,
//     isNewRecord: false
//   }
// }

// /**
//  * Calculate difference in days between two dates
//  * @param date1 - Earlier date
//  * @param date2 - Later date
//  * @returns Number of days difference
//  */
// function getDaysDifference(date1: Date, date2: Date): number {
//   // Reset time to midnight for accurate day calculation
//   const d1 = new Date(date1.getFullYear(), date1.getMonth(), date1.getDate())
//   const d2 = new Date(date2.getFullYear(), date2.getMonth(), date2.getDate())
  
//   const timeDifference = d2.getTime() - d1.getTime()
//   const daysDiff = Math.floor(timeDifference / (1000 * 60 * 60 * 24))
  
//   console.log('📊 Date calculation:', {
//     date1: d1.toISOString().split('T')[0],
//     date2: d2.toISOString().split('T')[0],
//     timeDifference,
//     daysDiff
//   })
  
//   return daysDiff
// }

// /**
//  * Format streak message for UI display
//  * @param result - Streak calculation result
//  * @returns Formatted message and emoji
//  */
// export function getStreakMessage(result: StreakUpdateResult): { message: string; emoji: string } {
//   if (result.isNewStreak && !result.isStreakBroken) {
//     return {
//       message: "Welcome! Your journey begins today!",
//       emoji: "🎉"
//     }
//   }

//   if (result.isStreakBroken) {
//     return {
//       message: "Don't worry, every expert was once a beginner. Starting fresh!",
//       emoji: "💪"
//     }
//   }

//   if (result.isNewRecord) {
//     return {
//       message: "New personal record! You're on fire!",
//       emoji: "🏆"
//     }
//   }

//   if (result.current_streak >= 7) {
//     return {
//       message: "Amazing consistency! Keep the momentum going!",
//       emoji: "🔥"
//     }
//   }

//   return {
//     message: "Great work! Keep up the consistency!",
//     emoji: "⭐"
//   }
// }

// /**
//  * Get streak color based on current streak
//  * @param currentStreak - Current streak count
//  * @returns Tailwind color classes
//  */
// export function getStreakColor(currentStreak: number): string {
//   if (currentStreak >= 30) return "from-purple-500 to-pink-600"
//   if (currentStreak >= 14) return "from-orange-500 to-red-600"
//   if (currentStreak >= 7) return "from-yellow-500 to-orange-600"
//   if (currentStreak >= 3) return "from-green-500 to-yellow-600"
//   return "from-blue-500 to-green-600"
// }

// // Updated function with better error handling and debugging
// export async function updateUserStreak(token: string, currentStreakData: StreakData | null): Promise<StreakUpdateResult> {
//   console.log('🚀 Starting streak update with data:', currentStreakData)
  
//   const streakResult = calculateStreak(currentStreakData)
  
//   console.log('📈 Calculated streak result:', streakResult)
  
//   // Only update if there's a change
//   if (streakResult.current_streak !== currentStreakData?.current_streak || 
//       streakResult.streak_date !== currentStreakData?.streak_date) {
    
//     console.log('💾 Streak changed - updating database...')
    
//     try {
//       const updateData = {
//         current_streak: streakResult.current_streak,
//         streak_date: streakResult.streak_date,
//         streak_high: streakResult.streak_high
//       }
      
//       console.log('📡 Sending API request with data:', updateData)
      
//       // Make API call to update user streak
//       const response = await apiClient.patch('/users/streak', {
//         data: updateData
//       })

//       console.log('📨 API Response:', { status: response.status, data: response.data })

//       if (response.status !== 200) {
//         if (response.status === 404) {
//           console.warn('⚠️ Streak API endpoint not found. Skipping database update.')
//           return streakResult
//         }
//         throw new Error(`API request failed with status ${response.status}`)
//       }

//       console.log('✅ Streak updated successfully in database')

//     } catch (error) {
//       console.error('❌ Failed to update streak in database:', error)
//       // Don't throw the error - return the calculated result anyway
//       // This allows the UI to show the correct streak even if API fails
//     }
//   } else {
//     console.log('🔄 No streak changes detected - skipping API call')
//   }

//   return streakResult
// }


// utils/streakCalculator.ts - Improved with better debugging

import { apiClient } from "@/lib/apiClient"

export interface StreakData {
  current_streak: number
  streak_date: string // ISO date string
  streak_high: number
}

export interface StreakUpdateResult {
  current_streak: number
  streak_date: string
  streak_high: number
  isNewStreak: boolean
  isStreakBroken: boolean
  isNewRecord: boolean
}

/**
 * Calculate and update streak based on last login date
 * @param lastStreakData - Current streak data from database
 * @returns Updated streak data with flags for UI feedback
 */
export function calculateStreak(lastStreakData: StreakData | null): StreakUpdateResult {
  const today = new Date()
  const todayString = today.toISOString().split('T')[0] // YYYY-MM-DD format
  
  console.log('🔍 Calculating streak for:', {
    lastStreakData,
    today: todayString
  })
  
  // Handle first time user (no previous streak data)
  if (!lastStreakData || !lastStreakData.streak_date) {
    console.log('✨ First time user - starting new streak')
    return {
      current_streak: 1,
      streak_date: todayString,
      streak_high: 1,
      isNewStreak: true,
      isStreakBroken: false,
      isNewRecord: true
    }
  }

  const lastStreakDate = lastStreakData.streak_date
  const daysDifference = getDaysDifference(lastStreakDate, todayString)
  
  console.log('📅 Days difference:', {
    lastStreakDate: lastStreakData.streak_date,
    today: todayString,
    daysDifference
  })

  // Same day login - no changes
  if (daysDifference === 0) {
    console.log('🔄 Same day login - no streak changes')
    return {
      current_streak: lastStreakData.current_streak,
      streak_date: lastStreakData.streak_date,
      streak_high: lastStreakData.streak_high,
      isNewStreak: false,
      isStreakBroken: false,
      isNewRecord: false
    }
  }

  // Consecutive day login (exactly 1 day difference)
  if (daysDifference === 1) {
    const newCurrentStreak = lastStreakData.current_streak + 1
    const newStreakHigh = Math.max(newCurrentStreak, lastStreakData.streak_high)
    
    console.log('🔥 Consecutive day - streak increased!', {
      oldStreak: lastStreakData.current_streak,
      newStreak: newCurrentStreak,
      newHigh: newStreakHigh
    })
    
    return {
      current_streak: newCurrentStreak,
      streak_date: todayString,
      streak_high: newStreakHigh,
      isNewStreak: false,
      isStreakBroken: false,
      isNewRecord: newCurrentStreak > lastStreakData.streak_high
    }
  }

  // Gap in days (more than 1 day) - streak broken, start new streak
  console.log('💔 Streak broken - starting fresh', {
    daysMissed: daysDifference - 1,
    oldStreak: lastStreakData.current_streak
  })
  
  return {
    current_streak: 1,
    streak_date: todayString,
    streak_high: lastStreakData.streak_high, // Keep the previous high
    isNewStreak: true,
    isStreakBroken: true,
    isNewRecord: false
  }
}

/**
 * Parse date string in local timezone to avoid UTC conversion issues
 * @param dateString - Date string in YYYY-MM-DD format
 * @returns Date object in local timezone
 */
function parseLocalDate(dateString: string): Date {
  const [year, month, day] = dateString.split('-').map(Number)
  return new Date(year, month - 1, day) // month is 0-indexed
}

/**
 * Calculate difference in days between two dates
 * @param date1 - Earlier date (can be Date object or string)
 * @param date2 - Later date (can be Date object or string)
 * @returns Number of days difference
 */
function getDaysDifference(date1: Date | string, date2: Date | string): number {
  // Parse dates in local timezone to avoid UTC conversion issues
  const d1 = typeof date1 === 'string' ? parseLocalDate(date1) : 
             new Date(date1.getFullYear(), date1.getMonth(), date1.getDate())
  const d2 = typeof date2 === 'string' ? parseLocalDate(date2) : 
             new Date(date2.getFullYear(), date2.getMonth(), date2.getDate())
  
  const timeDifference = d2.getTime() - d1.getTime()
  const daysDiff = Math.floor(timeDifference / (1000 * 60 * 60 * 24))
  
  console.log('📊 Date calculation:', {
    date1String: typeof date1 === 'string' ? date1 : date1.toISOString().split('T')[0],
    date2String: typeof date2 === 'string' ? date2 : date2.toISOString().split('T')[0],
    date1Local: d1.toISOString().split('T')[0],
    date2Local: d2.toISOString().split('T')[0],
    timeDifference,
    daysDiff
  })
  
  return daysDiff
}

/**
 * Format streak message for UI display
 * @param result - Streak calculation result
 * @returns Formatted message and emoji
 */
export function getStreakMessage(result: StreakUpdateResult): { message: string; emoji: string } {
  if (result.isNewStreak && !result.isStreakBroken) {
    return {
      message: "Welcome! Your journey begins today!",
      emoji: "🎉"
    }
  }

  if (result.isStreakBroken) {
    return {
      message: "Don't worry, every expert was once a beginner. Starting fresh!",
      emoji: "💪"
    }
  }

  if (result.isNewRecord) {
    return {
      message: "New personal record! You're on fire!",
      emoji: "🏆"
    }
  }

  if (result.current_streak >= 7) {
    return {
      message: "Amazing consistency! Keep the momentum going!",
      emoji: "🔥"
    }
  }

  return {
    message: "Great work! Keep up the consistency!",
    emoji: "⭐"
  }
}

/**
 * Get streak color based on current streak
 * @param currentStreak - Current streak count
 * @returns Tailwind color classes
 */
export function getStreakColor(currentStreak: number): string {
  if (currentStreak >= 30) return "from-purple-500 to-pink-600"
  if (currentStreak >= 14) return "from-orange-500 to-red-600"
  if (currentStreak >= 7) return "from-yellow-500 to-orange-600"
  if (currentStreak >= 3) return "from-green-500 to-yellow-600"
  return "from-blue-500 to-green-600"
}

// Updated function with better error handling and debugging
export async function updateUserStreak(token: string, currentStreakData: StreakData | null): Promise<StreakUpdateResult> {
  console.log('🚀 Starting streak update with data:', currentStreakData)
  
  const streakResult = calculateStreak(currentStreakData)
  
  console.log('📈 Calculated streak result:', streakResult)
  
  // Only update if there's a change
  if (streakResult.current_streak !== currentStreakData?.current_streak || 
      streakResult.streak_date !== currentStreakData?.streak_date) {
    
    console.log('💾 Streak changed - updating database...')
    
    try {
      const updateData = {
        current_streak: streakResult.current_streak,
        streak_date: streakResult.streak_date,
        streak_high: streakResult.streak_high
      }
      
      console.log('📡 Sending API request with data:', updateData)
      
      // Make API call to update user streak
      const response = await apiClient.patch('/users/streak', {
        data: updateData
      })

      console.log('📨 API Response:', { status: response.status, data: response.data })

      if (response.status !== 200) {
        if (response.status === 404) {
          console.warn('⚠️ Streak API endpoint not found. Skipping database update.')
          return streakResult
        }
        throw new Error(`API request failed with status ${response.status}`)
      }

      console.log('✅ Streak updated successfully in database')

    } catch (error) {
      console.error('❌ Failed to update streak in database:', error)
      // Don't throw the error - return the calculated result anyway
      // This allows the UI to show the correct streak even if API fails
    }
  } else {
    console.log('🔄 No streak changes detected - skipping API call')
  }

  return streakResult
}