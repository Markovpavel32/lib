import {InFilterType} from '../in'

describe('test InFilterType', () => {
  let filter = {
    name: 'name',
    storage_key: 'kekek'
  }

  test('apply undefined', () => {
    let result = new InFilterType('prefix').apply_filter(filter, {})
    expect(result).toMatchObject({})
  })

  test('apply string value', () => {
    let cond = {val_in: '', on: true}
    expect(new InFilterType('prefix').required().apply_filter(filter, cond)).toMatchObject({})
  })

  test('array applied', () => {
    let cond = {val_in: ['value1', 'value2', 'value3'], on: true}
    let result = new InFilterType('name__prefix').apply_filter(filter, cond)
    expect(result).toMatchObject({ name__prefix: ['value1', 'value2', 'value3'] })
  })

  test('string values', () => {
    let cond = {val_in: ['10', '20', '30', 'aaa'], on: true}
    let result = new InFilterType('name__prefix').number().apply_filter(filter, cond)
    expect(result).toMatchObject({ name__prefix: [10, 20, 30] })
  })

  test('number value', () => {
    let cond = {val_in: 20, on: true}
    expect(new InFilterType('prefix').number().required().apply_filter(filter, cond)).toMatchObject({})
  })

  test('empty array', () => {
    let cond = {val_in: [], on: true}
    let result = new InFilterType('prefix').number().apply_filter(filter, cond)
    expect(result).toMatchObject({})
  })

  test('filter wrong types', () => {
    let cond = {val_in: ['dsfdfd'], on: true}
    let result = new InFilterType('prefix').number().apply_filter(filter, cond)
    expect(result).toMatchObject({})
  })

  test('get initial', () => {
    let cond = new InFilterType('name').get_initial_cond(filter)
    expect(cond).toMatchObject({val_in: []})
  })

  test('load numbers', () => {
    let cond = {val_in: ['1', '2', '3'], on: true}
    let filter = new InFilterType('prefix').number()
    filter.apply_filter(filter, cond)
    expect(filter.load(filter)).toMatchObject({val_in: [1, 2, 3]})
  })
})
