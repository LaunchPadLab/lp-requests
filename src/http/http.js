import fetch from 'isomorphic-fetch'
import { isTokenMethod, getToken } from './csrf'
import { camelizeKeys, decamelizeKeys, omitUndefined, getDataAtPath } from '../utils'
import HttpError from '../http-error'
import {
  runBeforeHook,
  getAuthHeaders,
  isJSONRequest,
  buildUrl,
} from './helpers'

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
 * - `'before'`: A function that's called before the request executes. This function is passed the request options and its return value will be added to those options.
 * - `'bearerToken'`: A token to use for bearer auth. If provided, `http` will add the header `"Authorization": "Bearer <bearerToken>"` to the request.
 * - `successDataPath`: A path to response data that the promise will resolve with.
 * - `failureDataPath`: A path to response data that will be included in the HttpError object.
 * - `query`: An object that will be transformed into a query string and appended to the request URL.
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
  // Run "before" hook and pull out non-fetch options
  const { 
    root, 
    csrf=true, 
    headers={}, 
    bearerToken,
    successDataPath,
    failureDataPath,
    query,
    ...rest
  } = runBeforeHook(options)
  // Build fetch config
  const fetchConfig = omitUndefined({
    ...DEFAULT_OPTIONS,
    headers: { ...DEFAULT_OPTIONS.headers, ...getAuthHeaders(bearerToken), ...headers },
    ...rest,
  })
  // Decamlize and stringify body if it's a JSON request
  if (isJSONRequest(fetchConfig) && fetchConfig.body) fetchConfig.body = JSON.stringify(decamelizeKeys(fetchConfig.body))
  // Include token if necessary
  if (isTokenMethod(fetchConfig.method) && csrf) {
    const token = getToken(csrf)
    if (token) fetchConfig.headers = { ...fetchConfig.headers, 'X-CSRF-Token': token }
  }
  // Build full URL
  const url = buildUrl({ root, endpoint, query })
  // Make request
  return fetch(url, fetchConfig)
    .then(response => response.json()
      .then(json => {
        const camelized = camelizeKeys(json)
        if (response.ok) return getDataAtPath(camelized, successDataPath)
        throw new HttpError(response.status, response.statusText, getDataAtPath(camelized, failureDataPath))
      })
    )
}

export default http
