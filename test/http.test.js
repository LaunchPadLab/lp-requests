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

test('http `before` is passed request options', () => {
  const before = jest.fn()
  const myOptions = { my: 'options' }
  return http(successUrl, { before, ...myOptions }).then(() => {
    expect(before).toHaveBeenCalledWith(myOptions)
  })
})

test('http overrides header object if `overrideHeaders` is passed to `before` hook', () => {
  const before = () => ({ overrideHeaders: true, headers: { foo: 'bar' } })
  return http(successUrl, { before }).then((res) => {
    delete res.url
    expect(res.headers).toEqual({ foo: 'bar' })
  })
})

test('http onSuccess hook is called with request result', () => {
  expect.assertions(1)
  const onSuccess = jest.fn()
  return http(successUrl, { onSuccess }).then(res => {
    expect(onSuccess).toHaveBeenCalledWith(res)
  })
})

test('http onSuccess hook return value used as resolve value', () => {
  const NEW_RESOLVE_VALUE = 'NEW_RESOLVE_VALUE'
  const onSuccess = jest.fn(() => NEW_RESOLVE_VALUE)
  return http(successUrl, { onSuccess }).then(res => {
    expect(res).toEqual(NEW_RESOLVE_VALUE)
  })
})

test('http onFailure hook is called with request result', () => {
  expect.assertions(1)
  const onFailure = jest.fn()
  return http(failureUrl, { onFailure }).catch(e => {
    expect(onFailure).toHaveBeenCalledWith(e)
  })
})

test('http onSuccess hook return value used as reject value', () => {
  const NEW_REJECT_VALUE = 'NEW_REJECT_VALUE'
  const onFailure = jest.fn(() => NEW_REJECT_VALUE)
  return http(failureUrl, { onFailure }).catch(e => {
    expect(e).toEqual(NEW_REJECT_VALUE)
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
  expect.assertions(1)
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

test('http failureDataPath defaults to "errors"', () => {
  expect.assertions(1)
  const ERRORS = { 'someValue': 'there was an error' }
  return http(failureUrl, {
    method: 'POST',
    errors: ERRORS,
  }).catch((err) => {
    expect(err.errors).toEqual(ERRORS)
  })
})


test('http pulls data from failure response using failureDataPath', () => {
  expect.assertions(1)
  return http(failureUrl, {
    method: 'POST',
    failureDataPath: 'method',
  }).catch((err) => {
    expect(err.errors).toEqual('POST')
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

test('http camelizes json response by default', () => {
  return http(successUrl, {
    method: 'POST',
    camelized_key: 'a camelized key'
  }).then((res) => {
    expect(res).toHaveProperty('camelizedKey')
  })
})

test('http does not camelizes json response if camelize passed as false', () => {
  return http(successUrl, {
    camelizeResponse: false,
    Capitalized_key: 'a weirdly cased key'
  }).then((res) => {
    expect(res).toHaveProperty('Capitalized_key')
  })
})

test('http decamelizes json body by default', () => {
  return http(successUrl, {
    method: 'POST',
    body: {
      camelizedKey: 'a camelized key'
    }
  }).then((res) => {
    expect(JSON.parse(res.body)).toHaveProperty('camelized_key')
  })
})

test('http does not decamelizes json body if decamelizedBody passed in as false', () => {
  return http(successUrl, {
    method: 'POST',
    decamelizeBody: false,
    body: {
      camelizedKey: 'a camelized key'
    }
  }).then((res) => {
    expect(JSON.parse(res.body)).toHaveProperty('camelizedKey')
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
