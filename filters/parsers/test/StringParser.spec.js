import {StringParser} from '../string'

describe('test StringParser', () => {

  test('parse int', () => {
    expect(new StringParser().parse('123')).toBe('123')
  })

  test('parse string', () => {
    expect(() => new StringParser().parse(123)).toThrowError(/не является строкой/)
  })

  test('parse undefined', () => {
    expect(new StringParser().parse(undefined)).toBe('')
  })

  test('load string', () => {
    expect(new StringParser().from_storage('"asdads"')).toBe('asdads')
  })

  test('load undefined', () => {
    expect(new StringParser().from_storage(undefined)).toBe('')
  })

  test('to storage', () => {
    expect(new StringParser().to_storage('123')).toBe('"123"')
  })

  test('from storage', () => {
    let result = new StringParser().to_storage('123')
    expect(new StringParser().from_storage(result)).toBe('123')
  })
})
