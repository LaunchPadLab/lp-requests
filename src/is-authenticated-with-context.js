import { getLpAuthCookie, parseObject } from './utils'

/**
 * A helper function to determine if the current user is authenticated
 * for a specific context. This is useful if the client needs to know
 * more about the type of user that is logged in.
 * 
 * This returns true when the LP Redux Api cookie exists, contains a
 * token, and contains the specified context.
 * 
 * Note, this does not **validate** the token, it only checks for
 * presence, validation must be done on the server.
 * 
 * @param {String} context - a context that corresponds to one provided by the server
 * @returns {Boolean}
 * @example
 * 
 * // After an 'admin' signs in
 * isAuthenticatedWithContext('admin') // true
 * 
 * isAuthenticatedWithContext('non-admin') // false
 * 
 * isAuthenticatedWithContext() // false
 * 
 * // After sign out
 * isAuthenticatedWithContext('admin') // false
 * 
 * isAuthenticatedWithContext('non-admin') // false
 * 
 * isAuthenticatedWithContext() // false
 */
export default function isAuthenticatedWithContext (context) {
  const lpAuthCookie = getLpAuthCookie()
  const cookieObj = parseObject(lpAuthCookie)
  if (!cookieObj) return false
  return cookieObj.token && cookieObj.context === context
}