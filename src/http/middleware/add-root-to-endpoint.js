import join from 'url-join'

function addRootToEndpoint ({ root, endpoint }) {
  if (!root) return
  return {
    endpoint: join(root, endpoint)
  }
}

export default addRootToEndpoint