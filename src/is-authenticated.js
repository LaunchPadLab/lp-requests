import { getLpAuthCookie, parseObject } from './utils'

/**
 * A helper function to determine if the current user is authenticated.
 * This returns true when the LP Redux Api cookie exists and contains a
 * token.
 * 
 * Note, this does not **validate** the token, it only checks for
 * presence, validation must be done on the server.
 * 
 * @returns {Boolean}
 * @example
 * 
 * // After sign in
 * isAuthenticated() // true
 * 
 * // After sign out
 * isAuthenticated() // false
 */
export default function isAuthenticated () {
  const lpAuthCookie = getLpAuthCookie()
  if (!lpAuthCookie) return false
  const lpAuthToken = getToken(lpAuthCookie)
  return !!lpAuthToken
}

function getToken(cookie) {
  const cookieObj = parseObject(cookie)
  return cookieObj ? cookieObj.token : cookie
}