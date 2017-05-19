// Helpers for getting CSRF token from document body

const CSRF_METHODS = ['PATCH', 'POST', 'PUT', 'DELETE']
const DEFAULT_CSRF_SELECTOR = 'csrf-token'

// Returns true if request may need token
export function isTokenMethod (method) {
  return CSRF_METHODS.includes(method)
}

// Returns CSRF token from the domcument body if token is needed for request
// "csrf" may be either:
// - A boolean indicating whether the token is needed (will use default selector to find it)
// - The name of the meta tag containing the token 

export function getToken (csrf) {
  // Check whether token is needed
  if (!csrf) return null
  const selector = (typeof csrf === 'string') ? csrf : DEFAULT_CSRF_SELECTOR
  return getTokenFromDocument(selector)
}

// Given the name of the meta tag containing the token,
// retrieves it from the document body if it exists.

function getTokenFromDocument (selector) {
  if (typeof document === 'undefined') return null
  const token = document.querySelector(`meta[name="${selector}"]`)
  if (token && (token instanceof window.HTMLMetaElement)) return token.content
  return null
}