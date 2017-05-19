import http from './http'

function configureHttp (defaults) {
  return function configuredHttp (endpoint, options) {
    return http(endpoint, { ...defaults, options })
  }
}

export default configureHttp