import fetch from 'isomorphic-fetch'
import { getToken } from './csrf'
import { camelizeKeys, decamelizeKeys, omitUndefined } from './utils'
import HttpError from './http-error'
import url from 'url'

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
 * In addition to the normal Fetch API settings, the config object may also contain two special settings just for `http`:
 * - `'root'`: A path to be appended to the given endpoint (default=`''`).
 * - `'crsf'`: The name of the `meta` tag containing the CSRF token (default=`'csrf-token'`). This can be set to `false` to prevent a token from being sent.
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

export const DEFAULT_HEADERS = {
  'Accept': 'application/json',
  'X-Requested-With': 'XMLHttpRequest',
  'Content-Type': 'application/json',
}

const DEFAULT_OPTIONS = {
  credentials: 'same-origin',
  mode: 'same-origin',
}

export default function http (endpoint, { root='', csrf=true, headers, ...options }) {

  const config = omitUndefined({
    ...DEFAULT_OPTIONS,
    headers: { ...DEFAULT_HEADERS, ...headers },
    ...options
  })

  if (config.body) config.body = JSON.stringify(decamelizeKeys(config.body))

  const csrfToken = getToken(csrf, config.method)
  if (csrfToken) config.headers['X-CSRF-Token'] = csrfToken

  // Build full URL
  const endpointUrl = url.resolve(root, endpoint)

  return fetch(endpointUrl, config)
    .then(response => response.json()
      .then(json => {
        const camelized = camelizeKeys(json.data || json)
        if (response.ok) return camelized
        throw new HttpError(response.status, response.statusText, camelized)
      })
    )
}
