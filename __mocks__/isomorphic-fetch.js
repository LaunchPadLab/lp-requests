export const successUrl = '/success'
export const failureUrl = '/failure'
export const unauthorizedUrl = '/unauthorized'
export const networkErrorUrl = '/network-error'

const statuses = {
  [successUrl]: 200,
  [failureUrl]: 400,
  [unauthorizedUrl]: 401
}

export default jest.fn(function (url, options) {
  const response = {
    // Response echoes back passed options
    json: () => Promise.resolve({ ...options, url }),
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
