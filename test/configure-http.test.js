import { configureHttp } from '../src'
import { successUrl } from 'isomorphic-fetch'

// These tests rely on the mock Fetch() 
// returning options as the response

test('configureHttp adds defaults to request options', () => {
  const myHttp = configureHttp({ defaultVal: 'foo' })
  return myHttp(successUrl, { customVal: 'bar' }).then((res) => {
    expect(res.defaultVal).toEqual('foo')
    expect(res.customVal).toEqual('bar')
  })
})