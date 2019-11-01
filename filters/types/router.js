import {FilterTypeError} from '../exceptions'
import {ListFilterType} from './base'
import {AppliedFilter} from '../filter'

class FilterRouter extends ListFilterType {
  constructor (name, title) {
    super()
    this.is_required = false
    this.name = `${name}:router`
    this.title = title
    this.types = []
    this.is_router = true
    this.filter_type = `${name}:filter_type`
    this.current_filter = undefined
  }

  get component_name () {
    return this.current_filter.config.component_name
  }

  apply_filter (filter, cond, save = true) {
    return {}
  }

  get_initial (filter, saved) {
    if (!this.current_filter) this.load(filter)
    return this.current_filter.config.get_initial(filter, saved)
  }

  get applied_type () {
    return this.current_filter.name
  }

  get_default_filter (filter) {
    /* eslint-disable no-undef-init  */
    let selected = undefined
    if (!this._in_memory) selected = window.localStorage.getItem(`${filter.storage_key}:filter_type`)
    let new_filter = this.types.find((x) => x.name === selected)
    if (new_filter === undefined) {
      if (this.types.length) selected = this.types[0].name
      else throw new FilterTypeError(`filter with type ${new_filter} not founded`)
    }
    return new_filter
  }

  load (filter) {
    /* eslint-disable no-undef-init  */
    let selected = undefined
    if (!this._in_memory) selected = window.localStorage.getItem(`${filter.storage_key}:filter_type`)
    let new_filter = this.types.find((x) => x.name === selected)
    if (new_filter === undefined) {
      if (this.types.length) selected = this.types[0].name
      else throw new FilterTypeError(`filter with type ${new_filter} not founded`)
    }
    this._change_type(filter, selected)
    return {}
  }

  change_type (applied_filter, type) {
    if (this.current_filter && this.current_filter.filter_type === type) return
    this._change_type(applied_filter, type)
    if (this._apply_on_change) {
      applied_filter.on_change()
    } else {
      applied_filter.is_changed = true
      applied_filter.filter_data.update_is_changed()
    }
  }

  _change_type (applied_filter, type) {
    applied_filter.filter_data.freeze()
    let new_filter = this.types.find((x) => x.name === type)
    if (new_filter) {
      if (!this._in_memory) window.sessionStorage.setItem(`${applied_filter.storage_key}:filter_type`, type)
      let new_applied = new AppliedFilter(applied_filter.filter_data, new_filter)
      if (this.current_filter) {
        new_applied.values = new_filter.get_initial(new_applied, new_filter.clean(new_applied, this.current_filter.values))
        this.current_filter.destroy(false)
      } else new_applied.values = new_filter.get_initial(new_applied)
      new_applied.defaults = {...new_applied.values}
      applied_filter.filter_data.add_filter(new_applied)
      this.current_filter = new_applied
    }
    this._apply_on_change = this.current_filter.config._apply_on_change
    applied_filter.filter_data.unfreeze()
    return this.current_filter.values
  }

  destroy (applied_filter) {
    super.destroy(applied_filter)
    this.current_filter.destroy(applied_filter)
    this.current_filter = undefined
  }

  enable (applied_filter) {
    super.enable(applied_filter)
    this.current_filter.enable(applied_filter)
  }

  clear (applied_filter) {
    super.clear()
    window.localStorage.removeItem(`${applied_filter.storage_key}:filter_type`)
  }

  use_types (types) {
    types.forEach((x) => x.set_required(false))
    this.types.push(...types)
    return this
  }
}

export {FilterRouter}
