import {RangeNumberFilterType} from '../range'

describe('test RangeNumberFilterType', () => {
  let filter = {
    name: 'name',
    storage_key: 'kekek'
  }

  test('get initial', () => {
    let cond = new RangeNumberFilterType('name').get_initial_cond(filter)
    expect(cond).toBeTruthy()
  })

  test('empty', () => {
    let result = new RangeNumberFilterType('name').number().apply_filter(filter, {})
    expect(result).toMatchObject({})
  })

  test('only value from', () => {
    let cond = {gt_lt_e: true, val_from: 1, on: true}
    let result = new RangeNumberFilterType('name').number().apply_filter(filter, cond)
    expect(result).toMatchObject({name__gte: 1})
  })

  test('only value till', () => {
    let cond = {val_to: 10, on: true}
    let result = new RangeNumberFilterType('name').number().apply_filter(filter, cond)
    expect(result).toMatchObject({name__lt: 10 })
  })

  test('from and till values', () => {
    let cond = {val_from: 1, val_to: 10, on: true}
    let result = new RangeNumberFilterType('name').number().apply_filter(filter, cond)
    expect(result).toMatchObject({ name__gt: 1, name__lt: 10 })
  })

  test('from and till with no equal', () => {
    let cond = {val_from: 1, val_to: 10, on: true, gt_lt_e: false}
    let result = new RangeNumberFilterType('name').number().apply_filter(filter, cond)
    expect(result).toMatchObject({ name__gt: 1, name__lt: 10 })
  })

  test('zero not dropped', () => {
    let cond = {val_from: 0, val_to: 10, on: true}
    let result = new RangeNumberFilterType('name').number().apply_filter(filter, cond)
    expect(result).toMatchObject({ name__gt: 0, name__lt: 10 })
  })
  test('inversed values', () => {
    let cond = {val_from: 100, val_to: 10, on: true}
    let result = new RangeNumberFilterType('name').number().apply_filter(filter, cond)
    expect(result).toMatchObject({ name__lt: 10, name__gt: 100 })
  })
})
