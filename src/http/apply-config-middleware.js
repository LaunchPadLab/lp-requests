import { ensureAsync, asyncReduce } from '../utils'
import { merge } from 'lodash'

function mergeOptions (oldOptions, newOptions) {
  return merge({}, oldOptions, newOptions || {})
}

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