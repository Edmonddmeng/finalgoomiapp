# Migration Guide: LocalStorage to Backend API

## Overview
This guide explains how to migrate from the current localStorage-based system to a full backend API integration.

## Current State

### Data Storage
- **User Data**: `localStorage` with `useLocalStorage` hook
- **Persistence**: Client-side only
- **Mock Data**: `/src/lib/mockData.ts`

### Components Using LocalStorage
1. **Main App** (`/src/app/page.tsx`)
   - User profile
   - Tasks
   - Communities
   - Posts
   - User votes

2. **Dashboard Components**
   - Academic courses
   - Competitions
   - Activities
   - Insights

3. **Evaluations**
   - Grand goal
   - Evaluation data

## Migration Steps

### Phase 1: Backend Authentication (Week 1)

#### 1.1 Implement Authentication Endpoints
```typescript
// Backend must implement:
POST /api/auth/register
POST /api/auth/login
POST /api/auth/refresh
POST /api/auth/logout
GET  /api/users/profile
```

#### 1.2 Update App.tsx
```typescript
// Before (current)
const [user, setUser] = useLocalStorage("user", mockUser)

// After (with backend)
import { AuthProvider } from '@/contexts/AuthContext'

function App() {
  return (
    <AuthProvider>
      {/* App content */}
    </AuthProvider>
  )
}
```

#### 1.3 Protected Routes
```typescript
import { withAuth } from '@/contexts/AuthContext'

const ProtectedDashboard = withAuth(Dashboard)
```

### Phase 2: Core Data Migration (Week 2)

#### 2.1 Tasks Migration
```typescript
// Before
const [tasks, setTasks] = useLocalStorage<Task[]>("tasks", mockTasks)

// After
import { useTasks } from '@/hooks/useTasks'

function TaskManager() {
  const { data: tasks, isLoading } = useTasks()
  // Use tasks.items instead of tasks array
}
```

#### 2.2 Academic Data Migration
```typescript
// Before
const [academics, setAcademics] = useLocalStorage("academics", [])

// After
import { useCourses } from '@/hooks/useAcademics'

function AcademicDetails() {
  const { data: courses, isLoading } = useCourses(currentTermId)
}
```

#### 2.3 Update Component Props
```typescript
// Before
<Dashboard 
  user={user} 
  tasks={tasks} 
  setUser={setUser} 
/>

// After
<Dashboard /> // Data fetched internally via hooks
```

### Phase 3: Community Features (Week 3)

#### 3.1 Communities Migration
```typescript
// Before
const [communities, setCommunities] = useLocalStorage("communities", mockCommunities)

// After
import { useCommunities } from '@/hooks/useCommunities'

function CommunityList() {
  const { data: communities } = useCommunities()
}
```

#### 3.2 Posts and Voting
```typescript
// Before
const [userVotes, setUserVotes] = useLocalStorage("userVotes", {})

// After
// Votes are stored server-side, returned with posts
const { data: posts } = usePosts(communityId)
// Each post includes userVote field
```

### Phase 4: Feature Flags (Week 4)

#### 4.1 Gradual Rollout
```typescript
// config/index.ts
export const config = {
  features: {
    useBackendAuth: process.env.NEXT_PUBLIC_USE_BACKEND_AUTH === 'true',
    useBackendTasks: process.env.NEXT_PUBLIC_USE_BACKEND_TASKS === 'true',
    // ... other features
  }
}
```

#### 4.2 Conditional Logic
```typescript
// In components
import { config } from '@/config'

function useTasksData() {
  if (config.features.useBackendTasks) {
    return useTasks() // Backend
  } else {
    return useLocalStorage('tasks', mockTasks) // LocalStorage
  }
}
```

## Data Migration Script

### Export Current Data
```typescript
// utils/exportLocalStorageData.ts
export function exportUserData() {
  const data = {
    user: localStorage.getItem('goomi_user'),
    tasks: localStorage.getItem('goomi_tasks'),
    academics: localStorage.getItem('goomi_academics'),
    competitions: localStorage.getItem('goomi_competitions'),
    activities: localStorage.getItem('goomi_activities'),
    communities: localStorage.getItem('goomi_communities'),
    settings: localStorage.getItem('goomi_settings'),
  }
  
  return data
}
```

### Import to Backend
```bash
# Backend migration endpoint
POST /api/migration/import-user-data
{
  "userId": "user_123",
  "data": { /* exported data */ }
}
```

