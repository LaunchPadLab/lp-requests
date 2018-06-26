import Base64 from 'Base64'

// Sets auth headers if necessary

function addAuthHeaders ({ 
  auth,
  bearerToken, 
  headers, 
  overrideHeaders=false, 
}) {
  if (overrideHeaders) return
  if (bearerToken) return { 
    headers: { ...headers, Authorization: `Bearer ${ bearerToken }` } 
  }
  if (auth) {
    const username = auth.username || ''
    const password = auth.password || ''
    const encodedToken = Base64.btoa(`${ username }:${ password }`)
    return {
      headers: { ...headers, Authorization: `Basic ${ encodedToken }` }
    }
  }
}

export default addAuthHeaders