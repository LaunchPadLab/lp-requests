import fetch from 'isomorphic-fetch'
import { camelizeKeys, getDataAtPath, noop, identity } from '../utils'
import HttpError from '../http-error'
import applyConfigMiddleware from './apply-config-middleware'
import {
  setDefaults,
  setAuthHeaders,
  addQueryToEndpoint,
  serializeBody,
  includeCSRFToken,
  filterFetchOptions,
  addRootToEndpoint,
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
 * - `'root'`: A path to be appended to the given endpoint (default=`''`).
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
 * - `camelizeResponse`: A boolean flag indicating whether or not to camelize the response keys (default=`true`).
 * - `decamelizeBody`: A boolean flag indicating whether or not to decamelize the body keys (default=`true`).
 * - `decamelizeQuery`: A boolean flag indicating whether or not to decamelize the query string keys (default=`true`).
 * - `useBasicAuth`: A boolean flag indicating whether or not to use [basic auth](https://en.wikipedia.org/wiki/Basic_access_authentication#Client_side) header (default=`false`). If true, `http` will add the header `"Authorization": "Basic <bearerToken>"` to the request, where `<bearerToken>` is a base64 encoded string of `username:password`.
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

function http (endpoint, { 
  onSuccess=identity, 
  onFailure=identity,
  camelizeResponse=true,
  before=noop,
  successDataPath,
  failureDataPath='errors',
  ...options
}={}) {
  // Apply config middleware, modifying the options in sequence
  return applyConfigMiddleware(
    before,
    setDefaults,
    setAuthHeaders,
    addRootToEndpoint,
    addQueryToEndpoint,
    serializeBody,
    includeCSRFToken,
    filterFetchOptions,
  )({ endpoint, ...options })
    // Make the fetch call
    .then(({ endpoint, ...config }) => fetch(endpoint, config))
    // Parse the response
    .then(res => res.json()
      .then(json => {
        const data = camelizeResponse ? camelizeKeys(json) : json
        if (res.ok) return getDataAtPath(data, successDataPath)
        const errors = getDataAtPath(data, failureDataPath)
        throw new HttpError(res.status, res.statusText, data, errors)
      })
    )
    // Call handlers
    .then(onSuccess)
    .catch(e => { throw onFailure(e) })
}

export default http
