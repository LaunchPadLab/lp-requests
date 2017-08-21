import { configureApi } from '../src'
import { successUrl } from 'isomorphic-fetch'

// These tests rely on the mock Fetch() 
// returning options as the response

test('configureApi adds defaults to request options', () => {
  const myApi = configureApi({ defaultVal: 'foo' })
  return myApi.get(successUrl, { customVal: 'bar' }).then((res) => {
    expect(res.defaultVal).toEqual('foo')
    expect(res.customVal).toEqual('bar')
  })
})
