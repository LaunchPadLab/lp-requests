import { HttpError } from '../src'

test('HttpError has correct name, status, statusText and response', () => {
  const status = 500
  const statusText = 'Foo'
  const response = { bad: true }
  const errors = { 'some-value': 'there was an error' }
  const err = new HttpError(status, statusText, response, errors)
  expect(err.name).toEqual('HttpError')
  expect(err.status).toEqual(status)
  expect(err.statusText).toEqual(statusText)
  expect(err.response).toEqual(response)
  expect(err.errors).toEqual(errors)
})

test('HttpError builds message string correctly', () => {
  const status = 500
  const statusText = 'Foo'
  const message = `${status} - ${statusText}`
  const err = new HttpError(status, statusText)
  expect(err.message).toEqual(message)
})
