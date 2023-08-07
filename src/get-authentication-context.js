import { getLpAuthCookie, parseObject } from './utils'

/**
 * A helper function to retrieve the authentication context for the
 * authenticated user.
 *
 * @name getAuthenticationContext
 * @type Function
 * @returns {String|Undefined} The context string when the LP Auth Api cookie exists, contains a valid token, and contains a context. Returns `undefined` when there is no context present, or if the LP Auth API cookie does not exist.
 *
 * @example
 *
 * // After an 'admin' signs in
 * getAuthenticationContext() // 'admin'
 *
 * // After a user with no context signs in
 * getAuthenticationContext() // undefined
 *
 * // After sign out
 * getAuthenticationContext() // undefined
 *
 */

export default function getAuthenticationContext () {
  const lpAuthCookie = getLpAuthCookie()
  const parsedCookie = parseObject(lpAuthCookie)
  if (parsedCookie && parsedCookie.token) return parsedCookie.context
}
