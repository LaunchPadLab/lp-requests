import { configureHttp } from '../src'
import { successUrl } from 'isomorphic-fetch'

// These tests rely on the mock Fetch() 
// returning options as the response

test('configureHttp adds defaults to request options', () => {
  const myHttp = configureHttp({ foo: 'bar' })
  return myHttp(successUrl).then((res) => {
    expect(res.foo).toEqual('bar')
  })
})