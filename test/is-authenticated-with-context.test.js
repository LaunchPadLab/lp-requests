import { isAuthenticatedWithContext } from '../src'
import Cookies from 'js-cookie'

const CONTEXT = 'foo'

test('isAuthenticatedWithContext returns false when lp_auth cookie is not set', () => {
  Cookies.remove('lp_auth')
  expect(isAuthenticatedWithContext(CONTEXT)).toEqual(false)
})

test('isAuthenticatedWithContext returns false when lp_auth cookie is set to a string', () => {
  Cookies.set('lp_auth', 'woohoo')
  expect(isAuthenticatedWithContext(CONTEXT)).toEqual(false)
})

test('isAuthenticatedWithContext returns false when lp_auth cookie contains an invalid token', () => {
  Cookies.set('lp_auth', { token: false, context: CONTEXT })
  expect(isAuthenticatedWithContext(CONTEXT)).toEqual(false)
})

test('isAuthenticatedWithContext returns false when lp_auth cookie contains an invalid context', () => {
  Cookies.set('lp_auth', { token: true, context: 'other' })
  expect(isAuthenticatedWithContext(CONTEXT)).toEqual(false)
})

test('isAuthenticatedWithContext returns true when lp_auth cookie contains a valid token and context', () => {
  Cookies.set('lp_auth', { token: true, context: CONTEXT })
  expect(isAuthenticatedWithContext(CONTEXT)).toEqual(true)
})