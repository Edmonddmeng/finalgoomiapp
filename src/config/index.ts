// Application configuration
export const config = {
  // API Configuration
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_URL || 'https://goomi-community-backend.onrender.com/api',
    wsUrl: process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3001/ws',
    timeout: 30000,
  },

  // Application Configuration
  app: {
    name: process.env.NEXT_PUBLIC_APP_NAME || 'Goomi',
    url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    version: '1.0.0',
  },

  // Feature Flags
  features: {
    aiFeatures: process.env.NEXT_PUBLIC_ENABLE_AI_FEATURES === 'true',
    websocket: process.env.NEXT_PUBLIC_ENABLE_WEBSOCKET === 'true',
    offlineMode: process.env.NEXT_PUBLIC_ENABLE_OFFLINE_MODE === 'true',
    mockApi: process.env.NEXT_PUBLIC_ENABLE_MOCK_API === 'true',
    debugMode: process.env.NEXT_PUBLIC_DEBUG_MODE === 'true',
  },

  // Third-party Services
  services: {
    google: {
      clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '',
    },
    stripe: {
      publicKey: process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY || '',
    },
  },

  // Analytics
  analytics: {
    gaTrackingId: process.env.NEXT_PUBLIC_GA_TRACKING_ID || '',
    sentryDsn: process.env.NEXT_PUBLIC_SENTRY_DSN || '',
  },

  // Authentication
  auth: {
    tokenKey: 'goomi_auth_tokens',
    userKey: 'goomi_user',
    refreshTokenExpiry: 30 * 24 * 60 * 60 * 1000, // 30 days
    accessTokenExpiry: 7 * 24 * 60 * 60 * 1000, // 7 days
  },

  // Storage Keys
  storage: {
    prefix: 'goomi_',
    keys: {
      user: 'user',
      tasks: 'tasks',
      academics: 'academics',
      competitions: 'competitions',
      activities: 'activities',
      communities: 'communities',
      settings: 'settings',
      evaluations: 'evaluations',
      grandGoal: 'grand_goal',
    },
  },

  // API Rate Limits (for client-side tracking)
  rateLimits: {
    general: { requests: 100, window: 60 * 1000 }, // 100 requests per minute
    auth: { requests: 10, window: 60 * 1000 }, // 10 requests per minute
    upload: { requests: 10, window: 60 * 60 * 1000 }, // 10 requests per hour
  },
}

// Helper function to get storage key
export const getStorageKey = (key: keyof typeof config.storage.keys): string => {
  return `${config.storage.prefix}${config.storage.keys[key]}`
}

// Helper function to check if running in development
export const isDevelopment = process.env.NODE_ENV === 'development'

// Helper function to check if running in production
export const isProduction = process.env.NODE_ENV === 'production'

// Export type for config
export type AppConfig = typeof config