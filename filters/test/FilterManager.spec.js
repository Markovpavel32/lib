import {FilterManager} from '../manager'
import {FilterRouterFabric} from '../filter_router_fabric'
import {FilterRouter} from '../types/router'
import {ValueFilterType} from '../types/value'

describe('test FilterData', () => {
  let string_filter = new FilterRouterFabric('kek', 'cheburek').for_string().required().get()
  let string_optional_filter = new FilterRouterFabric('kek', 'cheburek').for_string().get()
  let boolean_filter = new FilterRouter('bool', 'bool').use_types([
    new ValueFilterType('kek2', 'равно').boolean().use_component('filter-boolean-radio').by_default(true).apply_on_change(),
  ])
  let lazy_boolean_filter = new FilterRouter('bool', 'bool').use_types([
    new ValueFilterType('kek2', 'равно').boolean().use_component('filter-boolean-radio').by_default(true),
  ])

  test('required filter', () => {
    let filter_data = new FilterManager().add_filters([string_filter]).initialize()
    expect(filter_data.enabled_filters.length).toBe(2)
    expect(filter_data.filters.length).toBe(1)
  })

  test('optional filter', () => {
    let filter_data = new FilterManager().add_filters([string_optional_filter]).initialize()
    expect(filter_data.enabled_filters.length).toBe(0)
    expect(filter_data.filters.length).toBe(1)
  })

  test('enable optional filter', () => {
    let filter_data = new FilterManager().add_filters([string_optional_filter]).initialize()
    filter_data.enable_filter('kek:router')
    expect(filter_data.enabled_filters.length).toBe(2)
  })

  test('enable optional twice', () => {
    let filter_data = new FilterManager().add_filters([string_optional_filter]).initialize().clear()
    filter_data.enable_filter('kek:router')
    filter_data.enable_filter('kek:router')
    expect(filter_data.enabled_filters.length).toBe(2)
  })

  test('disable wrong filter', () => {
    let filter_data = new FilterManager().add_filters([string_optional_filter]).initialize().clear()
    filter_data.disable_filter('kek16')
    expect(filter_data.enabled_filters.length).toBe(0)
  })

  test('disable filter', () => {
    let filter_data = new FilterManager().add_filters([string_optional_filter]).initialize().clear()
    filter_data.enable_filter('kek:router')
    filter_data.disable_filter('kek:router')
    expect(filter_data.enabled_filters.length).toBe(0)
  })

  test('optional filter inited', () => {
    let filter_data = new FilterManager().add_filters([boolean_filter]).initialize().clear()
    filter_data.enable_filter('bool:router')
    expect(filter_data.enabled_filters.length).toBe(2)
    expect(filter_data.is_changed).toBe(false)
    expect(filter_data.applied).toMatchObject({kek2: "True"})
    filter_data.enabled_filters[0].destroy()
    expect(filter_data.applied).toMatchObject({})
    expect(filter_data.is_changed).toBe(false)
  })

  test('lazy optional filter inited', () => {
    let filter_data = new FilterManager().add_filters([lazy_boolean_filter]).initialize().clear()
    filter_data.enable_filter('bool:router')
    expect(filter_data.enabled_filters.length).toBe(2)
    expect(filter_data.applied).toMatchObject({})
    expect(filter_data.is_changed).toBe(false)
  })
})
