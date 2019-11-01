import moment from 'moment'
import {DateParser} from '../date'

describe('test DateParser', () => {

  test('parse int', () => {
    expect(new DateParser().parse('123')).toBe(undefined)
  })

  test('parse date', () => {
    let original = new Date(2012, 12, 1)
    let result = new DateParser().parse(original)
    expect(moment(original).isSame(result)).toBeTruthy()
  })

  test('parse date string', () => {
    let original = new Date(2012, 12, 1)
    let result = new DateParser().parse('2012-12-31T21:00:00.000Z')
    expect(moment(original).isSame(result)).toBeTruthy()
  })

  test('load undefined', () => {
    expect(new DateParser().from_storage(undefined)).toBe(undefined)
  })

  test('load empty string', () => {
    expect(new DateParser().from_storage('')).toBe(undefined)
  })

  test('load string', () => {
    expect(new DateParser().from_storage('1asdasd')).toBe(undefined)
  })

  test('to storage', () => {
    expect(new DateParser().to_storage(new Date(2012, 12, 1))).toBe("\"2012-12-31T21:00:00.000Z\"")
  })

  test('from storage', () => {
    let original = new Date(2012, 12, 1)
    let result = new DateParser().from_storage("\"2012-12-31T21:00:00.000Z\"")
    expect(result).toBeInstanceOf(Date)
    expect(moment(original).isSame(result)).toBeTruthy()
  })
})
