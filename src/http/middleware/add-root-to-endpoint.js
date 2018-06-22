import join from 'url-join'

// Prepends a root to the endpoint if a 'root' option is provided

function addRootToEndpoint ({ root, endpoint }) {
  if (!root) return
  return {
    endpoint: join(root, endpoint)
  }
}

export default addRootToEndpoint