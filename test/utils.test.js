import { 
  camelizeKeys,
  decamelizeKeys,
  omitUndefined,
  parseObject
} from '../src/utils'

const DECAMELIZED = {
  'key_one': 'foo',
  'key_two': 'foo2'
}
const CAMELIZED = {
  'keyOne': 'foo',
  'keyTwo': 'foo2'
}
const UNDERSCORED = {
  '_key_one': 'foo',
  '_key_two': 'foo2'
}

test('camelizeKeys correctly camelizes keys', () => {
  expect(camelizeKeys(DECAMELIZED)).toEqual(CAMELIZED)
  expect(camelizeKeys(UNDERSCORED)).toEqual(UNDERSCORED)
})

test('decamelizeKeys correctly decamelizes keys', () => {
  expect(decamelizeKeys(CAMELIZED)).toEqual(DECAMELIZED)
})

test('omitUndefined omits keys with undefined values', () => {
  const withUndef = { test: true, omit: undefined }
  const withoutUndef = { test: true }
  expect(omitUndefined(withUndef)).toEqual(withoutUndef)
})

test('parseObject returns a parsed object from a string', () => {
  const obj = { test: true }
  const objString = JSON.stringify(obj)
  expect(parseObject(objString)).toEqual(obj)
})

test('parseObject returns undefined if string cannot be parsed', () => {
  const objString = 'not valid'
  expect(parseObject(objString)).toEqual(undefined)
})