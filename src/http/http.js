import fetch from 'isomorphic-fetch'
import { attemptAsync, isError, camelizeKeys, getDataAtPath, noop, isString } from '../utils'
import HttpError from '../http-error'
import composeMiddleware from './compose-middleware'
import {
  setDefaults,
  setAuthHeaders,
  addQueryToUrl,
  serializeBody,
  includeCSRFToken,
  extractFetchOptions,
  addRootToUrl,
} from './middleware'

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
 * - `'url'`: The url for the request. This can also be passed in directly as the first argument (see shorthand example).
 * - `'root'`: A path to be appended to the given url (default=`''`).
 * - `'crsf'`: The name of the `meta` tag containing the CSRF token (default=`'csrf-token'`). This can be set to `false` to prevent a token from being sent.
 * - `'before'`: A function that's called before the request executes. This function is passed the request options and its return value will be added to those options.
 *    It can also return a promise that resolves to a new options object.
 * - `'bearerToken'`: A token to use for bearer auth. If provided, `http` will add the header `"Authorization": "Bearer <bearerToken>"` to the request.
 * - `'onSuccess'`: A function that will be called if the request succeeds. It will be passed the successful response. If it returns a value, `http` will resolve with this value instead of the response.
 * - `'onFailure'`: A function that will be called if the request fails. It will be passed the error that was thrown during the request. If it returns a value, `http` will reject with this value instead of the default error.
 * - `successDataPath`: A path to response data that the promise will resolve with.
 * - `failureDataPath`: A path to the errors that will be included in the HttpError object (default=`'errors'`)
 * - `query`: An object that will be transformed into a query string and appended to the request URL.
 * - `overrideHeaders`: A boolean flag indicating whether or not default headers should be included in the request (default=`false`).
 * - `camelizeResponse`: A boolean flag indicating whether or not to camelize the response keys (default=`true`). The helper function that does this is also exported from this library as `camelizeKeys`.
 * - `decamelizeBody`: A boolean flag indicating whether or not to decamelize the body keys (default=`true`). The helper function that does this is also exported from this library as `decamelizeKeys`.
 * - `decamelizeQuery`: A boolean flag indicating whether or not to decamelize the query string keys (default=`true`).
 * - `parseJsonStrictly`: A boolean flag indicating whether or not to return the text of the response body if JSON parsing fails (default=`true`). If set to `true` and invalid JSON is received in the response, then `null` will be returned instead.
 * - `auth`: An object with the following keys `{ username, password }`. If present, `http` will use [basic auth](https://en.wikipedia.org/wiki/Basic_access_authentication#Client_side), adding the header `"Authorization": "Basic <authToken>"` to the request, where `<authToken>` is a base64 encoded string of `username:password`.
 *
 * @name http
 * @type Function
 * @param {Object} config - An object containing config information for the `Fetch` request, as well as the extra keys noted above.
 * @returns {Promise} A Promise that either resolves with the response or rejects with an {@link HttpError}.
 *
 * @example
 *
 * function getUsers () {
 *   return http({
 *      url: '/users',
 *      root: 'www.my.cool.api.com',
 *      crsf: 'custom-token-name'
 *   })
 * }
 *
 * getUsers()
 *    .then(res => console.log('The users are', res))
 *    .catch(err => console.log('An error occurred!', err))
 *
 * // Shorthand: pass `url` as first argument:
 * function getUsers () {
 *   return http('/users', options)
 * }
 *
 */

// Enable shorthand with optional string `url` first argument.
export function parseArguments (...args) {
  const [ firstArg, secondArg ] = args
  const hasUrlArgument = isString(firstArg)
  if (!hasUrlArgument) return firstArg || {}
  const options = secondArg || {}
  return { ...options, url: firstArg }
}

// Get JSON from response
async function getResponseBody(response, { parseJsonStrictly }) {
  // Don't parse empty body
  if (response.headers.get('Content-Length') === '0' || response.status === 204) return null
  let data
  try {
    data = await response.text()
    return JSON.parse(data)
  } catch (e) {
    if (parseJsonStrictly) {
      // eslint-disable-next-line
      console.warn('Failed to parse response body: ' + e, response)
      return null
    }
    return data
  }
}

async function http (...args) {
  const {
    before=noop,
    __mock_response, // used for unit testing
    ...options
  } = parseArguments(...args)

  const parsedOptions = await composeMiddleware(
    before,
    setDefaults,
    setAuthHeaders,
    addRootToUrl,
    addQueryToUrl,
    serializeBody,
    includeCSRFToken,
    extractFetchOptions,
  )(options)

  const {
    onSuccess,
    onFailure,
    camelizeResponse,
    successDataPath,
    failureDataPath,
    url,
    fetchOptions,
    parseJsonStrictly,
  } = parsedOptions
  // responseData is either the body of the response, or an error object.
  const responseData = await attemptAsync(async () => {
    // Make request
    const response = __mock_response ?? await fetch(url, fetchOptions)
    // Parse the response
    const body = await getResponseBody(response, { parseJsonStrictly })
    const data = camelizeResponse ? camelizeKeys(body) : body
    if (!response.ok) {
      const errors = getDataAtPath(data, failureDataPath)
      throw new HttpError(response.status, response.statusText, data, errors)
    }
    return data
  })
  // Handle success and error cases
  if (isError(responseData)) throw onFailure(responseData)
  return onSuccess(getDataAtPath(responseData, successDataPath))
}

export default http
