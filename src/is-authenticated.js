import { getLpAuthCookie, parseObject } from './utils'

/**
 * A helper function to determine if the current user is authenticated.
 * This function accepts as object argument with a `context` key.
 * If the `context` argument is present, this function determines if the user is
 * both authenticated and authenticated for the specificed context.
 * This returns true when the LP Redux Api cookie exists and contains a
 * token.
 * 
 * Note, this does not **validate** the token, it only checks for
 * presence, validation must be done on the server.
 * 
 * @returns {Boolean}
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
 * isAuthenticatedWithContext('admin') // true
 * 
 * isAuthenticatedWithContext('non-admin') // false
 * 
 * // After sign out
 * isAuthenticatedWithContext('admin') // false
 * 
 * isAuthenticatedWithContext('non-admin') // false
 */
export default function isAuthenticated ({ context } = {}) {
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