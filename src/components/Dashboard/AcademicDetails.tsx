"use client"
import type { User } from "@/types"
import { ChevronLeft, BookOpen, Award, BarChart2 } from "lucide-react"

interface AcademicDetailsProps {
  user: User
  onBack: () => void
}

export function AcademicDetails({ user, onBack }: AcademicDetailsProps) {
  const gpaColor = user.gpa >= 3.5 ? "text-green-600" : user.gpa >= 3.0 ? "text-blue-600" : "text-yellow-600"

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
              <p className={`text-2xl font-bold ${gpaColor}`}>{user.gpa.toFixed(2)}</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-slate-700/50 rounded-xl">
            <BookOpen className="text-purple-500" size={32} />
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">SAT Score</p>
              <p className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                {user.standardizedScores.sat || "N/A"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-slate-700/50 rounded-xl">
            <Award className="text-yellow-500" size={32} />
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">AP Exams Passed</p>
              <p className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                {user.standardizedScores.ap?.filter((exam) => exam.score >= 3).length || 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-slate-700">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Course Grades</h3>
        <div className="space-y-3">
          {user.academics.map((academic) => (
            <div
              key={academic.id}
              className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-700/50 rounded-lg"
            >
              <div>
                <p className="font-medium text-gray-800 dark:text-gray-200">{academic.subject}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {academic.term} {academic.year} • {academic.credits} credits
                </p>
              </div>
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
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-slate-700">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">AP Exam Scores</h3>
        <div className="space-y-3">
          {user.standardizedScores.ap && user.standardizedScores.ap.length > 0 ? (
            user.standardizedScores.ap.map((exam) => (
              <div
                key={exam.subject}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-700/50 rounded-lg"
              >
                <p className="font-medium text-gray-800 dark:text-gray-200">{exam.subject}</p>
                <span className={`text-lg font-bold ${exam.score >= 4 ? "text-green-600" : "text-yellow-600"}`}>
                  {exam.score}
                </span>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 dark:text-gray-400 py-4">No AP exam scores recorded.</p>
          )}
        </div>
      </div>
    </div>
  )
}
