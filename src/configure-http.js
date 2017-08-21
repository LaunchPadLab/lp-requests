import http from './http'

/**
 * 
 * A function that returns a configured instance of the {@link http} module.
 * This function's argument will be used as the default config for the returned instance.
 *
 * Note: This configuration can always be overridden by passing in options manually.
 *
 * @name configureHttp
 * @type Function
 * @param {Object} config - An http configuration object
 * @returns {Object} A configured http instance
 * 
 * @example
 * 
 * const myHttp = configureHttp({ root: 'http://example.com', mode: 'cors' })
 * 
 * myHttp('/thing', { method: 'GET' }) // A cors request will be made to "http://example.com/thing"
 * 
 * 
 */


function configureHttp (defaults) {
  return function configuredHttp (endpoint, options) {
    return http(endpoint, { ...defaults, ...options })
  }
}

export default configureHttp