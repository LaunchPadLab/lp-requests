import { getLpAuthCookie, parseObject } from './utils'

/**
 * A helper function to determine if the current user is authenticated.
 * This function accepts an object argument with a `context` key.
 *
 * _Note, this does not **validate** the token, it only checks for
 * presence, validation must be done on the server._
 * @name isAuthenticated
 * @type {Function}
 * @param {Object} [options={}] - config object containing the context
 * @returns {Boolean} True when the LP Auth Api cookie exists and contains a token.
 * If the `context` key is present, this function returns true if the user is
 * both authenticated and the specified context is present.
 *
 * @example
 *
 * // WITHOUT context
 *
 * // After sign in
 * isAuthenticated() // true
 *
 * // After sign out
 * isAuthenticated() // false
 *
 * // WITH context
 *
 * // After an 'admin' signs in
 * isAuthenticated({ context: 'admin' }) // true
 *
 * isAuthenticated({ context: 'non-admin' }) // false
 *
 * // After sign out
 * isAuthenticated({ context: 'admin' }) // false
 *
 * isAuthenticated({ context: 'non-admin' }) // false
 */
export default function isAuthenticated (options = {}) {
  const { context } = options
  const lpAuthCookie = getLpAuthCookie()
  if (!lpAuthCookie) return false
  if (context !== undefined) return isAuthenticatedWithContext(lpAuthCookie, context)
  const lpAuthToken = getToken(lpAuthCookie)
  return !!lpAuthToken
}

function getToken(cookie) {
  const cookieObj = parseObject(cookie)
  return cookieObj ? cookieObj.token : cookie
}

function isAuthenticatedWithContext (cookie, context) {
  const cookieObj = parseObject(cookie)
  if (!cookieObj) return false
  return cookieObj.token && cookieObj.context === context
}