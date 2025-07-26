'use client'

import { useState, useEffect, useMemo } from 'react'
import { Search, GraduationCap } from 'lucide-react'
import SchoolCard from '@/components/Schools/SchoolCard'
import { schoolsService } from '@/services/schoolsService'
import { College, PrepSchool } from '@/types/schools'
import { useAuth } from '@/contexts/AuthContext'

export default function SchoolsBrowsePage() {
  const { user } = useAuth()
  const [schoolType, setSchoolType] = useState<'college' | 'prep-school'>('college')
  const [colleges, setColleges] = useState<College[]>([])
  const [prepSchools, setPrepSchools] = useState<PrepSchool[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingScores, setLoadingScores] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  
  // Fetch schools data
  useEffect(() => {
    const fetchSchools = async () => {
      setLoading(true)
      try {
        if (schoolType === 'college' && colleges.length === 0) {
          // First load without scores for speed
          const response = await schoolsService.getColleges(false)
          setColleges(response.colleges.sort((a, b) => a.usNewsRanking - b.usNewsRanking))
          
          // Then fetch with scores if user is authenticated
          if (user) {
            setLoadingScores(true)
            const responseWithScores = await schoolsService.getColleges(true)
            setColleges(responseWithScores.colleges.sort((a, b) => a.usNewsRanking - b.usNewsRanking))
            setLoadingScores(false)
          }
        } else if (schoolType === 'prep-school' && prepSchools.length === 0) {
          // First load without scores for speed
          const response = await schoolsService.getPrepSchools(false)
          setPrepSchools(response.prepSchools.sort((a, b) => a.nicheRanking - b.nicheRanking))
          
          // Then fetch with scores if user is authenticated
          if (user) {
            setLoadingScores(true)
            const responseWithScores = await schoolsService.getPrepSchools(true)
            setPrepSchools(responseWithScores.prepSchools.sort((a, b) => a.nicheRanking - b.nicheRanking))
            setLoadingScores(false)
          }
        }
      } catch (error) {
        console.error('Error fetching schools:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchSchools()
  }, [schoolType, colleges.length, prepSchools.length, user])
  
  // Filter and sort schools based on search
  const filteredSchools = useMemo(() => {
    const schools = schoolType === 'college' ? colleges : prepSchools
    
    if (!searchQuery) return schools
    
    return schools.filter(school => 
      school.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [schoolType, colleges, prepSchools, searchQuery])
  
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Hero Section - Browse Schools */}
      <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 rounded-3xl p-8 text-white shadow-xl">
        <div className="flex items-center gap-3 mb-4">
          <GraduationCap size={32} className="text-white/90" />
          <h1 className="text-3xl font-bold">Browse Top Schools</h1>
        </div>
        
        <p className="text-white/90 text-lg mb-6">
          Explore colleges and prep schools with personalized acceptance predictions
        </p>
        
        {/* School Type Toggle - Inside Hero */}
        <div className="flex justify-center">
          <div className="inline-flex items-center space-x-1 p-1 bg-white/20 backdrop-blur-sm rounded-lg">
            <button
              onClick={() => setSchoolType('college')}
              className={`px-8 py-3 rounded-md text-sm font-medium transition-all ${
                schoolType === 'college'
                  ? 'bg-white text-purple-600 shadow-sm'
                  : 'text-white hover:bg-white/10'
              }`}
            >
              Colleges
            </button>
            <button
              onClick={() => setSchoolType('prep-school')}
              className={`px-8 py-3 rounded-md text-sm font-medium transition-all ${
                schoolType === 'prep-school'
                  ? 'bg-white text-purple-600 shadow-sm'
                  : 'text-white hover:bg-white/10'
              }`}
            >
              Prep Schools
            </button>
          </div>
        </div>
      </div>
      
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        <input
          type="text"
          placeholder={`Search ${schoolType === 'college' ? 'colleges' : 'prep schools'} by name...`}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-6 py-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-base"
        />
      </div>
      
      {/* Results Section */}
      {loading ? (
        <div className="flex justify-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>
      ) : filteredSchools.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 dark:bg-gray-800 rounded-xl">
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            {searchQuery 
              ? `No ${schoolType === 'college' ? 'colleges' : 'prep schools'} found matching "${searchQuery}"`
              : `No ${schoolType === 'college' ? 'colleges' : 'prep schools'} available.`
            }
          </p>
        </div>
      ) : (
        <>
          {/* User scores loading indicator */}
          {loadingScores && (
            <div className="mb-4 text-center">
              <p className="text-sm text-purple-600 animate-pulse">
                Calculating your personalized acceptance rates...
              </p>
            </div>
          )}
          
          {/* Schools Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredSchools.map((school) => (
              <SchoolCard
                key={school.id}
                school={school}
                type={schoolType}
                loadingScores={loadingScores}
              />
            ))}
          </div>
          
          {/* Results count */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Showing {filteredSchools.length} {schoolType === 'college' ? 'colleges' : 'prep schools'}
              {searchQuery && ` matching "${searchQuery}"`}
            </p>
          </div>
        </>
      )}
    </div>
  )
}