import {IsNullFilterType} from '../isnull'

describe('test RangeNumberFilterType', () => {
  let filter = {
    name: 'name',
    storage_key: 'kekek'
  }

  test('get initial', () => {
    let cond = new IsNullFilterType('name__isnull').get_initial_cond(filter)
    expect(cond).toBeTruthy()
  })

  test('apply null filter', () => {
    let result = new IsNullFilterType('name__isnull').apply_filter(filter, {on: true})
    expect(result).toMatchObject({ name__isnull: true })
  })
})
