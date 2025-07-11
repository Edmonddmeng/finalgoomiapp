import { useState, useEffect } from 'react'
import { evaluationService } from '@/services/evaluationService'
import { EvaluationData, EvaluationType, GrandGoal } from '@/types/evaluations'

const initialEvaluationData: EvaluationData = {
  weeklyEvaluation: {
    content: '',
    lastUpdated: '',
    isAIGenerated: false
  },
  academicEvaluation: {
    content: '',
    lastUpdated: '',
    isAIGenerated: false
  },
  extracurricularEvaluation: {
    content: '',
    lastUpdated: '',
    isAIGenerated: false
  },
  suggestedActions: {
    content: '',
    lastUpdated: '',
    isAIGenerated: false
  }
}

export function useEvaluations(userId: string) {
  const [evaluations, setEvaluations] = useState<EvaluationData>(initialEvaluationData)
  const [grandGoal, setGrandGoal] = useState<string>('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState<EvaluationType | null>(null)

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        setError(null)
        
        // Fetch evaluations and grand goal in parallel
        const [evaluationsData, grandGoalData] = await Promise.all([
          evaluationService.getEvaluations(userId),
          evaluationService.getGrandGoal(userId)
        ])
        
        setEvaluations(evaluationsData)
        setGrandGoal(grandGoalData?.content || '')
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load data')
      } finally {
        setIsLoading(false)
      }
    }

    if (userId) {
      fetchData()
    }
  }, [userId])

  // Generate AI evaluation
  const generateEvaluation = async (
    evaluationType: EvaluationType,
    context?: any
  ) => {
    try {
      setIsGenerating(evaluationType)
      setError(null)
      
      const response = await evaluationService.generateEvaluation({
        userId,
        evaluationType,
        context
      })
      
      setEvaluations(prev => ({
        ...prev,
        [evaluationType]: response.evaluation
      }))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate evaluation')
    } finally {
      setIsGenerating(null)
    }
  }

  // Update grand goal
  const updateGrandGoal = async (content: string) => {
    try {
      setError(null)
      await evaluationService.updateGrandGoal(userId, content)
      setGrandGoal(content)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update grand goal')
      throw err // Re-throw to handle in component
    }
  }

  // Update manual evaluation
  const updateEvaluation = async (
    evaluationType: EvaluationType,
    content: string
  ) => {
    try {
      setError(null)
      await evaluationService.updateEvaluation(userId, evaluationType, content)
      
      setEvaluations(prev => ({
        ...prev,
        [evaluationType]: {
          content,
          lastUpdated: new Date().toISOString(),
          isAIGenerated: false
        }
      }))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update evaluation')
      throw err
    }
  }

  return {
    evaluations,
    grandGoal,
    isLoading,
    error,
    isGenerating,
    generateEvaluation,
    updateGrandGoal,
    updateEvaluation
  }
}