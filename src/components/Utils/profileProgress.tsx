// utils/profileProgress.ts
export interface ProfileField {
    field: string
    label: string
    weight: number
    isCompleted: (user: any) => boolean
  }
  
  export const PROFILE_FIELDS: ProfileField[] = [
    {
      field: 'email',
      label: 'Email',
      weight: 16.67,
      isCompleted: (user) => Boolean(user?.email?.trim())
    },
    {
      field: 'username', 
      label: 'Username',
      weight: 16.67,
      isCompleted: (user) => Boolean(user?.username?.trim())
    },
    {
      field: 'bio',
      label: 'Bio',
      weight: 16.67,
      isCompleted: (user) => Boolean(user?.bio?.trim())
    },
    {
      field: 'avatar',
      label: 'Profile Picture',
      weight: 16.67,
      isCompleted: (user) => Boolean(user?.avatar?.trim() && user.avatar !== '/placeholder.svg')
    },
    {
      field: 'sat_score',
      label: 'SAT Score',
      weight: 16.67,
      isCompleted: (user) => Boolean(user?.sat_score && user.sat_score > 0)
    },
    {
      field: 'act_score',
      label: 'ACT Score', 
      weight: 16.65, // Slightly different to make total 100%
      isCompleted: (user) => Boolean(user?.act_score && user.act_score > 0)
    }
  ]
  
  export function calculateProfileProgress(user: any): {
    percentage: number
    completedFields: number
    totalFields: number
    missingFields: ProfileField[]
  } {
    if (!user) {
      return {
        percentage: 0,
        completedFields: 0,
        totalFields: PROFILE_FIELDS.length,
        missingFields: PROFILE_FIELDS
      }
    }
  
    const completedFields = PROFILE_FIELDS.filter(field => field.isCompleted(user))
    const missingFields = PROFILE_FIELDS.filter(field => !field.isCompleted(user))
    
    const totalWeight = completedFields.reduce((sum, field) => sum + field.weight, 0)
    const percentage = Math.round(totalWeight)
  
    return {
      percentage,
      completedFields: completedFields.length,
      totalFields: PROFILE_FIELDS.length,
      missingFields
    }
  }
  
  export function getNextProfileStep(user: any): ProfileField | null {
    const missingFields = PROFILE_FIELDS.filter(field => !field.isCompleted(user))
    return missingFields.length > 0 ? missingFields[0] : null
  }
  
  // Progress badge component
  export function ProfileProgressBadge({ 
    percentage, 
    completedFields, 
    totalFields,
    showDetails = false 
  }: {
    percentage: number
    completedFields: number
    totalFields: number
    showDetails?: boolean
  }) {
    const getProgressColor = (percentage: number) => {
      if (percentage >= 80) return 'text-green-700 bg-green-100 dark:bg-green-900/30 dark:text-green-300'
      if (percentage >= 60) return 'text-blue-700 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300'
      if (percentage >= 40) return 'text-yellow-700 bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-300'
      return 'text-red-700 bg-red-100 dark:bg-red-900/30 dark:text-red-300'
    }
  
    return (
      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${getProgressColor(percentage)}`}>
        <div className="w-4 h-4 relative">
          <svg className="w-4 h-4 transform -rotate-90" viewBox="0 0 16 16">
            <circle
              cx="8"
              cy="8"
              r="6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              opacity="0.3"
            />
            <circle
              cx="8"
              cy="8"
              r="6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeDasharray={`${(percentage / 100) * 37.7} 37.7`}
              strokeLinecap="round"
            />
          </svg>
        </div>
        <span>{percentage}%</span>
        {showDetails && (
          <span className="text-xs opacity-75">
            ({completedFields}/{totalFields})
          </span>
        )}
      </div>
    )
  }
  
  // Progress completion suggestions
  export function ProfileCompletionSuggestions({ missingFields }: { missingFields: ProfileField[] }) {
    if (missingFields.length === 0) {
      return (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-green-100 dark:bg-green-900/50 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <h4 className="font-medium text-green-800 dark:text-green-200">Profile Complete!</h4>
              <p className="text-sm text-green-600 dark:text-green-400">Your profile is 100% complete.</p>
            </div>
          </div>
        </div>
      )
    }
  
    return (
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">Complete Your Profile</h4>
        <p className="text-sm text-blue-600 dark:text-blue-400 mb-3">
          Add the following to reach 100% completion:
        </p>
        <div className="space-y-2">
          {missingFields.map((field) => (
            <div key={field.field} className="flex items-center gap-2 text-sm">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <span className="text-blue-700 dark:text-blue-300">{field.label}</span>
              <span className="text-blue-500 dark:text-blue-400">+{Math.round(field.weight)}%</span>
            </div>
          ))}
        </div>
      </div>
    )
  }