## Component Update Checklist

### Dashboard.tsx
- [ ] Remove `user` and `setUser` props
- [ ] Use `useAuth()` hook for user data
- [ ] Use `useDashboardStats()` for statistics

### AcademicDetails.tsx
- [ ] Remove localStorage usage
- [ ] Implement `useAcademicTerms()` and `useCourses()`
- [ ] Update course CRUD operations

### CompetitionDetails.tsx
- [ ] Use `useCompetition(id)` for data
- [ ] Implement `useCompetitionInsights()`
- [ ] Update insight creation

### TaskList.tsx
- [ ] Replace task array with paginated response
- [ ] Implement filtering via API
- [ ] Update task toggle logic

### Community.tsx
- [ ] Use `useCommunities()` hook
- [ ] Implement `usePosts()` with pagination
- [ ] Update voting to use API

## Testing During Migration

### 1. Parallel Testing
```typescript
// Run both systems in parallel
const backendTasks = useTasks()
const localTasks = useLocalStorage('tasks')

// Compare results
useEffect(() => {
  if (config.features.debugMode) {
    console.log('Backend tasks:', backendTasks)
    console.log('Local tasks:', localTasks)
  }
}, [backendTasks, localTasks])
```

### 2. Data Validation
```typescript
// Validate migrated data
function validateMigratedData(local: any, backend: any) {
  const differences = []
  // Compare fields
  return differences
}
```

### 3. Rollback Plan
```typescript
// Quick rollback via feature flags
NEXT_PUBLIC_USE_BACKEND_AUTH=false
NEXT_PUBLIC_USE_BACKEND_TASKS=false
```

## Performance Considerations

### 1. Initial Load
- Implement progressive loading
- Use React Suspense for code splitting
- Preload critical data

### 2. Caching Strategy
```typescript
// Built into hooks
const { data } = useTasks({
  staleTime: 5 * 60 * 1000, // 5 minutes
  cacheTime: 10 * 60 * 1000, // 10 minutes
})
```

### 3. Optimistic Updates
```typescript
const { mutate } = useToggleTask({
  onMutate: async (taskId) => {
    // Optimistically update UI
    await queryClient.cancelQueries(['tasks'])
    const previous = queryClient.getQueryData(['tasks'])
    
    queryClient.setQueryData(['tasks'], old => {
      // Update task completed status
    })
    
    return { previous }
  },
  onError: (err, taskId, context) => {
    // Rollback on error
    queryClient.setQueryData(['tasks'], context.previous)
  }
})
```

## Monitoring Migration

### 1. Error Tracking
```typescript
// Add to apiClient.ts
apiClient.interceptors.response.use(
  response => response,
  error => {
    // Log to monitoring service
    Sentry.captureException(error)
    return Promise.reject(error)
  }
)
```

### 2. Performance Metrics
```typescript
// Track API response times
const startTime = Date.now()
const response = await apiClient.get('/api/tasks')
const duration = Date.now() - startTime

analytics.track('api_request', {
  endpoint: '/api/tasks',
  duration,
  status: response.status
})
```

### 3. User Experience Metrics
- Page load times
- Time to interactive
- API error rates
- Feature adoption rates

## Post-Migration Cleanup

### 1. Remove Mock Data
```bash
# Files to remove after full migration
rm src/lib/mockData.ts
rm src/lib/mockEvaluations.ts
```

### 2. Remove LocalStorage Hooks
```bash
# Update components to remove useLocalStorage
rm src/hooks/useLocalStorage.ts
```

### 3. Update Documentation
- Remove references to mock data
- Update setup instructions
- Archive migration guide

## Timeline

### Week 1: Authentication
- Implement auth endpoints
- Deploy AuthContext
- Test login/logout flow

### Week 2: Core Features
- Migrate user profile
- Migrate tasks
- Migrate academic data

### Week 3: Community
- Migrate communities
- Migrate posts/comments
- Implement real-time updates

### Week 4: Polish
- Performance optimization
- Error handling
- Documentation update

### Week 5: Cleanup
- Remove mock data
- Remove localStorage
- Final testing

## Success Criteria

- [ ] All users can login via API
- [ ] Data persistence works correctly
- [ ] No data loss during migration
- [ ] Performance meets targets (<2s page load)
- [ ] Error rate <1%
- [ ] User satisfaction maintained