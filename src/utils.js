import humps from 'humps'
import omitBy from 'lodash/omitBy'
import isUndefined from 'lodash/isUndefined'
import isError from 'lodash/isError'
import attempt from 'lodash/attempt'
import Cookies from 'js-cookie'
import isPromise from 'is-promise'

import get from 'lodash/fp/get'
export { get }
export { default as set } from 'lodash/fp/set'
export { default as unset } from 'lodash/fp/unset'
export { default as compose } from 'lodash/fp/compose'
export { default as union } from 'lodash/union'

// A wrapper around the humps library
// Converts all keys of the given object to camelCase
// EXCEPT keys that begin with an underscore to
// support specific keys such as the `_error`
// key used by Redux Form to communicate errors
// that are not tied to specific form fields.
export function camelizeKeys (obj) {
  return humps.camelizeKeys(obj, (key, convert) =>
    /^_/.test(key) ? key : convert(key)
  )
}

// A wrapper around the humps library
// Converts all keys of the given object to lower_case
export function decamelizeKeys (obj) {
  return humps.decamelizeKeys(obj)
}

// Given an object, returns a copy of that object
// with all keys with undefined values removed
export function omitUndefined (obj) {
  return omitBy(obj, isUndefined)
}

// Parses an object from a string and returns the result
// Returns undefined if there's a parsing error
export function parseObject (str) {
  const parsedObj = attempt(() => JSON.parse(str))
  if (!isError(parsedObj)) return parsedObj
}

// Gets the auth cookie used by lp_token_auth
// Returns undefined if the cookie is not set
export function getLpAuthCookie () {
  return Cookies.get('lp_auth')
}

// Gets data at path if path exists,
// otherwise returns full object
export function getDataAtPath (obj, path) {
  return path ? get(path, obj) : obj
}

// Runs a function and returns a promise with the result
// If the function returns a promise, simply returns that
export function awaitResult (func) {
  const result = func()
  return isPromise(result) ? result : Promise.resolve(result)
}
