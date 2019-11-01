import {AppliedFilter} from '../filter'
import {FilterRouterFabric} from '../filter_router_fabric'
import {FilterManager} from '../manager'

describe('test AppliedFilter', () => {
  let string_filter = new FilterRouterFabric('kek', 'cheburek').for_string().required().get()
  let filter_data = new FilterManager().add_filters([string_filter]).initialize()

  test('exact by default', () => {
    let filter = new AppliedFilter(filter_data, string_filter)
    expect(string_filter.filter_type).toBe('kek:filter_type')
    expect(string_filter.current_filter.config.name).toBe('kek__exact')
  })

  test('change filter', () => {
    let filter = new AppliedFilter(filter_data, string_filter)
    string_filter.change_type(filter, 'kek__startswith')
    expect(string_filter.filter_type).toBe('kek:filter_type')
    expect(string_filter.current_filter.config.name).toBe('kek__startswith')
  })
})
