import { stringify } from 'query-string'
import { decamelizeKeys } from 'humps'

// Adds a query string to the url if a 'query' option is provided

function addQueryToUrl ({ query, decamelizeQuery=true, url }) {
  if (!query) return
  const transformedQuery = decamelizeQuery ? decamelizeKeys(query) : query
  return {
    url: url + '?' + stringify(transformedQuery)
  }
}

export default addQueryToUrl