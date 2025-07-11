# Evaluations Component - Backend Integration Guide

## Overview
The Evaluations component has been prepared for backend integration with a clean separation of concerns:

- **EvaluationsView.tsx** - Pure presentation component (frontend only)
- **Evaluations.tsx** - Container component handling state and data fetching
- **Types & Services** - Defined interfaces and API endpoints

## Files Structure

```
src/
├── components/
│   └── Evaluations/
│       ├── Evaluations.tsx         # Container (handles data)
│       ├── EvaluationsView.tsx     # Presentation (pure UI)
│       └── README.md
├── types/
│   └── evaluations.ts              # TypeScript interfaces
├── services/
│   └── evaluationService.ts        # API service layer
├── hooks/
│   └── useEvaluations.ts          # Custom hook for data fetching
└── lib/
    └── mockEvaluations.ts         # Mock data for development
```

## Backend Integration Steps

### 1. Replace Mock Service with Real API

In `Evaluations.tsx`, replace the mock service imports:

```typescript
// Remove this:
import { mockEvaluationService } from "@/lib/mockEvaluations"

// Add this:
import { evaluationService } from "@/services/evaluationService"
// OR use the custom hook:
import { useEvaluations } from "@/hooks/useEvaluations"
```

### 2. Update API Endpoints

Configure your API base URL in `.env`:

```
NEXT_PUBLIC_API_URL=https://api.yourapp.com
```

### 3. Required API Endpoints

Your backend should implement these endpoints:

#### Get All Evaluations
```
GET /api/evaluations/{userId}
Response: EvaluationData
```

#### Generate AI Evaluation
```
POST /api/evaluations/generate
Body: GenerateEvaluationRequest
Response: GenerateEvaluationResponse
```

#### Get Grand Goal
```
GET /api/users/{userId}/grand-goal
Response: GrandGoal | null
```

#### Update Grand Goal
```
PUT /api/users/{userId}/grand-goal
Body: { content: string }
Response: GrandGoal
```

#### Update Manual Evaluation
```
PUT /api/evaluations/{userId}/{evaluationType}
Body: { content: string }
Response: void
```

### 4. Using the Custom Hook

Replace the current implementation in `Evaluations.tsx` with:

```typescript
export function Evaluations() {
  const userId = useAuth().user.id // Get from your auth context
  const {
    evaluations,
    grandGoal,
    isLoading,
    error,
    isGenerating,
    generateEvaluation,
    updateGrandGoal,
    updateEvaluation
  } = useEvaluations(userId)

  return (
    <EvaluationsView
      grandGoal={grandGoal}
      evaluations={evaluations}
      isGenerating={isGenerating}
      onUpdateGrandGoal={updateGrandGoal}
      onGenerateEvaluation={generateEvaluation}
      isLoading={isLoading}
      error={error}
    />
  )
}
```

### 5. AI Context for Evaluations

When calling `generateEvaluation`, you can pass context data:

```typescript
const handleGenerateEvaluation = async (type: EvaluationType) => {
  await generateEvaluation(type, {
    tasks: userTasks,
    academics: userAcademics,
    activities: userActivities,
    competitions: userCompetitions
  })
}
```

## Type Definitions

All TypeScript interfaces are in `src/types/evaluations.ts`:

- `Evaluation` - Single evaluation data
- `EvaluationData` - All four evaluations
- `GrandGoal` - User's ultimate goal
- `EvaluationType` - Union type of evaluation keys
- `GenerateEvaluationRequest/Response` - API types

## Development Mode

To test without a backend, the current implementation uses:
- `useLocalStorage` for persistence
- `mockEvaluationService` for simulated API calls

## Notes

- The component is fully typed with TypeScript
- Loading and error states are handled
- Mock data generation simulates AI responses
- All UI components are in EvaluationsView.tsx (pure frontend)
- Data logic is in Evaluations.tsx (ready for backend swap)