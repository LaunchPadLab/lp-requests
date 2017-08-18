import join from 'url-join'
import { decamelizeKeys } from 'humps'
import { stringify } from 'query-string'

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

// Build url string from root, endpoint and optional query hash
export function buildUrl ({ root, endpoint, query }) {
  const joinedUrl = root ? join(root, endpoint) : endpoint
  return joinedUrl + buildQueryString(query)
}

// Decamelize and stringify query hash
function buildQueryString (queryHash) {
  if (!queryHash) return ''
  return '?' + stringify(decamelizeKeys(queryHash))
}

