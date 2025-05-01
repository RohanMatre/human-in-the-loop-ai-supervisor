// Request status constants
export const REQUEST_STATUS = {
  PENDING: 'pending' as const,
  RESOLVED: 'resolved' as const,
  TIMEOUT: 'timeout' as const
};

// Conversation role constants
export const CONVERSATION_ROLE = {
  SYSTEM: 'system' as const,
  USER: 'user' as const,
  ASSISTANT: 'assistant' as const
};

// API routes
export const API_ROUTES = {
  REQUESTS: '/api/requests',
  KNOWLEDGE: '/api/knowledge',
  STATS: '/api/stats',
  SIMULATE_CALL: '/api/simulate/call'
};

// Timeout values (in milliseconds)
export const TIMEOUTS = {
  REQUEST_TIMEOUT: 24 * 60 * 60 * 1000, // 24 hours
  RESPONSE_NOTIFICATION: 30 * 1000, // 30 seconds
  POLLING_INTERVAL: 5000 // 5 seconds
}; 