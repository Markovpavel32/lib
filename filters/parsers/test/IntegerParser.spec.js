import {IntegerParser} from '../integer'

describe('test IntegerParser', () => {

  test('parse int', () => {
    expect(new IntegerParser().parse('123')).toBe(123)
  })

  test('parse string', () => {
    expect(() => new IntegerParser().parse('asdads')).toThrowError(/не является числом/)
  })

  test('parse number string', () => {
    expect(new IntegerParser().parse(123)).toBe(123)
  })

  test('parse float', () => {
    expect(new IntegerParser().parse(123.123)).toBe(123)
  })

  test('parse undefined', () => {
    expect(new IntegerParser().parse(undefined)).toBe(undefined)
  })

  test('load string', () => {
    expect(new IntegerParser().from_storage('"asdads"')).toBe(undefined)
  })

  test('load undefined', () => {
    expect(new IntegerParser().from_storage(undefined)).toBe(undefined)
  })

  test('to storage', () => {
    expect(new IntegerParser().to_storage(123)).toBe('123')
  })
})
