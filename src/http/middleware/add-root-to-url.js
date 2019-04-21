import join from 'url-join'

// Prepends a root to the url if a 'root' option is provided

function addRootToUrl ({ root, url }) {
  if (!root) return
  return {
    url: join(root, url)
  }
}

export default addRootToUrl