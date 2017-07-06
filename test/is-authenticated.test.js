import { isAuthenticated } from '../src'
import Cookies from 'js-cookie'

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