import {BooleanParser} from '../boolean'

describe('test BooleanParser', () => {

  test('parse int', () => {
    expect(new BooleanParser().parse(123)).toBe(true)
  })

  test('parse string', () => {
    expect(new BooleanParser().parse('123')).toBe(undefined)
  })

  test('parse boolean', () => {
    expect(new BooleanParser().parse(true)).toBe(true)
  })

  test('parse undefined', () => {
    expect(new BooleanParser().parse(undefined)).toBe(undefined)
  })

  test('load string', () => {
    expect(new BooleanParser().from_storage('"asdads"')).toBe(undefined)
  })

  test('load', () => {
    expect(new BooleanParser().from_storage('true')).toBe(true)
  })

  test('to storage', () => {
    expect(new BooleanParser().to_storage(true)).toBe('true')
  })
})
