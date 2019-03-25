import { pick } from 'lodash'

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
]

// Extracts all fetch options into a single object in preparation for passing to Fetch().
// This should be the last middleware applied.

function extractFetchOptions (config) {
  return {
    fetchOptions: pick(config, FETCH_OPTIONS)
  }
}

export default extractFetchOptions