# Goomi Backend API Specification

## Overview
This document outlines all API endpoints required for the Goomi application. The backend should implement these endpoints to support the frontend application.

## Base Configuration

### Base URL
```
Production: https://api.goomi.app
Development: http://localhost:3001
```

### Authentication
- Use JWT tokens for authentication
- Token should be included in Authorization header: `Bearer <token>`
- Token expiry: 7 days (refresh token: 30 days)

### Response Format
All responses should follow this format:

#### Success Response
```json
{
  "success": true,
  "data": { ... },
  "message": "Optional success message"
}
```

#### Error Response
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable error message",
    "details": { ... } // Optional
  }
}
```

#### Pagination Response
```json
{
  "success": true,
  "data": {
    "items": [ ... ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 100,
      "totalPages": 5
    }
  }
}
```

## API Endpoints

### 1. Authentication

#### POST /api/auth/register
Register a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword",
  "name": "John Doe",
  "username": "johndoe"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_123",
      "email": "user@example.com",
      "name": "John Doe",
      "username": "johndoe"
    },
    "tokens": {
      "accessToken": "jwt_token",
      "refreshToken": "refresh_token"
    }
  }
}
```

#### POST /api/auth/login
Login with email and password.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password"
}
```

**Response:** Same as register

#### POST /api/auth/refresh
Refresh access token using refresh token.

**Request Body:**
```json
{
  "refreshToken": "refresh_token"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "accessToken": "new_jwt_token",
    "refreshToken": "new_refresh_token"
  }
}
```

#### POST /api/auth/logout
Logout and invalidate tokens.

**Request Header:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

### 2. User Profile

#### GET /api/users/profile
Get current user's profile.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "user_123",
    "email": "user@example.com",
    "name": "John Doe",
    "username": "johndoe",
    "avatar": "https://...",
    "bio": "Student passionate about...",
    "grade": 11,
    "school": "Example High School",
    "progressLevel": 75,
    "currentStreak": 7,
    "totalPoints": 1250,
    "achievements": [
      {
        "id": "ach_1",
        "title": "First Competition",
        "description": "Participated in first competition",
        "icon": "trophy",
        "unlockedAt": "2024-01-15T10:00:00Z"
      }
    ],
    "stats": {
      "totalCompetitions": 5,
      "totalActivities": 12,
      "averageGPA": 3.8,
      "tasksCompleted": 156
    }
  }
}
```

#### PUT /api/users/profile
Update user profile.

**Request Body:**
```json
{
  "name": "John Doe",
  "bio": "Updated bio",
  "grade": 12,
  "school": "New School"
}
```

#### POST /api/users/avatar
Upload user avatar.

**Request:** Multipart form data with `avatar` field

**Response:**
```json
{
  "success": true,
  "data": {
    "avatarUrl": "https://..."
  }
}
```

### 3. Academic Management

#### GET /api/academics/terms
Get all academic terms.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "term_1",
      "name": "Fall",
      "year": 2024,
      "startDate": "2024-08-15",
      "endDate": "2024-12-20",
      "isCurrent": true
    }
  ]
}
```

#### GET /api/academics/courses
Get user's courses.

**Query Parameters:**
- `termId` (optional): Filter by term
- `category` (optional): Filter by subject category

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "course_1",
      "termId": "term_1",
      "subject": "AP Calculus BC",
      "category": "math",
      "grade": "A",
      "gradePoint": 4.0,
      "credits": 5,
      "teacher": "Ms. Smith",
      "room": "201A"
    }
  ]
}
```

#### POST /api/academics/courses
Create a new course.

**Request Body:**
```json
{
  "termId": "term_1",
  "subject": "AP Physics",
  "category": "science",
  "grade": "A-",
  "credits": 5,
  "teacher": "Mr. Johnson",
  "room": "Lab 3"
}
```

#### PUT /api/academics/courses/:id
Update a course.

#### DELETE /api/academics/courses/:id
Delete a course.

#### GET /api/academics/insights
Get AI-generated academic insights.

**Response:**
```json
{
  "success": true,
  "data": {
    "dailyInsight": {
      "content": "Your math performance shows consistent improvement...",
      "generatedAt": "2024-01-20T10:00:00Z"
    }
  }
}
```

