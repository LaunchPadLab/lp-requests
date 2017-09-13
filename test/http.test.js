import { http } from '../src'
import { successUrl, failureUrl } from 'isomorphic-fetch'

// These tests rely on the mock Fetch() 
// returning options as the response

test('http adds default settings to request', () => {
  return http(successUrl, {
    method: 'DELETE'
  }).then((res) => {
    expect(res.credentials).toEqual('same-origin')
    expect(res.headers.accept).toEqual('application/json')
    expect(res.method).toEqual('DELETE')
  })
})

test('http overrides default settings correctly', () => {
  return http(successUrl, {
    method: 'GET',
    credentials: 'cors'
  }).then((res) => {
    expect(res.credentials).toEqual('cors')
    expect(res.headers.accept).toEqual('application/json')
  })
})

test('http adds default CSRF token to request', () => {
  return http(successUrl, {
    method: 'POST'
  }).then((res) => {
    expect(res.headers.xCSRFToken).toEqual(DEFAULT_CSRF_TOKEN)
  })
})

test('http does not add CSRF token to GET request', () => {
  return http(successUrl, {
    method: 'GET'
  }).then((res) => {
    expect(res.headers.xCSRFToken).toEqual(undefined)
  })
})

test('http adds custom CSRF token to request', () => {
  return http(successUrl, {
    method: 'POST',
    csrf: CUSTOM_TAG_NAME
  }).then((res) => {
    expect(res.headers.xCSRFToken).toEqual(CUSTOM_CSRF_TOKEN)
  })
})

test('http passes url to request', () => {
  return http(successUrl).then((res) => {
    expect(res.url).toEqual(successUrl)
  })
})

test('http prepends custom root to request', () => {
  const root = 'http://root/api/v1'
  return http(successUrl, {
    method: 'POST',
    root
  }).then((res) => {
    expect(res.url).toEqual(`${root}${successUrl}`)
  })
})

test('http modifies configuration using `before` hook', () => {
  const before = () => ({ foo: 'bar' })
  return http(successUrl, { before }).then((res) => {
    delete res.url
    expect(res.foo).toEqual('bar')
  })
})

test('http `before` hook can return a promise', () => {
  const before = () => Promise.resolve({ foo: 'bar' })
  return http(successUrl, { before }).then((res) => {
    delete res.url
    expect(res.foo).toEqual('bar')
  })
})

test('http adds auth header if bearer token is provided', () => {
  const TOKEN = 'hello there'
  return http(successUrl, { 
    bearerToken: TOKEN
  }).then((res) => {
    expect(res.headers.authorization).toEqual(`Bearer ${TOKEN}`)
  })
})

test('http throws an HttpError on request failure', () => {
  return http(failureUrl, {
    method: 'POST'
  }).catch((err) => {
    expect(err.name).toEqual('HttpError')
  })
})

test('http pulls data from response using successDataPath', () => {
  return http(successUrl, {
    method: 'POST',
    successDataPath: 'method',
  }).then((res) => {
    expect(res).toEqual('POST')
  })
})

test('http pulls data from failure response using failureDataPath', () => {
  return http(failureUrl, {
    method: 'POST',
    failureDataPath: 'method',
  }).catch((err) => {
    expect(err.response).toEqual('POST')
  })
})


test('http adds query string if query hash is provided', () => {
  return http(successUrl, {
    method: 'POST',
    query: { foo: 'bar' }
  }).then((res) => {
    expect(res.url).toEqual(`${successUrl}?foo=bar`)
  })
})

test('http decamelizes query string by default', () => {
  return http(successUrl, {
    method: 'POST',
    query: { foo: 'bar', fooBar: 'baz' }
  }).then((res) => {
    expect(res.url).toEqual(`${successUrl}?foo=bar&foo_bar=baz`)
  })
})

/* MOCK STUFF */

// Mock token elements
const createTokenTag = (name, content) => {
  const tag = document.createElement('meta')
  tag.name = name
  tag.content = content
  return tag
} 
const DEFAULT_TAG_NAME = 'csrf-token'
const DEFAULT_CSRF_TOKEN = 'DEFAULT_CSRF_TOKEN'
const CUSTOM_TAG_NAME = 'my custom tag'
const CUSTOM_CSRF_TOKEN = 'CUSTOM_CSRF_TOKEN'

// Mock querySelector
document.querySelector = (query) => {
  if (query.includes(DEFAULT_TAG_NAME)) return createTokenTag(DEFAULT_TAG_NAME, DEFAULT_CSRF_TOKEN)
  if (query.includes(CUSTOM_TAG_NAME)) return createTokenTag(CUSTOM_TAG_NAME, CUSTOM_CSRF_TOKEN)
  return null
}