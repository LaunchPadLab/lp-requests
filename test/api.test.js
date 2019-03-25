import { api } from '../src'
import { successUrl } from 'isomorphic-fetch'

// These tests rely on the mock Fetch() 
// returning options as the response

test('api.get() adds GET method to request options', () => {
  return api.get(successUrl).then((res) => {
    expect(res.method).toEqual('GET')
  })
})

test('api.patch() adds PATCH method to request options', () => {
  return api.patch(successUrl).then((res) => {
    expect(res.method).toEqual('PATCH')
  })
})

test('api.post() adds POST method to request options', () => {
  return api.post(successUrl).then((res) => {
    expect(res.method).toEqual('POST')
  })
})

test('api.put() adds PUT method to request options', () => {
  return api.put(successUrl).then((res) => {
    expect(res.method).toEqual('PUT')
  })
})

test('api.destroy() adds DELETE method to request options', () => {
  return api.destroy(successUrl).then((res) => {
    expect(res.method).toEqual('DELETE')
  })
})

test('api.call() adds passed method to request options', () => {
  return api.call(successUrl, 'OPTIONS').then((res) => {
    expect(res.method).toEqual('OPTIONS')
  })
})

test('api methods pass provided body and options to request', () => {
  const body = { foo: true }
  const options = { mode: 'foo' }
  return api.post(successUrl, body, options).then((res) => {
    expect(res.method).toEqual('POST')
    expect(res.body).toEqual(JSON.stringify(body))
    expect(res.mode).toEqual('foo')
  })
})