import { returnPromise } from '../utils'

// TODO: refactor this shiz
function recursivelyCallMiddleware (config, middleware, nextMiddlewares) {
  if (!middleware) return Promise.resolve(config)
  const wrappedMiddleware = returnPromise(middleware)
  return wrappedMiddleware(config).then(result => {
    const newConfig = result || {}
    const mergedConfig = { ...config, ...newConfig }
    const [ next, ...remaining ] = nextMiddlewares
    return recursivelyCallMiddleware(mergedConfig, next, remaining)
  })
}

export default function applyConfigMiddleware (...middlewares) {
  return function parseOptions (options) {
    const [ next, ...remaining ] = middlewares
    return recursivelyCallMiddleware(options, next, remaining)
  }
}