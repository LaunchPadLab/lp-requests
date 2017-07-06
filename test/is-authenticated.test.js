import { isAuthenticated } from '../src'
import Cookies from 'js-cookie'

const CONTEXT = 'foo'

test('isAuthenticated returns false when lp_auth cookie is not set', () => {
  Cookies.remove('lp_auth')
  expect(isAuthenticated()).toEqual(false)
})

test('isAuthenticated returns true when lp_auth cookie is set to a string', () => {
  Cookies.set('lp_auth', 'woohoo')
  expect(isAuthenticated()).toEqual(true)
})

test('isAuthenticated returns false when lp_auth cookie does not contain a token', () => {
  Cookies.set('lp_auth', {})
  expect(isAuthenticated()).toEqual(false)
})

test('isAuthenticated returns false when lp_auth cookie contains an invalid token', () => {
  Cookies.set('lp_auth', { token: false })
  expect(isAuthenticated()).toEqual(false)
})

test('isAuthenticated returns true when lp_auth cookie contains a valid token', () => {
  Cookies.set('lp_auth', { token: true })
  expect(isAuthenticated()).toEqual(true)
})

test('isAuthenticated returns false when lp_auth cookie contains an invalid context', () => {
  Cookies.set('lp_auth', { token: true, context: 'other' })
  expect(isAuthenticated({ context: CONTEXT })).toEqual(false)
})

test('isAuthenticated returns true when lp_auth cookie contains a valid token and context', () => {
  Cookies.set('lp_auth', { token: true, context: CONTEXT })
  expect(isAuthenticated({ context: CONTEXT })).toEqual(true)
})

test('isAuthenticated returns false when the context is null', () => {
  Cookies.set('lp_auth', { token: true, context: CONTEXT })
  expect(isAuthenticated({ context: null })).toEqual(false)
})

test('isAuthenticated returns true when the lp_auth cookie is valid and the options param does not contain a context', () => {
  Cookies.set('lp_auth', { token: true })
  expect(isAuthenticated({ foo: 'bar' })).toEqual(true)
})