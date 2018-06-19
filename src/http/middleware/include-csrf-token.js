import { isString } from 'lodash'

const DEFAULT_CSRF_SELECTOR = 'csrf-token'
const CSRF_METHODS = ['PATCH', 'POST', 'PUT', 'DELETE']

// THis helper returns the CSRF token from the document body
// "csrf" may be either:
// - A boolean indicating whether the token is needed (will use default selector to find it)
// - The name of the meta tag containing the token 

function getTokenFromDocument (csrf) {
  if (!document) return
  const selector = isString(csrf) ? csrf : DEFAULT_CSRF_SELECTOR
  const meta = document.querySelector(`meta[name="${ selector }"]`)
  if (meta && (meta instanceof window.HTMLMetaElement)) return meta.content
}

function includeCSRFToken ({ method, csrf=true, headers }) {
  if (!csrf || !CSRF_METHODS.includes(method)) return
  const token = getTokenFromDocument(csrf)
  if (!token) return
  return {
    headers: { ...headers, 'X-CSRF-Token': token }
  }
}

export default includeCSRFToken