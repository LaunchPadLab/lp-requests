import { configureApi } from '../src'
import { successUrl } from 'isomorphic-fetch'

// These tests rely on the mock Fetch() 
// returning options as the response

test('configureApi adds defaults to request options', () => {
  const myApi = configureApi({ credentials: 'foo' })
  return myApi.get(successUrl, { mode: 'bar' }).then((res) => {
    expect(res.credentials).toEqual('foo')
    expect(res.mode).toEqual('bar')
  })
})

test('configureApi can accept a custom base api', () => {
  const myFirstApi = configureApi({ credentials: 'foo' })
  const mySecondApi = configureApi({ mode: 'bar' }, myFirstApi)
  return mySecondApi.get(successUrl, { cache: 'baz' }).then((res) => {
    expect(res.credentials).toEqual('foo')
    expect(res.mode).toEqual('bar')
    expect(res.cache).toEqual('baz')
  })
})
