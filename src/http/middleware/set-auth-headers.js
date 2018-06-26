// Sets auth headers if necessary

function addAuthHeaders ({ bearerToken, headers, overrideHeaders = false, useBasicAuth = false }) {
  if (overrideHeaders || !bearerToken) return
  const authType = useBasicAuth ? `Basic` : `Bearer`
  return {
    headers: { ...headers, 'Authorization': `${ authType } ${ bearerToken }` }
  }
}

export default addAuthHeaders