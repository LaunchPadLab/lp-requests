import { getLpAuthCookie, parseObject } from './utils'

/**
 * A helper function to retrieve the authentication context for the
 * authenticated user.
 *
 * This function returns the context string when the LP Auth Api cookie exists,
 * contains a valid token, and contains a context.
 *
 * This function returns `undefined` when there is no context present,
 * or if the LP Auth API cookie does not exist.
 *
 * @returns {String}
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
**/

export default function getAuthenticationContext () {
  const lpAuthCookie = getLpAuthCookie()
  const parsedCookie = parseObject(lpAuthCookie)
  if (parsedCookie && parsedCookie.token) return parsedCookie.context
}
