import {IntegerParser} from '../integer'
import {ArrayParser} from '../array'
import {DateTimeParser} from '../datetime'
import {DateParser} from '../date'
import {StringParser} from '../string'

describe('test ArrayParser', () => {

  test('parse int', () => {
    expect(() => new ArrayParser(new StringParser()).required().parse(123)).toThrowError(/не является массивом/)
  })

  test('parse undefined', () => {
    expect(new ArrayParser(new StringParser()).parse(undefined)).toEqual([])
  })

  test('parse number array', () => {
    expect(new ArrayParser(new IntegerParser()).parse(['123', '456'])).toEqual([123, 456])
  })

  test('parse strings', () => {
    expect(new ArrayParser(new StringParser()).parse(['123', undefined, NaN])).toEqual(['123', ''])
  })

  test('parse numbers', () => {
    expect(new ArrayParser(new IntegerParser()).parse(['123', undefined, 'asdads'])).toEqual([123])
  })

  test('parse date times', () => {
    expect(new ArrayParser(new DateTimeParser()).parse(['123', undefined, 123, "2012-12-31T21:00:00.000Z"])).toEqual(['01/01/2013 12:00 AM'])
  })

  test('parse dates', () => {
    expect(new ArrayParser(new DateParser()).parse(['123', '01.02.2049', "2013-01-01"])).toEqual(["2049-01-02", "2013-01-01"])
  })

  test('save array string', () => {
    expect(new ArrayParser(new StringParser()).to_storage(['1'])).toEqual('["1"]')
  })

  test('load string', () => {
    expect(new ArrayParser(new StringParser()).from_storage('["1", 1]')).toEqual(['1'])
  })
})
