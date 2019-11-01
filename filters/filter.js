import lodash_isEqual from 'lodash/isEqual'

class AppliedFilter {
  constructor (filter_data, config) {
    this.config = config
    this.storage_key = `${filter_data.name}:filters:${this.config.name}`
    this.filter_data = filter_data
    this.values = {}
    this.defaults = {}
    this.applied = {}
    this.is_initialized = false
    this.is_changed = false
    this.initialize_filter()
  }

  get filter_type () {
    return this.config.filter_type
  }

  get_id () {
    return `${this.filter_data.name}_filters_${this.config.name}`
  }
  initialize_filter () {
    this.values = this.config.get_initial(this)
    return this
  }

  apply_filter () {
    this.is_changed = false
    this.defaults = {...this.values}
    this.applied = this.config.apply_filter(this, this.values)
    return this.applied
  }

  apply_local () {
    this.is_changed = false
    this.apply_filter()
    this.filter_data.update_is_changed()
    this.filter_data.update_filters()
  }

  on_change () {
    if (this.config._apply_on_change || !this.is_initialized) {
      this.apply_local()
    } else {
      this.is_changed = this.is_changed || !lodash_isEqual(this.values, this.defaults)
      this.filter_data.update_is_changed()
    }
    this.is_initialized = true
  }

  change_type (type) {
    this.config.change_type(this, type)
  }

  get component_name () {
    return this.config.component_name
  }

  get name () {
    return this.config.name
  }

  destroy (update = true) {
    this.config.destroy(this)
    let index = this.filter_data.enabled_filters.findIndex((x) => this.config.name === x.config.name)
    if (index >= 0) this.filter_data.enabled_filters.splice(index, 1)
    index = this.filter_data.filter_selector.values.selected.findIndex((x) => x === this.config.name)
    if (index >= 0) {
      this.filter_data.filter_selector.values.selected.splice(index, 1)
      this.filter_data.filter_selector.apply_filter()
    }
    if (update) this.filter_data.update_filters()
    this.filter_data.update_is_changed()
  }

  enable () {
    this.config.enable()
    this.on_change()
    // if (!this.config.is_required) this.on_change()
  }

  clear () {
    this.config.clear(this)
    this.initialize_filter()
    this.on_change()
  }
}

export {
  AppliedFilter,
}