#### POST /api/academics/insights
Save custom academic insight.

**Request Body:**
```json
{
  "content": "Today I learned a new approach to solving calculus problems..."
}
```

### 4. Competition Management

#### GET /api/competitions
Get user's competitions.

**Query Parameters:**
- `category` (optional): Filter by category
- `year` (optional): Filter by year

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "comp_1",
      "name": "State Math Competition",
      "category": "academic",
      "date": "2024-03-15",
      "placement": "2nd Place",
      "participants": 150,
      "description": "Annual state-wide mathematics competition",
      "satisfaction": 4,
      "notes": "Challenging problems, good experience"
    }
  ]
}
```

#### POST /api/competitions
Create a new competition.

#### PUT /api/competitions/:id
Update a competition.

#### DELETE /api/competitions/:id
Delete a competition.

#### GET /api/competitions/:id/insights
Get competition insights and AI analysis.

**Response:**
```json
{
  "success": true,
  "data": {
    "personalInsights": [
      {
        "id": "insight_1",
        "content": "The time management strategies I used...",
        "createdAt": "2024-03-16T10:00:00Z"
      }
    ],
    "aiInsights": [
      {
        "id": "ai_insight_1",
        "content": "Your 2nd place finish demonstrates strong problem-solving...",
        "generatedAt": "2024-03-16T11:00:00Z"
      }
    ]
  }
}
```

#### POST /api/competitions/:id/insights
Add personal insight to competition.

#### POST /api/competitions/:id/ai-insights
Generate AI insight for competition.

### 5. Activity Management

#### GET /api/activities
Get user's activities.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "act_1",
      "name": "Chess Club",
      "category": "intellectual",
      "role": "President",
      "description": "Lead weekly chess club meetings",
      "startDate": "2023-09-01",
      "endDate": null,
      "isActive": true,
      "hoursPerWeek": 3,
      "achievements": ["Organized school tournament", "Increased membership by 50%"]
    }
  ]
}
```

#### POST /api/activities
Create a new activity.

#### PUT /api/activities/:id
Update an activity.

#### DELETE /api/activities/:id
Delete an activity.

### 6. Task Management

#### GET /api/tasks
Get user's tasks.

**Query Parameters:**
- `status` (optional): "pending" | "completed"
- `dueDate` (optional): ISO date string
- `category` (optional): Task category

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "task_1",
      "title": "Complete calculus homework",
      "description": "Chapter 5 problems 1-20",
      "dueDate": "2024-01-25",
      "priority": "high",
      "category": "academic",
      "completed": false,
      "completedDate": null,
      "relatedCompetitionId": null,
      "relatedActivityId": null
    }
  ]
}
```

#### POST /api/tasks
Create a new task.

**Request Body:**
```json
{
  "title": "Study for physics test",
  "description": "Review chapters 3-5",
  "dueDate": "2024-01-28",
  "priority": "high",
  "category": "academic"
}
```

#### PUT /api/tasks/:id
Update a task.

#### DELETE /api/tasks/:id
Delete a task.

#### PUT /api/tasks/:id/toggle
Toggle task completion status.

**Response:**
```json
{
  "success": true,
  "data": {
    "completed": true,
    "completedDate": "2024-01-20T15:30:00Z"
  }
}
```

### 7. Community Features

#### GET /api/communities
Get all communities.

**Query Parameters:**
- `joined` (optional): Filter by joined status
- `category` (optional): Filter by category

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "comm_1",
      "name": "AP Students United",
      "description": "Community for AP students",
      "category": "academic",
      "members": 1250,
      "joined": true,
      "createdBy": "user_456",
      "createdAt": "2023-01-15T10:00:00Z"
    }
  ]
}
```

#### POST /api/communities
Create a new community.

#### PUT /api/communities/:id/join
Join a community.

#### PUT /api/communities/:id/leave
Leave a community.

#### GET /api/communities/:id/posts
Get posts from a community.

**Query Parameters:**
- `page` (default: 1)
- `limit` (default: 20)
- `sort` (optional): "recent" | "popular"

#### POST /api/communities/:id/posts
Create a post in a community.

**Request Body:**
```json
{
  "title": "Tips for AP Calculus BC",
  "content": "Here are my top study tips...",
  "tags": ["calculus", "study-tips"]
}
```

