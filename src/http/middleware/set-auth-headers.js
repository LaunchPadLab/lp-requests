
function addAuthHeaders ({ bearerToken, headers, overrideHeaders=false }) {
  if (overrideHeaders || !bearerToken) return
  return {
    headers: { ...headers, 'Authorization': `Bearer ${bearerToken}` }
  }
}

export default addAuthHeaders