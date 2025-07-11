"use client"

import { useState } from "react"
import { Target, TrendingUp, GraduationCap, Activity, Lightbulb, Edit2, Save, Sparkles } from "lucide-react"
import { EvaluationData, EvaluationType } from "@/types/evaluations"

interface EvaluationsViewProps {
  grandGoal: string
  evaluations: EvaluationData
  isGenerating: EvaluationType | null
  onUpdateGrandGoal: (goal: string) => Promise<void>
  onGenerateEvaluation: (type: EvaluationType) => Promise<void>
  isLoading?: boolean
  error?: string | null
}

export function EvaluationsView({
  grandGoal,
  evaluations,
  isGenerating,
  onUpdateGrandGoal,
  onGenerateEvaluation,
  isLoading = false,
  error = null
}: EvaluationsViewProps) {
  const [isEditingGoal, setIsEditingGoal] = useState(false)
  const [tempGoal, setTempGoal] = useState(grandGoal)

  const handleSaveGoal = async () => {
    try {
      await onUpdateGrandGoal(tempGoal)
      setIsEditingGoal(false)
    } catch (err) {
      // Error is handled by parent component
      // Optionally show a toast or inline error
    }
  }

  const handleCancelGoal = () => {
    setTempGoal(grandGoal)
    setIsEditingGoal(false)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-3">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="text-gray-500 dark:text-gray-400">Loading evaluations...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
        </div>
      )}

      {/* Hero Section - Grand Goal */}
      <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 rounded-3xl p-8 text-white shadow-xl">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <Target size={32} className="text-white/90" />
            <h1 className="text-3xl font-bold">Your Ultimate Goal</h1>
          </div>
          {!isEditingGoal && (
            <button
              onClick={() => {
                setTempGoal(grandGoal)
                setIsEditingGoal(true)
              }}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <Edit2 size={20} />
            </button>
          )}
        </div>
        
        {isEditingGoal ? (
          <div className="space-y-4">
            <textarea
              value={tempGoal}
              onChange={(e) => setTempGoal(e.target.value)}
              placeholder="Enter your grand goal... (e.g., 'Become a leading researcher in renewable energy')"
              className="w-full p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 text-white placeholder-white/60 resize-none h-24"
              rows={3}
            />
            <div className="flex gap-3">
              <button
                onClick={handleSaveGoal}
                className="px-4 py-2 bg-white text-purple-600 rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-2 font-medium"
              >
                <Save size={16} />
                Save Goal
              </button>
              <button
                onClick={handleCancelGoal}
                className="px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-4">
            {grandGoal ? (
              <p className="text-xl leading-relaxed">{grandGoal}</p>
            ) : (
              <p className="text-lg text-white/70 italic">Click edit to set your grand goal...</p>
            )}
          </div>
        )}
      </div>

      {/* Weekly Evaluation */}
      <EvaluationSection
        title="Weekly Evaluation"
        icon={<TrendingUp className="text-blue-600 dark:text-blue-400" size={24} />}
        evaluation={evaluations.weeklyEvaluation}
        evaluationType="weeklyEvaluation"
        isGenerating={isGenerating === 'weeklyEvaluation'}
        onGenerate={() => onGenerateEvaluation('weeklyEvaluation')}
        buttonColor="blue"
      />

      {/* Academic Evaluation */}
      <EvaluationSection
        title="Academic Evaluation"
        icon={<GraduationCap className="text-purple-600 dark:text-purple-400" size={24} />}
        evaluation={evaluations.academicEvaluation}
        evaluationType="academicEvaluation"
        isGenerating={isGenerating === 'academicEvaluation'}
        onGenerate={() => onGenerateEvaluation('academicEvaluation')}
        buttonColor="purple"
      />

      {/* Extracurricular Evaluation */}
      <EvaluationSection
        title="Extracurricular Evaluation"
        icon={<Activity className="text-green-600 dark:text-green-400" size={24} />}
        evaluation={evaluations.extracurricularEvaluation}
        evaluationType="extracurricularEvaluation"
        isGenerating={isGenerating === 'extracurricularEvaluation'}
        onGenerate={() => onGenerateEvaluation('extracurricularEvaluation')}
        buttonColor="green"
      />

      {/* Suggested Courses of Action */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-slate-700">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Lightbulb className="text-yellow-600 dark:text-yellow-400" size={24} />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Suggested Courses of Action</h2>
          </div>
          <button
            onClick={() => onGenerateEvaluation('suggestedActions')}
            disabled={isGenerating === 'suggestedActions'}
            className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 disabled:bg-gray-400 transition-colors flex items-center gap-2"
          >
            <Sparkles size={16} />
            {isGenerating === 'suggestedActions' ? 'Generating...' : 'Generate AI Suggestions'}
          </button>
        </div>
        
        <div className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-xl p-4 border border-yellow-200 dark:border-yellow-800">
          {evaluations.suggestedActions.content ? (
            <div>
              <p className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap">
                {evaluations.suggestedActions.content}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
                {evaluations.suggestedActions.isAIGenerated && '🤖 AI Generated • '}
                Last updated: {new Date(evaluations.suggestedActions.lastUpdated).toLocaleDateString()}
              </p>
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400 text-center py-8">
              No suggested actions yet. Click "Generate AI Suggestions" to get personalized recommendations.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

// Reusable evaluation section component
interface EvaluationSectionProps {
  title: string
  icon: React.ReactNode
  evaluation: {
    content: string
    lastUpdated: string
    isAIGenerated: boolean
  }
  evaluationType: EvaluationType
  isGenerating: boolean
  onGenerate: () => void
  buttonColor: 'blue' | 'purple' | 'green'
}

function EvaluationSection({
  title,
  icon,
  evaluation,
  isGenerating,
  onGenerate,
  buttonColor
}: EvaluationSectionProps) {
  const colorClasses = {
    blue: 'bg-blue-600 hover:bg-blue-700',
    purple: 'bg-purple-600 hover:bg-purple-700',
    green: 'bg-green-600 hover:bg-green-700'
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-slate-700">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          {icon}
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{title}</h2>
        </div>
        <button
          onClick={onGenerate}
          disabled={isGenerating}
          className={`px-4 py-2 text-white rounded-lg disabled:bg-gray-400 transition-colors flex items-center gap-2 ${colorClasses[buttonColor]}`}
        >
          <Sparkles size={16} />
          {isGenerating ? 'Generating...' : 'Generate AI Evaluation'}
        </button>
      </div>
      
      <div className="bg-gray-50 dark:bg-slate-700/50 rounded-xl p-4">
        {evaluation.content ? (
          <div>
            <p className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap">
              {evaluation.content}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
              {evaluation.isAIGenerated && '🤖 AI Generated • '}
              Last updated: {new Date(evaluation.lastUpdated).toLocaleDateString()}
            </p>
          </div>
        ) : (
          <p className="text-gray-500 dark:text-gray-400 text-center py-8">
            No {title.toLowerCase()} yet. Click "Generate AI Evaluation" to get started.
          </p>
        )}
      </div>
    </div>
  )
}