import { composeMiddleware } from '../../src'
import { decamelizeKeys } from 'humps'

describe('composeMiddleware', () => {
  it('applies middleware in correct order', () => {
    expect.assertions(1)
    const addName = () => ({ name: 'David' })
    const lowerCase = ({ name }) => ({ name: name.toLowerCase() })
    return composeMiddleware(addName, lowerCase)({}).then(result => {
      expect(result.name).toEqual('david')
    })
  })
  it('can handle async middleware', () => {
    expect.assertions(1)
    const addName = () => Promise.resolve({ name: 'David' })
    const lowerCase = ({ name }) => ({ name: name.toLowerCase() })
    return composeMiddleware(addName, lowerCase)({}).then(result => {
      expect(result.name).toEqual('david')
    })
  })
  it('overrides prior values rather than merging', () => {
    expect.assertions(1)
    const body = { myAttribute: 'foo' }
    const decamelizeBody = ({ body }) => ({ body: decamelizeKeys(body) })
    return composeMiddleware(decamelizeBody)({ body }).then(result => {
      expect(result.body).toEqual({ my_attribute: 'foo' })
    })
  })
})