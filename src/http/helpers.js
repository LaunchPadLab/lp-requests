import join from 'url-join'
import { decamelizeKeys } from 'humps'
import { stringify } from 'query-string'
import { awaitResult } from '../utils'

// http helpers

// Default before hook returns empty options
function defaultBefore () {
  return {}
}

// Run before hook (if provided) and add return value to options
export function runBeforeHook (before=defaultBefore, options) {
  // Grab new options from hook result or resolution of hook promise
  return awaitResult(before)
    .then(newOptions => ({ ...options, ...newOptions }))
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

