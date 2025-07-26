'use client'

import { useRouter } from 'next/navigation'
import { College, PrepSchool } from '@/types/schools'

interface SchoolCardProps {
  school: College | PrepSchool
  type: 'college' | 'prep-school'
  loadingScores?: boolean
}

export default function SchoolCard({ school, type, loadingScores = false }: SchoolCardProps) {
  const router = useRouter()
  
  const isCollege = (school: College | PrepSchool): school is College => {
    return 'usNewsRanking' in school
  }
  
  const isPrepSchool = (school: College | PrepSchool): school is PrepSchool => {
    return 'nicheRanking' in school
  }
  
  const getRanking = () => {
    if (isCollege(school)) {
      return school.usNewsRanking
    }
    return (school as PrepSchool).nicheRanking
  }
  
  const handleClick = () => {
    router.push(`/schools/${type}/${school.id}`)
  }
  
  return (
    <div
      onClick={handleClick}
      className="group relative bg-white rounded-xl p-6 shadow-sm border border-gray-200 cursor-pointer transition-all duration-200 hover:shadow-xl hover:-translate-y-1 hover:border-purple-200"
    >
      {/* Ranking badge */}
      <div className="absolute top-4 right-4 bg-gradient-to-br from-purple-500 to-pink-500 text-white px-3 py-1 rounded-full text-sm font-bold">
        #{getRanking()}
      </div>
      
      {/* School name */}
      <h3 className="text-lg font-semibold text-gray-900 mb-3 pr-12">
        {school.name}
      </h3>
      
      {/* Location */}
      <p className="text-sm text-gray-600 mb-4">
        {school.city}, {school.state}
      </p>
      
      {/* Stats */}
      <div className="space-y-3">
        {/* Acceptance rate */}
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">Acceptance Rate</span>
          <span className="text-sm font-semibold text-gray-900">
            {school.acceptanceRate}%
          </span>
        </div>
        
        {/* Student-Teacher Ratio (for prep schools) or Student-Faculty Ratio (for colleges) */}
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">
            {isCollege(school) ? 'Student-Faculty' : 'Student-Teacher'}
          </span>
          <span className="text-sm font-semibold text-gray-900">
            {isCollege(school) ? school.studentFacultyRatio : (school as PrepSchool).studentTeacherRatio}
          </span>
        </div>
        
        {/* Class Size (for prep schools) or Enrollment (for colleges) */}
        {isPrepSchool(school) ? (
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">Avg Class Size</span>
            <span className="text-sm font-semibold text-gray-900">
              {school.averageClassSize}
            </span>
          </div>
        ) : (
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">Undergrads</span>
            <span className="text-sm font-semibold text-gray-900">
              {(school as College).undergradEnrollment.toLocaleString()}
            </span>
          </div>
        )}
      </div>
      
      {/* User fit score section - always show */}
      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">Your Fit Score</span>
          {school.userScores ? (
            <span className="text-lg font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              {school.userScores.fitScore}%
            </span>
          ) : (
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-purple-600"></div>
              <span className="text-sm text-gray-400">Loading...</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}