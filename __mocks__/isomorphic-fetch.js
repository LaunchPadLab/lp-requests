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

export class MockResponse {
  #text

  constructor(url, options, body = null) {
    const { headers={} } = options
    this.headers = {
      get: (header) => headers[header],
      ...headers
    }
    this.body = body ?? { ...options, url }
    this.ok = ![failureUrl, unauthorizedUrl].includes(url)
    this.status = statuses[url]
    this._config = options
    this.#text = typeof body === 'string' ? body : JSON.stringify(this.body)
  }

  json() {
    return Promise.resolve(this.body)
  }

  text() {
    return Promise.resolve(this.#text)
  }
}

export default jest.fn(function fetch(url, options) {
  const response = new MockResponse(url, options)

  // Simulate server response
  return new Promise((resolve, reject) => {
    setTimeout(
      () => (url === networkErrorUrl) ? reject('Network error') : resolve(response)
    , 10)
  })
})
