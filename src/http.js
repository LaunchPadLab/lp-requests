import fetch from 'isomorphic-fetch'
import { isTokenMethod, getToken } from './csrf'
import { camelizeKeys, decamelizeKeys, omitUndefined } from './utils'
import HttpError from './http-error'
import joinUrl from 'url-join'

/**
 * 
 * A wrapper function for the [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
 * that adds default request settings and handles CRSF token logic.
 *
 * This function adds the following config settings to the given request:
 * ```
 * {
 *   credentials: 'same-origin',
 *   headers: [
 *     'Accept': 'application/json',
 *     'X-Requested-With': 'XMLHttpRequest',
 *     'Content-Type': 'application/json'
 *   ],
 *   mode: 'same-origin'
 * }
 * ```
 * Any one of these settings can be overriden using the passed-in config object.
 *
 * In addition to the normal Fetch API settings, the config object may also contain these special settings just for `http`:
 * - `'root'`: A path to be appended to the given endpoint (default=`''`).
 * - `'crsf'`: The name of the `meta` tag containing the CSRF token (default=`'csrf-token'`). This can be set to `false` to prevent a token from being sent.
 * - `'before'`: A function that's called before the request executes. This function is passed the request configuration and its return value will be used as the new configuration.
 * - `'bearerToken'`: A token to use for bearer auth. If provided, `http` will add the header `"Authorization": "Bearer <bearerToken>"` to the request.
 *
 *
 * @name http
 * @type Function
 * @param {String} endpoint - The URL of the request
 * @param {Object} config - An object containing config information for the `Fetch` request, as well as the extra keys noted above.
 * @returns {Promise} A Promise that either resolves with the response or rejects with an {@link HttpError}.
 * 
 * @example
 * 
 * function getUsers () {
 *   return http('/users', { 
 *      root: 'www.my.cool.api.com', 
 *      crsf: 'custom-token-name'
 *   })
 * }
 * 
 * getUsers()
 *    .then(res => console.log('The users are', res))
 *    .catch(err => console.log('An error occurred!', err))
 */

const DEFAULT_OPTIONS = {
  credentials: 'same-origin',
  mode: 'same-origin',
  headers: {
    'Accept': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
    'Content-Type': 'application/json',
  }
}

function http (endpoint, options={}) {

  const { root, csrf=true, headers, bearerToken, ...rest } = beforeHook(options)

  const authHeaders = getAuthHeaders(bearerToken)

  let config = omitUndefined({
    ...DEFAULT_OPTIONS,
    headers: { ...DEFAULT_OPTIONS.headers, ...authHeaders, ...headers },
    ...rest
  })

  if (config.body) config.body = JSON.stringify(decamelizeKeys(config.body))

  // Include token if necessary
  if (isTokenMethod(config.method) && csrf) {
    const token = getToken(csrf)
    if (token) config.headers = { ...config.headers, 'X-CSRF-Token': token }
  }

  // Build full URL
  const endpointUrl = root ? joinUrl(root, endpoint) : endpoint

  return fetch(endpointUrl, config)
    .then(response => response.json()
      .then(json => {
        const camelized = camelizeKeys(json.data || json)
        if (response.ok) return camelized
        throw new HttpError(response.status, response.statusText, camelized)
      })
    )
}

// Run before hook (if provided) and set options if value is returned
function beforeHook ({ before, ...options }) {
  return before ? before(options) : options
}

// Return bearer authorization header if token is present
function getAuthHeaders (bearerToken) {
  return bearerToken ? { 'Authorization': `Bearer ${bearerToken}` } : {}
}

export default http
