// http helpers

// Run before hook (if provided) and add return value to options
export function runBeforeHook ({ before, ...options }) {
  return before ? { ...options, ...before(options) } : options
}

// Return bearer authorization header if token is present
export function getAuthHeaders (bearerToken) {
  return bearerToken ? { 'Authorization': `Bearer ${bearerToken}` } : {}
}

// Returns true if the upcoming request is a JSON request
export function isJSONRequest (config) {
  return config.headers['Content-Type'] === 'application/json'
}