import { getAuthenticationContext } from '../src'
import Cookies from 'js-cookie'

const CONTEXT = 'foo'

test('getAuthenticationContext returns undefined when lp_auth cookie is not set', () => {
  Cookies.remove('lp_auth')
  expect(getAuthenticationContext()).toEqual(undefined)
})

test('getAuthenticationContext returns undefined when lp_auth cookie is set to a string', () => {
  Cookies.set('lp_auth', 'woohoo')
  expect(getAuthenticationContext()).toEqual(undefined)
})

test('getAuthenticationContext returns undefined when lp_auth cookie does not contain a token', () => {
  Cookies.set('lp_auth', {})
  expect(getAuthenticationContext()).toEqual(undefined)
})

test('getAuthenticationContext returns undefined when lp_auth cookie contains an invalid token', () => {
  Cookies.set('lp_auth', { token: false, context: CONTEXT })
  expect(getAuthenticationContext()).toEqual(undefined)
})

test('getAuthenticationContext returns the context string when lp_auth cookie contains a valid context', () => {
  Cookies.set('lp_auth', { token: true, context: CONTEXT })
  expect(getAuthenticationContext()).toEqual(CONTEXT)
})