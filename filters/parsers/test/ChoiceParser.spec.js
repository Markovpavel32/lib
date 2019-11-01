import {ChoiceParser} from '../choice'

describe('test ChoiceParser', () => {

  test('parse int', () => {
    expect(new ChoiceParser([['123', '456']]).parse('123')).toBe('123')
  })

  test('parse invalid choice', () => {
    expect(() => new ChoiceParser().required().parse('kek')).toThrowError(/не является возможным вариантом/)
  })

  test('parse undefined', () => {
    expect(new ChoiceParser().parse(undefined)).toBe(undefined)
  })

  test('parse default', () => {
    expect(new ChoiceParser([['456', '456']]).by_default('456').parse('123')).toBe('456')
  })


  test('load invalid string', () => {
    expect(new ChoiceParser().required().from_storage('"asdads"')).toBe(undefined)
  })

  test('load string', () => {
    expect(new ChoiceParser([['123', '456']]).required().from_storage('"123"')).toBe('123')
  })

  test('to storage', () => {
    expect(new ChoiceParser().to_storage('123')).toBe('"123"')
  })

  test('from storage', () => {
    let parser = new ChoiceParser([['123', '456']])
    let result = parser.to_storage('123')
    expect(parser.from_storage(result)).toBe('123')
  })
})
