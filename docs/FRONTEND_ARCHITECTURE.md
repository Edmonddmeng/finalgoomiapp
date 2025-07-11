# Frontend Architecture Guide

## Overview
This document explains the frontend architecture and how it's prepared for backend integration. The application follows a clean architecture pattern with clear separation of concerns.

## Architecture Layers

### 1. Presentation Layer (UI Components)
- **Location**: `/src/components/`
- **Purpose**: Pure UI components that receive data via props
- **Example**: `EvaluationsView.tsx`, `StatsCardsView.tsx`

### 2. Container Layer (Smart Components)
- **Location**: `/src/components/`
- **Purpose**: Components that handle data fetching and state management
- **Example**: `Evaluations.tsx`, `Dashboard.tsx`

### 3. Service Layer (API Calls)
- **Location**: `/src/services/`
- **Purpose**: Encapsulates all API calls and business logic
- **Files**:
  - `authService.ts` - Authentication operations
  - `userService.ts` - User profile and settings
  - `academicService.ts` - Academic data management
  - `competitionService.ts` - Competition management
  - `activityService.ts` - Activity tracking
  - `taskService.ts` - Task management
  - `communityService.ts` - Community features
  - `evaluationService.ts` - AI evaluations

### 4. Data Fetching Layer (Custom Hooks)
- **Location**: `/src/hooks/`
- **Purpose**: React hooks that use services to fetch and manage data
- **Base Hooks**:
  - `useApiQuery.ts` - For GET requests with caching
  - `useApiMutation.ts` - For POST/PUT/DELETE operations

### 5. Type Definitions
- **Location**: `/src/types/`
- **Purpose**: TypeScript interfaces for type safety
- **Organization**:
  - Domain-specific files (user.ts, academic.ts, etc.)
  - API types (api.ts)
  - Legacy compatibility (index.ts)

### 6. State Management
- **Context**: `/src/contexts/AuthContext.tsx` - Authentication state
- **Local Storage**: Used for offline support and caching
- **Future**: Can add Redux/Zustand as needed

### 7. Infrastructure
- **API Client**: `/src/lib/apiClient.ts`
  - Axios instance with interceptors
  - Automatic error handling
  - Token refresh logic
  - Request/response logging

- **Configuration**: `/src/config/index.ts`
  - Environment variables
  - Feature flags
  - API endpoints

## Data Flow

```
User Action → Component → Hook → Service → API Client → Backend
                ↑                                          ↓
                └──────── State Update ←─────────────────┘
```

## Integration Steps

### 1. Environment Setup
```bash
# Copy environment file
cp .env.example .env.local

# Update with your backend URL
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
```

### 2. Feature Flags
Control feature availability via environment variables:
```typescript
// Enable/disable features
NEXT_PUBLIC_ENABLE_AI_FEATURES=true
NEXT_PUBLIC_ENABLE_MOCK_API=false
```

### 3. Authentication Flow
1. User logs in via `AuthContext`
2. Tokens stored in localStorage
3. API client automatically includes token
4. Token refresh handled automatically

### 4. Data Fetching Pattern
```typescript
// In component
import { useTasks } from '@/hooks/useTasks'

function TaskList() {
  const { data, isLoading, error, refetch } = useTasks()
  
  if (isLoading) return <Skeleton />
  if (error) return <Error />
  
  return <TaskListView tasks={data.items} />
}
```

### 5. Mutations Pattern
```typescript
// In component
import { useCreateTask } from '@/hooks/useTasks'

function CreateTaskForm() {
  const { mutate, isLoading } = useCreateTask()
  
  const handleSubmit = (data) => {
    mutate(data, {
      onSuccess: () => {
        // Handle success
      }
    })
  }
}
```

## Mock Data System

### Current State
- Mock data in `/src/lib/mockData.ts`
- Mock services for development
- LocalStorage for persistence

### Switching to Real API
1. Set `NEXT_PUBLIC_ENABLE_MOCK_API=false`
2. Services automatically use real endpoints
3. No component changes needed

## Error Handling

### Global Error Handling
- API client catches all errors
- Converts to standardized `ApiError` format
- Automatic retry for network errors
- Token refresh on 401 errors

### Component Error Handling
```typescript
const { error } = useApiQuery()

if (error) {
  switch(error.code) {
    case 'NOT_FOUND':
      return <NotFound />
    case 'FORBIDDEN':
      return <Forbidden />
    default:
      return <GenericError />
  }
}
```

## WebSocket Integration

### Setup (When Ready)
```typescript
// src/services/websocketService.ts
import { config } from '@/config'

class WebSocketService {
  connect() {
    this.ws = new WebSocket(config.api.wsUrl)
    // Handle events
  }
}
```

### Events to Implement
- Real-time notifications
- Live updates for tasks
- Community post updates
- Achievement unlocks

## Testing Strategy

### Mock Service Worker (MSW)
```typescript
// src/mocks/handlers.ts
export const handlers = [
  rest.get('/api/users/profile', (req, res, ctx) => {
    return res(ctx.json({ /* mock data */ }))
  })
]
```

### Component Testing
```typescript
// Use mock providers
<AuthContext.Provider value={mockAuth}>
  <Component />
</AuthContext.Provider>
```

## Performance Optimizations

### 1. Code Splitting
- Lazy load routes
- Dynamic imports for heavy components

### 2. Data Caching
- Built into `useApiQuery`
- Configurable cache duration
- Optimistic updates

### 3. Image Optimization
- Next.js Image component
- Lazy loading
- Responsive images

## Security Considerations

### 1. Token Storage
- Tokens in httpOnly cookies (future)
- Current: localStorage with encryption

### 2. XSS Prevention
- Input sanitization
- Content Security Policy

### 3. API Security
- CORS configuration
- Rate limiting awareness
- Request validation

## Deployment Checklist

### Before Deployment
- [ ] Update environment variables
- [ ] Disable mock API
- [ ] Configure error tracking (Sentry)
- [ ] Test all API endpoints
- [ ] Verify authentication flow
- [ ] Check WebSocket connection
- [ ] Test offline functionality

### Environment Variables
```bash
# Production
NEXT_PUBLIC_API_URL=https://api.goomi.app
NEXT_PUBLIC_ENABLE_MOCK_API=false
NEXT_PUBLIC_DEBUG_MODE=false
```

## Monitoring

### Frontend Monitoring
- Error tracking with Sentry
- Performance monitoring
- User analytics

### API Monitoring
- Request/response logging
- Error rate tracking
- Performance metrics

## Future Enhancements

### 1. State Management
- Add Redux Toolkit for complex state
- Or Zustand for simpler needs

### 2. Offline Support
- Service Workers
- Background sync
- Conflict resolution

### 3. Real-time Features
- WebSocket integration
- Server-Sent Events
- Live collaboration

## Developer Tools

### Useful Commands
```bash
# Type checking
npm run type-check

# Lint
npm run lint

# Build
npm run build

# Analyze bundle
npm run analyze
```

### Debug Mode
Set `NEXT_PUBLIC_DEBUG_MODE=true` to enable:
- API request logging
- Performance metrics
- Component render tracking