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

test('configureApi can accept a custom base api', () => {
  const myFirstApi = configureApi({ firstVal: 'foo' })
  const mySecondApi = configureApi({ secondVal: 'bar' }, myFirstApi)
  return mySecondApi.get(successUrl, { thirdVal: 'baz' }).then((res) => {
    expect(res.firstVal).toEqual('foo')
    expect(res.secondVal).toEqual('bar')
    expect(res.thirdVal).toEqual('baz')
  })
})
