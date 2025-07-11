# Backend Quick Start Guide

## Essential Information for Backend Development

### 1. API Response Format (MUST FOLLOW)
```json
// Success
{
  "success": true,
  "data": { ... }
}

// Error
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable message",
    "details": { ... }
  }
}
```

### 2. Authentication Headers
```
Authorization: Bearer <jwt_token>
```

### 3. Critical Endpoints to Implement First

#### Phase 1: Authentication (PRIORITY)
```
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/refresh
GET    /api/users/profile
```

#### Phase 2: Core Features
```
# Tasks
GET    /api/tasks
POST   /api/tasks
PUT    /api/tasks/:id/toggle

# Academic
GET    /api/academics/terms
GET    /api/academics/courses
POST   /api/academics/courses

# Dashboard
GET    /api/dashboard/stats
```

### 4. Database Schema Essentials

#### Users Table
```sql
- id (uuid, primary key)
- email (unique)
- password_hash
- name
- username (unique)
- avatar_url
- created_at
- updated_at
```

#### Tasks Table
```sql
- id (uuid, primary key)
- user_id (foreign key)
- title
- completed (boolean)
- completed_date (timestamp)
- created_at
```

#### Academic_Terms Table
```sql
- id (uuid, primary key)
- user_id (foreign key)
- name (Fall/Spring/Summer)
- year
- is_current (boolean)
```

#### Courses Table
```sql
- id (uuid, primary key)
- user_id (foreign key)
- term_id (foreign key)
- subject
- category (enum)
- grade
- credits
```

### 5. Error Codes to Use
```
AUTH_INVALID_CREDENTIALS
AUTH_TOKEN_EXPIRED
AUTH_UNAUTHORIZED
VALIDATION_ERROR
RESOURCE_NOT_FOUND
RATE_LIMIT_EXCEEDED
SERVER_ERROR
```

### 6. JWT Token Requirements
- Access Token: 7 days expiry
- Refresh Token: 30 days expiry
- Include in payload: `{ userId, email, exp }`

### 7. CORS Configuration
```javascript
// Allow these origins
http://localhost:3000 (development)
https://goomi.app (production)

// Allow these headers
Authorization
Content-Type
```

### 8. Test Data Seeds
Create test user with:
- Email: test@example.com
- Password: password123
- Pre-populated with sample data

### 9. API Rate Limits
- General: 100 requests/minute
- Auth: 10 requests/minute
- File upload: 10 requests/hour

### 10. File Upload Endpoints
```
POST /api/users/avatar (multipart/form-data)
- Field name: "avatar"
- Max size: 5MB
- Allowed types: jpg, png, webp
```

## Testing the Integration

### 1. Update Frontend ENV
```bash
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_ENABLE_MOCK_API=false
```

### 2. Test Authentication Flow
1. Start backend on port 3001
2. Start frontend: `npm run dev`
3. Try to register/login
4. Check network tab for API calls

### 3. Common Issues & Solutions

#### CORS Error
```javascript
// Backend fix
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}))
```

#### 401 Unauthorized
- Check JWT token format
- Verify token in Authorization header
- Check token expiry

#### Response Format Error
- Ensure ALL responses follow the standard format
- Frontend expects `data` field in success responses

## Communication Channels

### API Documentation
See: `/docs/BACKEND_API_SPECIFICATION.md`

### Frontend Architecture
See: `/docs/FRONTEND_ARCHITECTURE.md`

### Migration Plan
See: `/docs/MIGRATION_GUIDE.md`

## Development Workflow

1. **Backend Dev Starts Here**
   - Implement auth endpoints first
   - Use the exact response format
   - Test with Postman/Insomnia

2. **Frontend Integration**
   - Update .env.local
   - Set ENABLE_MOCK_API=false
   - Test feature by feature

3. **Debugging**
   - Check browser console
   - Check network tab
   - Frontend logs all API calls in dev mode

## Questions?
The frontend is fully prepared with:
- ✅ Service layer for all API calls
- ✅ Type definitions for all data
- ✅ Error handling
- ✅ Loading states
- ✅ Authentication flow

Just implement the API endpoints and the frontend will work!