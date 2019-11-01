import {AppliedFilter} from './filter'
import {MultipleChoiceFilterType} from './types/multiple_choice'
import lodash_equal from 'lodash/isEqual'

class FilterManager {
  constructor (name) {
    this.name = name
    this.applied = {}
    this.filters = []
    this.filter_selector = undefined
    this.enabled_filters = []
    this.is_changed = false
    this.is_freezed = false
    this.is_freeze_apply = false
    this.is_freeze_update = false
    this.on_change_callbacks = []
  }

  freeze () {
    this.is_freezed = true
    return this
  }

  unfreeze () {
    this.is_freezed = false
    if (this.is_freeze_apply) this.apply_filters()
    else if (this.is_freeze_update) this.update_filters()
    this.is_freeze_apply = false
    this.is_freeze_update = false
  }
  on_change (callback) {
    this.on_change_callbacks.push(callback)
    return this
  }

  add_filters (filters) {
    this.filters.push(...filters)
    return this
  }

  initialize () {
    let choices = this.filters.map((x) => [x.name, x.name])
    let selector = new MultipleChoiceFilterType(this.name + '_selected_filters', '').for_choices(choices)
    this.filter_selector = new AppliedFilter(this, selector)
    this.filters.forEach((filter) => {
      if (filter.is_required || (filter.is_router && this.filter_selector.values.selected.find((x) => x === filter.name))) {
        this._add_filter(new AppliedFilter(this, filter))
      }
    })
    return this
  }

  update_is_changed () {
    this.is_changed = this.enabled_filters.findIndex((x) => x.is_changed) >= 0
  }

  apply_filters () {
    if (this.is_freezed) {
      this.is_freeze_apply = true
      return
    }
    let result = {}
    this.enabled_filters.forEach((filter) => {
      Object.assign(result, filter.apply_filter())
    })
    let old_applied = this.applied
    this.applied = result
    this.is_changed = false
    if (!lodash_equal(this.applied, old_applied)) this.on_change_callbacks.forEach((x) => x.on_change(this.applied, old_applied))
    return result
  }

  update_filters () {
    if (this.is_freezed) {
      this.is_freeze_update = true
      return
    }
    let result = {}
    this.enabled_filters.forEach((filter) => {
      Object.assign(result, filter.applied)
    })
    let old_applied = this.applied
    this.applied = result
    if (!lodash_equal(this.applied, old_applied)) this.on_change_callbacks.forEach((x) => x.on_change(this.applied, old_applied))
    return result
  }

  enable_filter (filter_name) {
    let filter = this.filters.find((x) => filter_name === x.name)
    if (filter) {
      let applied = new AppliedFilter(this, filter)
      if (this.filter_selector.values.selected.findIndex((x) => x === filter.name) < 0) this.filter_selector.values.selected.push(filter.name)
      this.filter_selector.apply_filter()
      this.add_filter(applied)
      return applied
    }
  }

  _add_filter (filter) {
    this.enabled_filters.push(filter)
    filter.enable()
  }

  disable_filter (filter_name) {
    let applied = this.enabled_filters.find((x) => filter_name === x.config.name)
    if (applied && !applied.config.is_required) {
      applied.destroy()
    }
  }

  get_filter (name) {
    return this.enabled_filters.find((x) => name === x.config.name)
  }

  add_filter (filter) {
    let existed_index = this.enabled_filters.findIndex((x) => x.config.name === filter.config.name)
    if (existed_index < 0 && filter) this._add_filter(filter)
  }

  remove_filter (filter) {
    this.disable_filter(filter.name)
  }

  clear () {
    [...this.enabled_filters].forEach((filter) => {
      if (filter.config.is_router && !filter.config.is_required) filter.destroy(); else filter.clear()
    })
    this.apply_filters()
    return this
  }
}

export {FilterManager}