#### POST /api/posts/:id/vote
Vote on a post.

**Request Body:**
```json
{
  "vote": "up" // or "down"
}
```

#### POST /api/posts/:id/comments
Add comment to a post.

**Request Body:**
```json
{
  "content": "Great tips! I also recommend..."
}
```

### 8. Evaluations (AI-Powered)

#### GET /api/evaluations/:userId
Get all evaluations for a user.

**Response:**
```json
{
  "success": true,
  "data": {
    "weeklyEvaluation": {
      "content": "This week showed strong progress...",
      "lastUpdated": "2024-01-20T10:00:00Z",
      "isAIGenerated": true
    },
    "academicEvaluation": { ... },
    "extracurricularEvaluation": { ... },
    "suggestedActions": { ... }
  }
}
```

#### POST /api/evaluations/generate
Generate AI evaluation.

**Request Body:**
```json
{
  "userId": "user_123",
  "evaluationType": "weeklyEvaluation",
  "context": {
    "tasks": [...],
    "academics": [...],
    "activities": [...],
    "competitions": [...]
  }
}
```

#### GET /api/users/:userId/grand-goal
Get user's grand goal.

#### PUT /api/users/:userId/grand-goal
Update user's grand goal.

**Request Body:**
```json
{
  "content": "Become a leading researcher in renewable energy"
}
```

### 9. Dashboard Statistics

#### GET /api/dashboard/stats
Get dashboard statistics.

**Response:**
```json
{
  "success": true,
  "data": {
    "currentGPA": 3.85,
    "totalCredits": 45,
    "currentStreak": 7,
    "tasksCompleted": 156,
    "upcomingDeadlines": 5,
    "recentAchievements": [...],
    "weeklyProgress": {
      "tasksCompleted": 12,
      "hoursStudied": 25,
      "activitiesAttended": 8
    }
  }
}
```

### 10. Settings & Preferences

#### GET /api/users/settings
Get user settings.

**Response:**
```json
{
  "success": true,
  "data": {
    "notifications": {
      "taskReminders": true,
      "achievements": true,
      "weeklyReports": false,
      "communityUpdates": true
    },
    "privacy": {
      "profileVisibility": "public",
      "showAchievements": true,
      "showStats": false
    },
    "appearance": {
      "theme": "light",
      "accentColor": "purple"
    }
  }
}
```

#### PUT /api/users/settings
Update user settings.

## WebSocket Events

### Connection
```
wss://api.goomi.app/ws
```

### Events

#### Client → Server
- `subscribe`: Subscribe to updates
- `unsubscribe`: Unsubscribe from updates

#### Server → Client
- `task:updated`: Task was updated
- `achievement:unlocked`: New achievement unlocked
- `notification`: General notification
- `community:post`: New post in joined community

## Error Codes

| Code | Description |
|------|-------------|
| AUTH_INVALID_CREDENTIALS | Invalid email or password |
| AUTH_TOKEN_EXPIRED | JWT token has expired |
| AUTH_UNAUTHORIZED | Not authorized to access resource |
| VALIDATION_ERROR | Request validation failed |
| RESOURCE_NOT_FOUND | Requested resource not found |
| RATE_LIMIT_EXCEEDED | Too many requests |
| SERVER_ERROR | Internal server error |

## Rate Limiting

- General API: 100 requests per minute
- Auth endpoints: 10 requests per minute
- File uploads: 10 requests per hour

## Database Schema Considerations

### Collections/Tables Needed:
1. users
2. academic_terms
3. courses
4. competitions
5. activities  
6. tasks
7. communities
8. community_posts
9. community_comments
10. evaluations
11. user_settings
12. achievements
13. notifications

### Indexes Recommended:
- users: email, username
- courses: userId + termId
- tasks: userId + completed + dueDate
- community_posts: communityId + createdAt

## Security Considerations

1. **Input Validation**: Validate all inputs
2. **SQL Injection**: Use parameterized queries
3. **XSS Prevention**: Sanitize user content
4. **CORS**: Configure appropriate CORS headers
5. **Rate Limiting**: Implement per-user rate limits
6. **File Upload**: Validate file types and sizes
7. **Authentication**: Use secure password hashing (bcrypt)
8. **HTTPS**: Enforce HTTPS in production