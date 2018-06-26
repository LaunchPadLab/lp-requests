// Sets auth headers if necessary

function addAuthHeaders ({ bearerToken, headers, overrideHeaders=false, useBasicAuth=false }) {
  if (overrideHeaders || !bearerToken) return
  const authHeader = useBasicAuth ? `Basic ${ window.btoa(bearerToken) }` : `Bearer ${ bearerToken }`
  return {
    headers: { ...headers, 'Authorization': authHeader }
  }
}

export default addAuthHeaders