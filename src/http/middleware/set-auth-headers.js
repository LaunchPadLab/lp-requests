// Sets auth headers if necessary

function addAuthHeaders ({ 
  auth,
  bearerToken, 
  headers, 
  overrideHeaders=false, 
}) {
  if (overrideHeaders) return
  let authToken = bearerToken
  if (auth) {
    const username = auth.username || ''
    const password = auth.password || ''
    authToken = window.btoa(`${ username }:${ password }`)
  }
  if (!authToken) return
  const authHeader = auth ? `Basic ${ authToken }` : `Bearer ${ authToken }`
  return {
    headers: { ...headers, 'Authorization': authHeader }
  }
}

export default addAuthHeaders