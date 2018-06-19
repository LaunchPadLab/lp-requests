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
  'endpoint', // Not a real fetch option but we use it
]

function filterFetchOptions (config) {
  return pick(config, FETCH_OPTIONS)
}

export default filterFetchOptions