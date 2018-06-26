import { stringify } from 'query-string'
import { decamelizeKeys } from 'humps'

// Adds a query string to the endpoint if a 'query' option is provided

function addQueryToEndpoint ({ query, decamelizeQuery=true, endpoint }) {
  if (!query) return
  const transformedQuery = decamelizeQuery ? decamelizeKeys(query) : query
  return {
    endpoint: endpoint + '?' + stringify(transformedQuery)
  }
}

export default addQueryToEndpoint