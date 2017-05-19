import humps from 'humps'
import omitBy from 'lodash/omitBy'
import isUndefined from 'lodash/isUndefined'

export { default as get } from 'lodash/fp/get'
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

