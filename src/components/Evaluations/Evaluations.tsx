"use client"

import { useState } from "react"
import { EvaluationsView } from "./EvaluationsView"
import { EvaluationData, EvaluationType } from "@/types/evaluations"
import { useAuth } from "@/contexts/AuthContext"
import { useApiQuery } from "@/hooks/useApiQuery"
import { useApiMutation } from "@/hooks/useApiMutation"
import { evaluationService } from "@/services/evaluation.service"

// This component handles data and state management
export function Evaluations() {
  const { user } = useAuth()
  const [isGenerating, setIsGenerating] = useState<EvaluationType | null>(null)
  
  // Fetch evaluations from API
  const { data: evaluationsData, isLoading, error, refetch } = useApiQuery(
    () => evaluationService.getEvaluations(),
    ['evaluations'],
    { enabled: !!user }
  )
  
  const grandGoal = evaluationsData?.grandGoal || ""
  const evaluations = evaluationsData?.evaluations || {
    weeklyEvaluation: {
      content: "",
      lastUpdated: "",
      isAIGenerated: false
    },
    academicEvaluation: {
      content: "",
      lastUpdated: "",
      isAIGenerated: false
    },
    extracurricularEvaluation: {
      content: "",
      lastUpdated: "",
      isAIGenerated: false
    },
    suggestedActions: {
      content: "",
      lastUpdated: "",
      isAIGenerated: false
    }
  }
  
  // Mutations
  const updateGrandGoalMutation = useApiMutation(
    (goal: string) => evaluationService.updateGrandGoal(goal)
  )
  
  const generateEvaluationMutation = useApiMutation(
    ({ type }: { type: EvaluationType }) => evaluationService.generateEvaluation(type)
  )

  const handleUpdateGrandGoal = async (goal: string) => {
    await updateGrandGoalMutation.mutateAsync(goal)
    refetch()
  }

  const handleGenerateEvaluation = async (type: EvaluationType) => {
    try {
      setIsGenerating(type)
      await generateEvaluationMutation.mutateAsync({ type })
      refetch()
    } finally {
      setIsGenerating(null)
    }
  }

  return (
    <EvaluationsView
      grandGoal={grandGoal}
      evaluations={evaluations}
      isGenerating={isGenerating}
      onUpdateGrandGoal={handleUpdateGrandGoal}
      onGenerateEvaluation={handleGenerateEvaluation}
      isLoading={isLoading}
      error={error?.message || null}
    />
  )
}