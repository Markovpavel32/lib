import {ValueFilterType} from '../value'

describe('test StringFilterType', () => {
  let filter = {
    name: 'name',
    storage_key: 'kekek'
  }

  test('get_initial_cond', () => {
    let cond = new ValueFilterType('name').get_initial_cond(filter)
    expect(cond).toMatchObject({val_from: undefined, case: false})
  })

  test('apply empty', () => {
    let cond = {case: true, on: true, val_from: ''}
    let result = new ValueFilterType('name__prefix').string().use_case().apply_filter(filter, cond)
    expect(result).toMatchObject({})
  })

  test('apply with insensitive case', () => {
    let cond = {case: false, val_from: 'test', on: true}
    let result = new ValueFilterType('name__prefix').string().use_case().apply_filter(filter, cond)
    expect(result).toMatchObject({ name__iprefix: 'test' })
  })

  test('apply sensitive case', () => {
    let cond = {case: false, val_from: 'test', on: true}
    let result = new ValueFilterType('name__prefix').apply_filter(filter, cond)
    expect(result).toMatchObject({ name__prefix: 'test' })
  })

  test('apply number', () => {
    let cond = {case: false, val_from: 100, on: true}
    let result = new ValueFilterType('name__prefix').number().apply_filter(filter, cond)
    expect(result).toMatchObject({ name__prefix: 100 })
  })
  test('apply string to number', () => {
    let cond = {case: false, val_from: 'aaa', on: true}
    expect(() => {
      new ValueFilterType('name__prefix').number().apply_filter(filter, cond)
    }).toThrowError(/не является числом/)
  })
})

