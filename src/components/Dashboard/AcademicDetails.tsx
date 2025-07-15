"use client"
import { useState, useMemo, useEffect } from "react"
import { ChevronLeft, BookOpen, Award, BarChart2, ChevronDown, Calendar, Plus, Edit2, Trash2, TrendingUp, Target, AlertCircle, Sparkles, Save, Lightbulb, Loader2 } from "lucide-react"
import { categorizeSubject, subjectCategoryNames, subjectCategoryIcons, type SubjectCategory } from "@/lib/subjectHelpers"
import { useAuth } from "@/contexts/AuthContext"
import { 
  useAcademicTerms, 
  useCourses, 
  useCreateCourse, 
  useUpdateCourse, 
  useDeleteCourse,
  useAcademicInsights,
  useCreateInsight,
  useGPAStats,
  useSubjectAnalysis,
  useCreateTerm
} from "@/hooks/useAcademics"
import { useDashboardStats } from "@/hooks/useUser"
import type { Academic, CreateCourseRequest, UpdateCourseRequest } from "@/types/academic"

interface AcademicDetailsProps {
  onBack: () => void
}

export function AcademicDetails({ onBack }: AcademicDetailsProps) {
  const { user } = useAuth()
  const [showAddCourse, setShowAddCourse] = useState(false)
  const [editingCourse, setEditingCourse] = useState<Academic | null>(null)
  const [selectedTermIndex, setSelectedTermIndex] = useState(-1)
  const [showCreateTerm, setShowCreateTerm] = useState(false)
  const [newTermData, setNewTermData] = useState({
    name: 'Fall',
    year: new Date().getFullYear(),
    startDate: '',
    endDate: ''
  })
  const [currentInsight, setCurrentInsight] = useState("")

  // API hooks
  const { data: terms, isLoading: termsLoading, refetch: refetchTerms } = useAcademicTerms()
  const { data: gpaStats } = useGPAStats()
  const { data: dashboardStats } = useDashboardStats()
  const { data: insights, isLoading: insightsLoading } = useAcademicInsights()
  const { data: subjectAnalysisData, isLoading: subjectAnalysisLoading } = useSubjectAnalysis()

  // Always use sorted terms for display and selection
  const sortedTerms = useMemo(() => {
    console.log('terms', terms)
    if (!terms) return []
    return [...terms].sort((a, b) => {
      const dateA = new Date(a.startDate)
      const dateB = new Date(b.startDate)
      return dateB.getTime() - dateA.getTime()
    })
  }, [terms])

  // Ensure selectedTermIndex is valid when sortedTerms changes
  useEffect(() => {
    if (sortedTerms.length === 0) {
      setSelectedTermIndex(0)
    } else if (selectedTermIndex >= sortedTerms.length) {
      setSelectedTermIndex(0)
    }
  }, [sortedTerms.length])

  // Selected term for filtering courses
  const selectedTerm = selectedTermIndex === -1 ? null : sortedTerms[selectedTermIndex]
  const { data: courses, isLoading: coursesLoading, refetch: refetchCourses } = useCourses(
    selectedTerm?.id, // This will be undefined when selectedTermIndex is -1
    undefined // category filter
  )
  // Mutations
  const createCourseMutation = useCreateCourse()
  const updateCourseMutation = useUpdateCourse()
  const deleteCourseMutation = useDeleteCourse()
  const createInsightMutation = useCreateInsight()
  const createTermMutation = useCreateTerm()

  // Courses for selected term
  const termAcademics = Array.isArray(courses) ? courses : []

  // Calculate GPA for selected term
  const calculateTermGPA = (academics: Academic[]) => {
    if (academics.length === 0) return 0
    const gradePoints: Record<string, number> = {
      'A+': 4.0, 'A': 4.0, 'A-': 3.7,
      'B+': 3.3, 'B': 3.0, 'B-': 2.7,
      'C+': 2.3, 'C': 2.0, 'C-': 1.7,
      'D+': 1.3, 'D': 1.0, 'D-': 0.7,
      'F': 0.0
    }
    let totalPoints = 0
    let totalCredits = 0
    academics.forEach(academic => {
      const points = gradePoints[academic.grade] || 0
      totalPoints += points * academic.credits
      totalCredits += academic.credits
    })
    return totalCredits > 0 ? totalPoints / totalCredits : 0
  }

  const termGPA = selectedTerm ? calculateTermGPA(termAcademics) : calculateTermGPA(termAcademics)

  const overallGPA = gpaStats?.cumulative || dashboardStats?.currentGPA || 0
  const gpaColor = overallGPA >= 3.5 ? "text-green-600" : overallGPA >= 3.0 ? "text-blue-600" : "text-yellow-600"
  const termGpaColor = termGPA >= 3.5 ? "text-green-600" : termGPA >= 3.0 ? "text-blue-600" : "text-yellow-600"

  // Always use the latest sortedTerms for the default termId
  const [newCourse, setNewCourse] = useState<Partial<Academic>>({
    subject: "",
    grade: "A",
    credits: 3,
    termId: "",
    category: undefined
  })

  // When sortedTerms changes, update newCourse.termId if not editing
  useEffect(() => {
    if (!editingCourse && sortedTerms.length > 0) {
      setNewCourse(prev => ({
        ...prev,
        termId: prev.termId && sortedTerms.some(t => t.id === prev.termId)
          ? prev.termId
          : sortedTerms[0].id
      }))
    }
  }, [sortedTerms, editingCourse])

  const handleCreateTerm = async () => {
    if (!newTermData.name || !newTermData.startDate || !newTermData.endDate) {
      alert('Please fill out all term fields.')
      return
    }
    try {
      const newTerm = await createTermMutation.mutateAsync({
        name: newTermData.name,
        year: newTermData.year,
        startDate: newTermData.startDate,
        endDate: newTermData.endDate,
        isCurrent: false
      })
      await refetchTerms()
      setShowCreateTerm(false)
      setNewTermData({
        name: 'Fall',
        year: new Date().getFullYear(),
        startDate: '',
        endDate: ''
      })
      // After refetch, select the new term in the dropdown
      setTimeout(() => {
        // Find the new term in the latest sortedTerms
        const updatedTerms = [...(terms || []), newTerm].sort((a, b) => {
          const dateA = new Date(a.startDate)
          const dateB = new Date(b.startDate)
          return dateB.getTime() - dateA.getTime()
        })
        const idx = updatedTerms.findIndex(t => t.id === newTerm.id)
        if (idx >= 0) {
          setSelectedTermIndex(idx)
          setNewCourse(prev => ({ ...prev, termId: newTerm.id }))
        }
      }, 200)
    } catch (error: any) {
      alert(`Failed to create term: ${error?.response?.data?.message || error.message || 'Unknown error'}`)
    }
  }

  const handleAddCourse = async () => {
    if (!newCourse.subject?.trim()) return
    const termId = newCourse.termId || sortedTerms[selectedTermIndex]?.id
    if (!termId) {
      alert('Please select or create a term first')
      return
    }
    try {
      const courseData: CreateCourseRequest = {
        termId: termId,
        subject: newCourse.subject.trim(),
        grade: newCourse.grade || "A",
        credits: newCourse.credits || 3,
        category: newCourse.category || categorizeSubject(newCourse.subject.trim())
      }
      await createCourseMutation.mutateAsync(courseData)
      await refetchCourses()
      setNewCourse({
        subject: "",
        grade: "A",
        credits: 3,
        termId: sortedTerms[selectedTermIndex]?.id || (sortedTerms[0]?.id || ""),
        category: undefined
      })
      setShowAddCourse(false)
    } catch (error) {
      alert('Failed to add course. Please try again.')
    }
  }

  const handleUpdateCourse = async () => {
    if (!editingCourse || !newCourse.subject?.trim()) return
    try {
      const updateData: UpdateCourseRequest = {
        subject: newCourse.subject.trim(),
        grade: newCourse.grade || "A",
        credits: newCourse.credits || 3,
        category: newCourse.category || categorizeSubject(newCourse.subject.trim())
      }
      await updateCourseMutation.mutateAsync({ id: editingCourse.id, data: updateData })
      await refetchCourses()
      setEditingCourse(null)
      setNewCourse({
        subject: "",
        grade: "A",
        credits: 3,
        termId: sortedTerms[selectedTermIndex]?.id || (sortedTerms[0]?.id || ""),
        category: undefined
      })
    } catch (error) {
      alert('Failed to update course.')
    }
  }

  const handleDeleteCourse = async (courseId: string) => {
    try {
      await deleteCourseMutation.mutateAsync(courseId)
      await refetchCourses()
    } catch (error) {
      alert('Failed to delete course.')
    }
  }

  const handleEditCourse = (course: Academic) => {
    setEditingCourse(course)
    setNewCourse({
      subject: course.subject,
      grade: course.grade,
      credits: course.credits,
      termId: course.termId,
      category: course.category || categorizeSubject(course.subject)
    })
    setShowAddCourse(true)
  }

  const handleSaveInsight = async () => {
    if (currentInsight.trim()) {
      try {
        await createInsightMutation.mutateAsync(currentInsight)
        setCurrentInsight("")
      } catch (error) {
        // ignore
      }
    }
  }

  // Use API-provided subject analysis
  const analysis = useMemo(() => {
    if (!subjectAnalysisData || subjectAnalysisData.length === 0) return null
    const subjectMetrics: Record<SubjectCategory, any> = {} as Record<SubjectCategory, any>
    subjectAnalysisData.forEach(item => {
      subjectMetrics[item.category] = item
    })
    const categories = Object.entries(subjectMetrics)
    const bestSubject = categories
      .sort((a, b) => b[1].avgGPA - a[1].avgGPA)
      .slice(0, 1)
    const mostConsistent = categories
      .filter(([_, metrics]) => metrics.courses.length >= 2)
      .sort((a, b) => a[1].consistency - b[1].consistency)
      .slice(0, 1)
    const needsImprovement = categories
      .filter(([_, metrics]) => metrics.avgGPA < 3.0)
      .sort((a, b) => a[1].avgGPA - b[1].avgGPA)
      .slice(0, 1)
    const bestImprovement = categories
      .filter(([_, metrics]) => metrics.termGPAs?.length >= 2 && metrics.trend > 0)
      .sort((a, b) => b[1].trend - a[1].trend)
      .slice(0, 1)
    return {
      subjectMetrics,
      bestSubject,
      mostConsistent,
      needsImprovement,
      bestImprovement
    }
  }, [subjectAnalysisData])

  if (termsLoading || !user) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="animate-spin text-gray-400" size={32} />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors font-medium"
      >
        <ChevronLeft size={20} />
        <span>Back to Dashboard</span>
      </button>

      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-slate-700">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Academic Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-slate-700/50 rounded-xl">
            <BarChart2 className="text-blue-500" size={32} />
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Overall GPA</p>
              <p className={`text-2xl font-bold ${gpaColor}`}>{overallGPA.toFixed(2)}</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-slate-700/50 rounded-xl">
            <BookOpen className="text-purple-500" size={32} />
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">SAT Score</p>
              <p className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                N/A
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-slate-700/50 rounded-xl">
            <Award className="text-yellow-500" size={32} />
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">AP Exams Passed</p>
              <p className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                0
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-slate-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Course Grades</h3>
          <button
            onClick={() => setShowAddCourse(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            <Plus size={16} />
            Add Course
          </button>
        </div>
        
        // Replace your Term Selector section with this cleaned up version:

{/* Term Selector */}
<div className="mb-6">
  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
    <div className="flex items-center gap-6">
      <div className="relative">
        <label className="text-sm text-gray-500 dark:text-gray-400 mb-1 block">Viewing Term</label>
        <select
          value={selectedTermIndex}
          onChange={(e) => setSelectedTermIndex(Number(e.target.value))}
          className="appearance-none bg-white dark:bg-slate-700 text-gray-900 dark:text-white font-medium pl-3 pr-10 py-2 rounded-lg border border-gray-200 dark:border-slate-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value={-1}>All Courses</option>
          {sortedTerms.map((term, index) => (
            <option key={term.id} value={index}>
              {term.name} {term.year}
            </option>
          ))}
        </select>
        <ChevronDown size={16} className="absolute right-3 top-[38px] text-gray-500 pointer-events-none" />
      </div>
      
      <div>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {selectedTerm ? "Term GPA" : "Overall GPA"}
        </p>
        <p className={`text-xl font-bold ${termGpaColor}`}>
          {termGPA.toFixed(2)}
        </p>
      </div>
      
      <div>
        <p className="text-sm text-gray-500 dark:text-gray-400">Credits</p>
        <p className="text-xl font-bold text-gray-800 dark:text-gray-200">
          {termAcademics.reduce((sum, course) => sum + course.credits, 0)}
        </p>
      </div>
    </div>
    
    <div className="flex items-center gap-2">
      <button
        onClick={() => setSelectedTermIndex(Math.max(-1, selectedTermIndex - 1))}
        disabled={selectedTermIndex === -1}
        className="p-2 rounded-lg bg-gray-200 dark:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 dark:hover:bg-slate-500 transition-colors"
      >
        <ChevronLeft size={16} />
      </button>
      <button
        onClick={() => setSelectedTermIndex(Math.min(sortedTerms.length - 1, selectedTermIndex + 1))}
        disabled={selectedTermIndex >= sortedTerms.length - 1}
        className="p-2 rounded-lg bg-gray-200 dark:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 dark:hover:bg-slate-500 transition-colors"
      >
        <ChevronLeft size={16} className="rotate-180" />
      </button>
    </div>
  </div>
</div>
        
        {/* Course List */}
        <div className="space-y-3">
          {coursesLoading ? (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="animate-spin text-gray-400" size={24} />
            </div>
          ) : termAcademics.length > 0 ? (
            termAcademics.map((academic) => (
              <div
                key={academic.id}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-700/50 rounded-lg group"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{subjectCategoryIcons[academic.category || categorizeSubject(academic.subject)]}</span>
                  <div>
                    <p className="font-medium text-gray-800 dark:text-gray-200">{academic.subject}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {academic.credits} credits • {subjectCategoryNames[academic.category || categorizeSubject(academic.subject)]}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`text-sm font-bold px-3 py-1 rounded-full ${
                      academic.grade.startsWith("A")
                        ? "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300"
                        : academic.grade.startsWith("B")
                          ? "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300"
                          : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300"
                    }`}
                  >
                    {academic.grade}
                  </span>
                  <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1 transition-opacity">
                    <button
                      onClick={() => handleEditCourse(academic)}
                      className="p-1 text-gray-500 hover:text-blue-600 transition-colors"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      onClick={() => handleDeleteCourse(academic.id)}
                      className="p-1 text-gray-500 hover:text-red-600 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <Calendar className="mx-auto text-gray-400 mb-3" size={48} />
              <p className="text-gray-500 dark:text-gray-400">No courses recorded for {selectedTerm?.name} {selectedTerm?.year}</p>
              <button
                onClick={() => setShowAddCourse(true)}
                className="mt-2 text-blue-600 dark:text-blue-400 hover:underline text-sm"
              >
                Add your first course
              </button>
            </div>
          )}
        </div>
        
        {/* Term Summary */}
        {termAcademics.length === 0 && (
  <div className="text-center py-8">
    <Calendar className="mx-auto text-gray-400 mb-3" size={48} />
    <p className="text-gray-500 dark:text-gray-400">
      {selectedTerm 
        ? `No courses recorded for ${selectedTerm.name} ${selectedTerm.year}`
        : "No courses recorded yet"
      }
    </p>
    <button
      onClick={() => setShowAddCourse(true)}
      className="mt-2 text-blue-600 dark:text-blue-400 hover:underline text-sm"
    >
      Add your first course
    </button>
  </div>
)}
{termAcademics.length > 0 && (
  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-slate-600">
    <div className="flex justify-between text-sm">
      <span className="text-gray-500 dark:text-gray-400">
        {selectedTerm ? "Term Summary" : "All Courses Summary"}
      </span>
      <span className="font-medium text-gray-800 dark:text-gray-200">
        {termAcademics.length} courses • {termAcademics.reduce((sum: number, c: Academic) => sum + c.credits, 0)} credits • {termGPA.toFixed(2)} GPA
      </span>
    </div>
  </div>
)}
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-slate-700">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">AP Exam Scores</h3>
        <div className="space-y-3">
          <p className="text-center text-gray-500 dark:text-gray-400 py-4">AP exam scores are not available in the current system.</p>
        </div>
      </div>

      {/* Subject Analysis Section */}
      {analysis && !subjectAnalysisLoading && (
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-slate-700">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Subject Performance Analysis</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Best Subject */}
            {analysis.bestSubject.length > 0 ? (
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-4 border border-green-200 dark:border-green-800">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="text-green-600 dark:text-green-400" size={20} />
                  <h4 className="font-semibold text-green-900 dark:text-green-100">Best Subject</h4>
                </div>
                {analysis.bestSubject.map(([category, metrics]) => (
                  <div key={category} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{subjectCategoryIcons[category as SubjectCategory]}</span>
                        <span className="text-lg font-medium text-gray-800 dark:text-gray-200">
                          {subjectCategoryNames[category as SubjectCategory]}
                        </span>
                      </div>
                      <span className="text-xl font-bold text-green-700 dark:text-green-300">
                        {metrics.avgGPA.toFixed(2)}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      <p>{metrics.courses.length} courses • {metrics.courses.reduce((sum: number, c: Academic) => sum + c.credits, 0)} credits</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-gray-50 dark:bg-slate-700/50 rounded-xl p-4 border border-gray-200 dark:border-slate-600 text-center">
                <Sparkles className="text-gray-400 dark:text-gray-500 mx-auto mb-2" size={24} />
                <p className="text-sm text-gray-500 dark:text-gray-400">No subject data available</p>
              </div>
            )}

            {/* Most Consistent */}
            {analysis.mostConsistent.length > 0 ? (
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
                <div className="flex items-center gap-2 mb-3">
                  <Target className="text-blue-600 dark:text-blue-400" size={20} />
                  <h4 className="font-semibold text-blue-900 dark:text-blue-100">Most Consistent</h4>
                </div>
                {analysis.mostConsistent.map(([category, metrics]) => (
                  <div key={category} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{subjectCategoryIcons[category as SubjectCategory]}</span>
                        <span className="text-lg font-medium text-gray-800 dark:text-gray-200">
                          {subjectCategoryNames[category as SubjectCategory]}
                        </span>
                      </div>
                      <div className="text-xl font-bold text-blue-700 dark:text-blue-300">
                        {metrics.avgGPA.toFixed(2)}
                      </div>
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      <p>{metrics.courses.length} courses • {metrics.courses.reduce((sum: number, c: Academic) => sum + c.credits, 0)} credits</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-gray-50 dark:bg-slate-700/50 rounded-xl p-4 border border-gray-200 dark:border-slate-600 text-center">
                <Target className="text-gray-400 dark:text-gray-500 mx-auto mb-2" size={24} />
                <p className="text-sm text-gray-500 dark:text-gray-400">Not enough data to calculate consistency</p>
              </div>
            )}

            {/* Needs Improvement */}
            {analysis.needsImprovement.length > 0 ? (
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl p-4 border border-amber-200 dark:border-amber-800">
                <div className="flex items-center gap-2 mb-3">
                  <AlertCircle className="text-amber-600 dark:text-amber-400" size={20} />
                  <h4 className="font-semibold text-amber-900 dark:text-amber-100">Needs Improvement</h4>
                </div>
                {analysis.needsImprovement.map(([category, metrics]) => (
                  <div key={category} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{subjectCategoryIcons[category as SubjectCategory]}</span>
                        <span className="text-lg font-medium text-gray-800 dark:text-gray-200">
                          {subjectCategoryNames[category as SubjectCategory]}
                        </span>
                      </div>
                      <span className="text-xl font-bold text-amber-700 dark:text-amber-300">
                        {metrics.avgGPA.toFixed(2)}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      <p>Below 3.0 GPA • {metrics.courses.length} courses</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-gray-50 dark:bg-slate-700/50 rounded-xl p-4 border border-gray-200 dark:border-slate-600 text-center">
                <AlertCircle className="text-gray-400 dark:text-gray-500 mx-auto mb-2" size={24} />
                <p className="text-sm text-gray-500 dark:text-gray-400">All subjects above 3.0 GPA</p>
              </div>
            )}

            {/* Best Improvement */}
            {analysis.bestImprovement.length > 0 ? (
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-4 border border-purple-200 dark:border-purple-800">
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp className="text-purple-600 dark:text-purple-400" size={20} />
                  <h4 className="font-semibold text-purple-900 dark:text-purple-100">Best Improvement</h4>
                </div>
                {analysis.bestImprovement.map(([category, metrics]) => (
                  <div key={category} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{subjectCategoryIcons[category as SubjectCategory]}</span>
                        <span className="text-lg font-medium text-gray-800 dark:text-gray-200">
                          {subjectCategoryNames[category as SubjectCategory]}
                        </span>
                      </div>
                      <div className="text-xl font-bold text-purple-700 dark:text-purple-300">
                        +{metrics.trend.toFixed(2)}
                      </div>
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      <p>GPA increase • {metrics.courses.length} courses tracked</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-gray-50 dark:bg-slate-700/50 rounded-xl p-4 border border-gray-200 dark:border-slate-600 text-center">
                <TrendingUp className="text-gray-400 dark:text-gray-500 mx-auto mb-2" size={24} />
                <p className="text-sm text-gray-500 dark:text-gray-400">Not enough data to track improvement</p>
              </div>
            )}
          </div>

          {/* Subject Breakdown */}
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-slate-600">
            <h4 className="font-medium text-gray-900 dark:text-white mb-4">All Subjects Overview</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {Object.entries(analysis.subjectMetrics).map(([category, metrics]) => (
                <div
                  key={category}
                  className="bg-gray-50 dark:bg-slate-700/50 rounded-lg p-3 text-center"
                >
                  <div className="text-2xl mb-1">{subjectCategoryIcons[category as SubjectCategory]}</div>
                  <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {subjectCategoryNames[category as SubjectCategory]}
                  </p>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">
                    {metrics.avgGPA.toFixed(2)}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {metrics.courses.length} {metrics.courses.length === 1 ? 'course' : 'courses'}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Daily Academic Insights */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-slate-700">
        <div className="flex items-center gap-3 mb-4">
          <Lightbulb className="text-yellow-600 dark:text-yellow-400" size={24} />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Daily Academic Insights</h3>
        </div>
        
        <div className="space-y-4">
          <div className="flex gap-3">
            <textarea
              value={currentInsight}
              onChange={(e) => setCurrentInsight(e.target.value)}
              placeholder="Record your thoughts, study strategies, or reflections about your academic progress..."
              className="w-full p-3 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-purple-500"
              rows={3}
            />
            <button
              onClick={handleSaveInsight}
              disabled={!currentInsight.trim() || createInsightMutation.isLoading}
              className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 disabled:bg-gray-300 dark:disabled:bg-gray-600 transition-colors flex items-center gap-2 h-fit"
            >
              {createInsightMutation.isLoading ? (
                <Loader2 className="animate-spin" size={16} />
              ) : (
                <Save size={16} />
              )}
              Save
            </button>
          </div>
          
          {insights && insights.length > 0 && (
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {insights
                .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                .map((insight) => (
                  <div key={insight.id} className="p-3 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
                    <p className="text-gray-800 dark:text-gray-200">{insight.content}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(insight.created_at).toLocaleString()}
                      </p>
                      {insight.type === 'ai_generated' && (
                        <span className="text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 px-2 py-0.5 rounded-full">
                          AI Generated
                        </span>
                      )}
                    </div>
                  </div>
                ))
              }
            </div>
          )}
          {(!insights || insights.length === 0) && !insightsLoading && (
            <p className="text-center text-gray-500 dark:text-gray-400 py-4">
              No insights recorded yet. Start by adding your thoughts above!
            </p>
          )}
        </div>
      </div>

      {/* Add/Edit Course Modal */}
      {showAddCourse && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  {editingCourse ? 'Edit Course' : 'Add New Course'}
                </h3>
                <button
                  onClick={() => {
                    setShowAddCourse(false)
                    setEditingCourse(null)
                    setShowCreateTerm(false)
                    setNewCourse({
                      subject: "",
                      grade: "A",
                      credits: 3,
                      termId: sortedTerms[selectedTermIndex]?.id || (sortedTerms[0]?.id || ""),
                      category: undefined
                    })
                  }}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-full transition-colors"
                >
                  <ChevronLeft size={20} className="rotate-180 text-gray-600 dark:text-gray-300" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Course Name *
                  </label>
                  <input
                    type="text"
                    value={newCourse.subject || ""}
                    onChange={(e) => setNewCourse(prev => ({ ...prev, subject: e.target.value }))}
                    placeholder="e.g., AP Calculus BC"
                    className="w-full p-3 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Grade *
                    </label>
                    <select
                      value={newCourse.grade || "A"}
                      onChange={(e) => setNewCourse(prev => ({ ...prev, grade: e.target.value }))}
                      className="w-full p-3 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="A+">A+</option>
                      <option value="A">A</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B">B</option>
                      <option value="B-">B-</option>
                      <option value="C+">C+</option>
                      <option value="C">C</option>
                      <option value="C-">C-</option>
                      <option value="D+">D+</option>
                      <option value="D">D</option>
                      <option value="D-">D-</option>
                      <option value="F">F</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Credits *
                    </label>
                    <input
                      type="number"
                      value={newCourse.credits || 3}
                      onChange={(e) => setNewCourse(prev => ({ ...prev, credits: Number(e.target.value) }))}
                      min="0.5"
                      max="6"
                      step="0.5"
                      className="w-full p-3 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Subject Category *
                  </label>
                  <select
                    value={newCourse.category || ''}
                    onChange={(e) => setNewCourse(prev => ({ ...prev, category: e.target.value as SubjectCategory || undefined }))}
                    className="w-full p-3 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="">Auto-detect from subject name</option>
                    <option value="english">English</option>
                    <option value="math">Mathematics</option>
                    <option value="science">Science</option>
                    <option value="social_studies">Social Studies/History</option>
                    <option value="art">Art</option>
                    <option value="music">Music</option>
                    <option value="physical_education">Physical Education</option>
                    <option value="foreign_language">Foreign Languages</option>
                    <option value="other">Other</option>
                  </select>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {newCourse.category ? 
                      `Selected: ${subjectCategoryNames[newCourse.category]}` : 
                      newCourse.subject ? 
                        `Auto-detected: ${subjectCategoryNames[categorizeSubject(newCourse.subject)]}` : 
                        'Category will be auto-detected based on subject name'
                    }
                  </p>
                </div>

                {!editingCourse && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Academic Term
                    </label>
                    {!showCreateTerm ? (
                      <>
                        <select
                          value={newCourse.termId || ''}
                          onChange={async (e) => {
                            if (e.target.value === 'create-new') {
                              setShowCreateTerm(true)
                            } else {
                              setNewCourse(prev => ({ ...prev, termId: e.target.value }))
                            }
                          }}
                          className="w-full p-3 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-purple-500"
                          disabled={sortedTerms.length === 0}
                        >
                          <option value="">Select a term</option>
                          {(sortedTerms || []).map((term) => (
                            <option key={term.id} value={term.id}>
                              {term.name} {term.year}
                            </option>
                          ))}
                          <option value="create-new" className="font-semibold">+ Create New Term</option>
                        </select>
                        {(sortedTerms.length === 0) && (
                          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            No terms found. Please create a new term.
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="space-y-3 p-3 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="text-xs text-gray-600 dark:text-gray-400">Term Name</label>
                            <select
                              value={newTermData.name}
                              onChange={(e) => setNewTermData(prev => ({ ...prev, name: e.target.value }))}
                              className="w-full p-3 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-purple-500"
                            >
                              <option value="Fall">Fall</option>
                              <option value="Spring">Spring</option>
                              <option value="Summer">Summer</option>
                              <option value="Winter">Winter</option>
                            </select>
                          </div>
                          <div>
                            <label className="text-xs text-gray-600 dark:text-gray-400">Year</label>
                            <input
                              type="number"
                              value={newTermData.year}
                              onChange={(e) => setNewTermData(prev => ({ ...prev, year: parseInt(e.target.value) }))}
                              min="2020"
                              max="2030"
                              className="w-full p-3 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-purple-500"
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="text-xs text-gray-600 dark:text-gray-400">Start Date</label>
                            <input
                              type="date"
                              value={newTermData.startDate}
                              onChange={(e) => setNewTermData(prev => ({ ...prev, startDate: e.target.value }))}
                              className="w-full p-3 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-purple-500"
                            />
                          </div>
                          <div>
                            <label className="text-xs text-gray-600 dark:text-gray-400">End Date</label>
                            <input
                              type="date"
                              value={newTermData.endDate}
                              onChange={(e) => setNewTermData(prev => ({ ...prev, endDate: e.target.value }))}
                              className="w-full p-3 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-purple-500"
                            />
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={handleCreateTerm}
                            disabled={!newTermData.name || !newTermData.startDate || !newTermData.endDate || createTermMutation.isLoading}
                            className="flex-1 px-3 py-1.5 bg-green-600 text-white text-sm rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                          >
                            {createTermMutation.isLoading && <Loader2 className="animate-spin" size={14} />}
                            Create Term
                          </button>
                          <button
                            onClick={() => {
                              setShowCreateTerm(false)
                              setNewTermData({
                                name: 'Fall',
                                year: new Date().getFullYear(),
                                startDate: '',
                                endDate: ''
                              })
                            }}
                            className="px-3 py-1.5 text-gray-600 dark:text-gray-300 text-sm hover:text-gray-800 dark:hover:text-white"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={editingCourse ? handleUpdateCourse : handleAddCourse}
                  disabled={!newCourse.subject?.trim() || createCourseMutation.isLoading || updateCourseMutation.isLoading}
                  className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center justify-center gap-2"
                >
                  {(createCourseMutation.isLoading || updateCourseMutation.isLoading) && (
                    <Loader2 className="animate-spin" size={16} />
                  )}
                  {editingCourse ? 'Update Course' : 'Add Course'}
                </button>
                <button
                  onClick={() => {
                    setShowAddCourse(false)
                    setEditingCourse(null)
                    setShowCreateTerm(false)
                    setNewCourse({
                      subject: "",
                      grade: "A",
                      credits: 3,
                      termId: sortedTerms[selectedTermIndex]?.id || (sortedTerms[0]?.id || ""),
                      category: undefined
                    })
                  }}
                  className="px-4 py-3 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}