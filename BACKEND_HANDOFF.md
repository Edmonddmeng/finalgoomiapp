# Backend Handoff Documentation

## Overview
This document outlines the current state of the Goomi frontend application and what needs to be implemented on the backend.

## Current State

### 1. Demo Mode
The application is currently running in **demo mode** with a hardcoded user in `/src/contexts/AuthContext.tsx`. This needs to be removed once the backend is ready.

**TODO for Backend Engineer:**
- Remove the demo user initialization (lines 29-80 in AuthContext.tsx)
- Uncomment the real authentication logic (lines 84-115 in AuthContext.tsx)

### 2. API Configuration
- Base API URL: `http://localhost:3001/api` (configurable via `NEXT_PUBLIC_API_URL`)
- WebSocket URL: `ws://localhost:3001/ws` (configurable via `NEXT_PUBLIC_WS_URL`)
- Configuration file: `/src/config/index.ts`

### 3. Authentication
The frontend expects:
- JWT-based authentication with access and refresh tokens
- Token refresh mechanism is implemented in `/src/lib/apiClient.ts`
- Expected auth endpoints:
  - `POST /api/auth/login`
  - `POST /api/auth/register`
  - `POST /api/auth/logout`
  - `POST /api/auth/refresh`
  - `GET /api/auth/me`

### 4. API Services Implemented
All services are in `/src/services/` and expect the following endpoints:

#### User Service (`userService.ts`)
- `GET /api/user/profile`
- `PUT /api/user/profile`
- `GET /api/user/stats`
- `GET /api/user/achievements`
- `PUT /api/user/settings`
- `POST /api/user/avatar`

#### Academic Service (`academicService.ts`)
- Terms: CRUD operations on `/api/academics/terms`
- Courses: CRUD operations on `/api/academics/courses`
- Insights: `/api/academics/insights`
- Analytics: `/api/academics/gpa-stats`, `/api/academics/subject-analysis`

#### Competition Service (`competitionService.ts`)
- CRUD operations on `/api/competitions`
- Insights: `/api/competitions/:id/insights`

#### Activity Service (`activityService.ts`)
- CRUD operations on `/api/activities`
- Insights: `/api/activities/:id/insights`

#### Task Service (`taskService.ts`)
- CRUD operations on `/api/tasks`
- Bulk operations: `/api/tasks/bulk`
- Analytics: `/api/tasks/analytics`

#### Community Service (`communityService.ts`)
- Communities: CRUD on `/api/communities`
- Posts: CRUD on `/api/posts`
- Comments: CRUD on `/api/comments`
- Voting: `/api/posts/:id/vote`

#### Evaluation Service (`evaluationService.ts`)
- CRUD operations on `/api/evaluations`
- Participants: `/api/evaluations/:id/participants`

### 5. Data Models
All TypeScript interfaces are defined in `/src/types/`:
- `user.ts` - User, UserStats, UserSettings
- `academic.ts` - Academic, AcademicTerm, SubjectAnalysis
- `competition.ts` - Competition, CompetitionInsight
- `activity.ts` - Activity, ActivityInsight
- `task.ts` - Task, TaskFilters
- `community.ts` - Community, CommunityPost, PostComment
- `achievement.ts` - Achievement
- `evaluations.ts` - Evaluation, EvaluationResponse
- `api.ts` - PaginatedResponse, ApiError

### 6. Features That Need Backend Implementation

#### Critical Features:
1. **Authentication & User Management**
   - User registration/login
   - JWT token management
   - Password reset
   - Profile updates

2. **Academic Tracking**
   - Terms and courses management
   - GPA calculations
   - Subject performance analysis

3. **Activities & Competitions**
   - CRUD operations
   - Insights and analytics

4. **Task Management**
   - Task creation and tracking
   - Recurring tasks
   - Task analytics

5. **Community Features**
   - Community creation and membership
   - Posts and comments
   - Voting system

#### Nice-to-Have Features:
1. **AI Integration**
   - Chat functionality (`/api/ai/chat`)
   - Auto-generated insights
   - Evaluation assistance

2. **File Uploads**
   - Avatar uploads
   - Document attachments

3. **Real-time Features**
   - WebSocket for notifications
   - Live updates for community posts

### 7. Environment Variables Needed
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_WS_URL=ws://localhost:3001/ws
NEXT_PUBLIC_APP_NAME=Goomi
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_ENABLE_AI_FEATURES=true
NEXT_PUBLIC_ENABLE_WEBSOCKET=true
NEXT_PUBLIC_ENABLE_OFFLINE_MODE=false
NEXT_PUBLIC_ENABLE_MOCK_API=false
NEXT_PUBLIC_DEBUG_MODE=true
```

### 8. Testing the Integration
1. Remove demo mode from AuthContext
2. Ensure backend is running on port 3001
3. Test authentication flow first
4. Test each feature module independently

### 9. Current Limitations
- No offline mode implemented
- No error recovery for failed API calls beyond basic retry
- File upload size limits not enforced client-side
- No pagination implemented in list views (though API supports it)

### 10. Security Considerations
- CORS configuration needed for localhost:3000
- Implement rate limiting on backend
- Validate all user inputs
- Sanitize HTML content in community posts
- Implement proper file upload validation

## Contact
For any questions about the frontend implementation, please refer to the codebase or reach out to the frontend team.