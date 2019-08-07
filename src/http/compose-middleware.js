import { ensureAsync, asyncReduce } from '../utils'
import { assign } from 'lodash/fp'

/**
 *
 * A utility function that composes multiple request middlewares into a single function.
 * This can be used to create more complex `before` hooks for {@link http}.
 *
 * @name composeMiddleware
 * @type Function
 * @param {...Function} middlewares - Functions that receive and return request options
 * @returns {Function} A composed middleware function
 *
 * @example
 *
 * function addBearerToken () {
 *    const token = getTokenFromStorage()
 *    if (token) return { bearerToken: token }
 * }
 * 
 * function addPathToUrl ({ url }) {
 *    return {
 *      url: url + '/some-path'
 *    }
 * }
 * 
 * const before = composeMiddleware(
 *    addBearerToken,
 *    addPathToUrl,
 * )
 * 
 * // this will call both middlewares before the request
 * http('/users', { before }) 
 * 
 * 
 */

function composeMiddleware (...middlewares) {
  // Note: An async reducer is used because we want to allow middleware
  // to return promises if they want.
  const asyncMiddlewares = middlewares.map(ensureAsync)
  return function callMiddleware (initialValue) {
    return asyncReduce(
      asyncMiddlewares,
      async (acc, middleware) => {
        const result = await middleware(acc)
        return assign(acc, result || {})
      },
      initialValue
    )
  }
}

export default composeMiddleware