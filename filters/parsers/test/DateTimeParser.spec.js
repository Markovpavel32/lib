import moment from 'moment'
import {DateTimeParser} from '../datetime'

describe('test DateParser', () => {

  test('parse int', () => {
    expect(new DateTimeParser().parse('123')).toBe(undefined)
  })

  test('parse date', () => {
    let original = new Date(2012, 12, 1)
    let result = new DateTimeParser().parse(original)
    expect(moment(original).isSame(result)).toBeTruthy()
  })

  test('parse datetime string', () => {
    expect(new DateTimeParser().parse("2012-12-31T21:00:00.000Z")).toMatchObject(new Date('2012-12-31T21:00:00.000Z'))
  })

  test('load undefined', () => {
    expect(new DateTimeParser().from_storage(undefined)).toBe(undefined)
  })

  test('load empty string', () => {
    expect(new DateTimeParser().from_storage('')).toBe(undefined)
  })

  test('load string', () => {
    expect(new DateTimeParser().from_storage('1asdasd')).toBe(undefined)
  })

  test('to storage', () => {
    expect(new DateTimeParser().to_storage(new Date(2012, 12, 1))).toBe("\"2012-12-31T21:00:00.000Z\"")
  })

  test('from storage', () => {
    let original = new Date(2012, 12, 1)
    let result = new DateTimeParser().from_storage("\"2012-12-31T21:00:00.000Z\"")
    expect(result).toBeInstanceOf(Date)
    expect(moment(original).isSame(result)).toBeTruthy()
  })
})
