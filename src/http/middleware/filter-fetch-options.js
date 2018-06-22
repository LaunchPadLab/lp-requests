import { pick } from 'lodash'
import { omitUndefined } from '../../utils'

const FETCH_OPTIONS = [
  'method',
  'headers',
  'body',
  'mode',
  'credentials',
  'cache',
  'redirect',
  'referrer',
  'referrerPolicy',
  'integrity',
  'keepalive',
  'signal',
  'endpoint', // Not a real fetch option but we use it
]

// Removes all non-fetch options in preparation for passing to Fetch().
// This should be the last middleware applied.

function filterFetchOptions (config) {
  const definedOptions = omitUndefined(config)
  return pick(definedOptions, FETCH_OPTIONS)
}

export default filterFetchOptions