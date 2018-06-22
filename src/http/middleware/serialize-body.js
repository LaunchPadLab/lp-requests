import { decamelizeKeys } from 'humps'

function isJSONRequest (headers) {
  return headers['Content-Type'] === 'application/json'
}

// Serializes the request body if necessary

function serializeBody ({ decamelizeBody=true, headers, body }) {
  if (!body || !isJSONRequest(headers)) return
  const transformedBody = decamelizeBody ? decamelizeKeys(body) : body
  return {
    body: JSON.stringify(transformedBody)
  }
}

export default serializeBody