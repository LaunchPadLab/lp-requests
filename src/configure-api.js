import { Api } from './api'

/**
 * 
 * A function that returns a configured instance of the {@link api} module.
 * This function's argument will be used as the default config for the returned instance.
 *
 * Note: This configuration can always be overridden by passing in options manually.
 *
 * @name configureApi
 * @type Function
 * @param {Object} config - An api configuration object
 * @param {Object} [baseApi] - An existing api instance to extend with the configuration
 * @returns {Object} A configured api instance
 * 
 * @example
 * 
 * const myApi = configureApi({ root: 'http://example.com', mode: 'cors' })
 * 
 * myApi.get('/thing') // A cors request will be made to "http://example.com/thing"
 * 
 * 
 */

function configureApi (defaults, baseApi=new Api()) {
  return new Api({ ...baseApi.defaults, ...defaults })
}

export default configureApi