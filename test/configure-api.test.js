import { configureApi } from '../src'
import { successUrl } from 'isomorphic-fetch'

// These tests rely on the mock Fetch() 
// returning options as the response

test('configureApi adds defaults to request options', () => {
  const myApi = configureApi({ foo: 'bar' })
  return myApi.get(successUrl).then((res) => {
    expect(res.foo).toEqual('bar')
  })
})
