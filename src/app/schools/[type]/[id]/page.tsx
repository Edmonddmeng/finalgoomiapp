'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, TrendingUp, Users } from 'lucide-react'
import { schoolsService } from '@/services/schoolsService'
import { College, PrepSchool } from '@/types/schools'
import { useAuth } from '@/contexts/AuthContext'

export default function SchoolDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const [school, setSchool] = useState<College | PrepSchool | null>(null)
  const [loading, setLoading] = useState(true)
  
  const type = params.type as 'college' | 'prep-school'
  const id = params.id as string
  
  useEffect(() => {
    const fetchSchool = async () => {
      try {
        setLoading(true)
        if (type === 'college') {
          const data = await schoolsService.getCollege(id)
          setSchool(data)
        } else {
          const data = await schoolsService.getPrepSchool(id)
          setSchool(data)
        }
      } catch (error) {
        console.error('Error fetching school:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchSchool()
  }, [type, id])
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }
  
  if (!school) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">School not found</p>
      </div>
    )
  }
  
  const isCollege = (school: College | PrepSchool): school is College => {
    return 'usNewsRanking' in school
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Back button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to schools
        </button>
        
        {/* School header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{school.name}</h1>
              <p className="text-lg text-gray-600">{school.city}, {school.state}</p>
            </div>
            <div className="text-right">
              <div className="bg-gray-100 px-4 py-2 rounded-lg">
                <p className="text-sm text-gray-600">
                  {isCollege(school) ? 'US News Ranking' : 'Niche Ranking'}
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  #{isCollege(school) ? school.usNewsRanking : school.nicheRanking}
                </p>
              </div>
            </div>
          </div>
          
          {/* Description */}
          <p className="mt-6 text-gray-700 leading-relaxed">{school.description}</p>
        </div>
        
        {/* Acceptance Rate Comparison - Striking Visual */}
        {school.userScores && (
          <div className="bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 rounded-2xl p-8 mb-6 text-white">
            <h2 className="text-2xl font-bold mb-6">Your Acceptance Outlook</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* General Acceptance Rate */}
              <div className="text-center">
                <div className="mb-3">
                  <Users className="h-8 w-8 mx-auto mb-2 opacity-80" />
                  <p className="text-sm opacity-90">General Acceptance Rate</p>
                </div>
                <div className="relative">
                  <svg className="w-32 h-32 mx-auto transform -rotate-90">
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="rgba(255,255,255,0.2)"
                      strokeWidth="16"
                      fill="none"
                    />
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="rgba(255,255,255,0.8)"
                      strokeWidth="16"
                      fill="none"
                      strokeDasharray={`${2 * Math.PI * 56 * school.acceptanceRate / 100} ${2 * Math.PI * 56}`}
                      className="transition-all duration-1000 ease-out"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-3xl font-bold">{school.acceptanceRate}%</span>
                  </div>
                </div>
              </div>
              
              {/* Your Acceptance Rate */}
              <div className="text-center">
                <div className="mb-3">
                  <TrendingUp className="h-8 w-8 mx-auto mb-2 opacity-80" />
                  <p className="text-sm opacity-90">Your Acceptance Rate</p>
                </div>
                <div className="relative">
                  <svg className="w-32 h-32 mx-auto transform -rotate-90">
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="rgba(255,255,255,0.2)"
                      strokeWidth="16"
                      fill="none"
                    />
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="#10B981"
                      strokeWidth="16"
                      fill="none"
                      strokeDasharray={`${2 * Math.PI * 56 * school.userScores.acceptanceRate / 100} ${2 * Math.PI * 56}`}
                      className="transition-all duration-1000 ease-out"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-3xl font-bold text-green-300">{school.userScores.acceptanceRate}%</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Comparison Message */}
            <div className="mt-6 text-center">
              {school.userScores.acceptanceRate > school.acceptanceRate ? (
                <p className="text-lg">
                  🎉 Your acceptance rate is <span className="font-bold text-green-300">
                    {(school.userScores.acceptanceRate / school.acceptanceRate).toFixed(1)}x higher
                  </span> than average!
                </p>
              ) : (
                <p className="text-lg">
                  Your personalized acceptance rate based on your profile
                </p>
              )}
            </div>
            
            {/* Fit Score */}
            <div className="mt-6 bg-white/10 backdrop-blur rounded-lg p-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">Overall Fit Score</span>
                <span className="text-2xl font-bold">{school.userScores.fitScore}%</span>
              </div>
              {school.userScores.reasons && school.userScores.reasons.length > 0 && (
                <div className="mt-3 space-y-1">
                  {school.userScores.reasons.map((reason, index) => (
                    <p key={index} className="text-xs opacity-90">• {reason}</p>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Key stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <p className="text-sm text-gray-600 mb-1">Acceptance Rate</p>
            <p className="text-2xl font-bold text-gray-900">{school.acceptanceRate}%</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <p className="text-sm text-gray-600 mb-1">Test Range</p>
            <p className="text-lg font-semibold text-gray-900">
              {isCollege(school) ? `SAT: ${school.satRange}` : `SSAT: ${school.ssatRange}`}
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <p className="text-sm text-gray-600 mb-1">
              {isCollege(school) ? 'GPA Range' : 'GPA Requirement'}
            </p>
            <p className="text-lg font-semibold text-gray-900">
              {isCollege(school) ? school.gpaRange : school.gpaRequirement}
            </p>
          </div>
        </div>
        
        {/* Detailed sections */}
        <div className="space-y-6">
          {/* Admissions */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Admissions</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Total Applicants</p>
                <p className="font-medium text-gray-900">{school.totalApplicants.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Admitted</p>
                <p className="font-medium text-gray-900">{school.totalAdmitted.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Enrolled</p>
                <p className="font-medium text-gray-900">{school.totalEnrolled.toLocaleString()}</p>
              </div>
              {isCollege(school) && (
                <>
                  <div>
                    <p className="text-sm text-gray-600">Early Acceptance Rate</p>
                    <p className="font-medium text-gray-900">{school.earlyAcceptanceRate}%</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Regular Acceptance Rate</p>
                    <p className="font-medium text-gray-900">{school.regularAcceptanceRate}%</p>
                  </div>
                </>
              )}
            </div>
          </div>
          
          {/* Costs */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Costs & Financial Aid</h2>
            <div className="grid grid-cols-2 gap-4">
              {isCollege(school) ? (
                <>
                  <div>
                    <p className="text-sm text-gray-600">Tuition</p>
                    <p className="font-medium text-gray-900">${school.tuition.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Room & Board</p>
                    <p className="font-medium text-gray-900">${school.roomAndBoard.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Cost</p>
                    <p className="font-medium text-gray-900">${school.totalCostOfAttendance.toLocaleString()}</p>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <p className="text-sm text-gray-600">Boarding Tuition</p>
                    <p className="font-medium text-gray-900">${school.boardingTuition.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Day Tuition</p>
                    <p className="font-medium text-gray-900">${school.dayTuition.toLocaleString()}</p>
                  </div>
                </>
              )}
              <div>
                <p className="text-sm text-gray-600">Average Financial Aid</p>
                <p className="font-medium text-gray-900">${school.averageFinancialAid.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">% Receiving Aid</p>
                <p className="font-medium text-gray-900">
                  {isCollege(school) ? school.percentReceivingAid : school.percentOnFinancialAid}%
                </p>
              </div>
            </div>
          </div>
          
          {/* Academic Programs */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              {isCollege(school) ? 'Best Majors' : 'Best Programs'}
            </h2>
            <div className="flex flex-wrap gap-2">
              {(isCollege(school) ? school.bestMajors : school.bestPrograms).map((program, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                >
                  {program}
                </span>
              ))}
            </div>
          </div>
          
          {/* Special Programs */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Special Programs</h2>
            <ul className="space-y-2">
              {school.specialPrograms.map((program, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <span className="text-gray-700">{program}</span>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Student Body */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Student Body</h2>
            <div className="grid grid-cols-2 gap-4">
              {isCollege(school) ? (
                <>
                  <div>
                    <p className="text-sm text-gray-600">Undergraduate Enrollment</p>
                    <p className="font-medium text-gray-900">{school.undergradEnrollment.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Graduate Enrollment</p>
                    <p className="font-medium text-gray-900">{school.gradEnrollment.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Student-Faculty Ratio</p>
                    <p className="font-medium text-gray-900">{school.studentFacultyRatio}</p>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <p className="text-sm text-gray-600">Total Enrollment</p>
                    <p className="font-medium text-gray-900">{school.enrollment.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Student-Teacher Ratio</p>
                    <p className="font-medium text-gray-900">{school.studentTeacherRatio}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Average Class Size</p>
                    <p className="font-medium text-gray-900">{school.averageClassSize}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">International Students</p>
                    <p className="font-medium text-gray-900">{school.internationStudentPercentage}%</p>
                  </div>
                </>
              )}
            </div>
          </div>
          
          {/* Prep school specific - College Matriculation */}
          {!isCollege(school) && school.collegeMatriculation && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">College Matriculation</h2>
              <div className="space-y-2">
                {school.collegeMatriculation.map((item, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-gray-700">{item.college}</span>
                    <span className="font-medium text-gray-900">{item.percentage}%</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}