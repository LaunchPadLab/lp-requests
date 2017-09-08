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

test('configureHttp can accept a custom base http', () => {
  const myFirstHttp = configureHttp({ firstVal: 'foo' })
  const mySecondHttp = configureHttp({ secondVal: 'bar' }, myFirstHttp)
  return mySecondHttp(successUrl, { thirdVal: 'baz' }).then((res) => {
    expect(res.firstVal).toEqual('foo')
    expect(res.secondVal).toEqual('bar')
    expect(res.thirdVal).toEqual('baz')
  })
})