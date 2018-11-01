import { composeMiddleware } from '../../src'

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
})