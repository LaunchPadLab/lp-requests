import { configureHttp } from '../src'
import { successUrl } from 'isomorphic-fetch'

// These tests rely on the mock Fetch() 
// returning options as the response

test('configureHttp adds defaults to request options', () => {
  const myHttp = configureHttp({ credentials: 'foo' })
  return myHttp(successUrl, { mode: 'bar' }).then((res) => {
    expect(res.credentials).toEqual('foo')
    expect(res.mode).toEqual('bar')
  })
})

test('configureHttp works with request object', () => {
  const myHttp = configureHttp({ credentials: 'foo' })
  return myHttp({ url: successUrl, mode: 'bar' }).then((res) => {
    expect(res.credentials).toEqual('foo')
    expect(res.mode).toEqual('bar')
  })
})

test('configureHttp can accept a custom base http', () => {
  const myFirstHttp = configureHttp({ credentials: 'foo' })
  const mySecondHttp = configureHttp({ mode: 'bar' }, myFirstHttp)
  return mySecondHttp(successUrl, { cache: 'baz' }).then((res) => {
    expect(res.credentials).toEqual('foo')
    expect(res.mode).toEqual('bar')
    expect(res.cache).toEqual('baz')
  })
})
