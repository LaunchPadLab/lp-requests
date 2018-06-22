import { ensureAsync, asyncReduce } from '../utils'
import { merge } from 'lodash'

function mergeOptions (oldOptions, newOptions) {
  return merge({}, oldOptions, newOptions || {})
}

// Creates an option-parsing function that applies each middleware in turn,
// and merges the results of each into the options. An async reducer is used
// because we want to allow middleware to return promises if they want.

function applyConfigMiddleware (...middleware) {
  const asyncMiddleware = middleware.map(ensureAsync)
  return function parseOptions (options) {
    return asyncReduce(
      asyncMiddleware, 
      (options, middleware) =>  middleware(options).then(newOptions => mergeOptions(options, newOptions)), 
      options
    )
  }
}

export default applyConfigMiddleware