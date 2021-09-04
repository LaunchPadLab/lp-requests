export const successUrl = '/success'
export const noContentUrl = '/no-content'
export const failureUrl = '/failure'
export const unauthorizedUrl = '/unauthorized'
export const networkErrorUrl = '/network-error'

const statuses = {
  [successUrl]: 200,
  [noContentUrl]: 204,
  [failureUrl]: 400,
  [unauthorizedUrl]: 401
}

export default jest.fn(function (url, options) {
  const { headers={} } = options
  const body = { ...options, url }

  const response = {
    // Response echoes back passed options
    headers: {
      get: (header) => {
        return headers[header]
      },
      ...headers,
    },
    json: () => Promise.resolve(body),
    ok: ![failureUrl, unauthorizedUrl].includes(url),
    status: statuses[url]
  }
  // Simulate server response
  return new Promise((resolve, reject) => {
    setTimeout(
      () => (url === networkErrorUrl) ? reject('Network error') : resolve(response)
    , 10)
  })
})
