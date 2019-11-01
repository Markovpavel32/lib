import {isRequired} from '../vuex_method'

class ConnectedFilter {
  constructor ($store = isRequired()) {
    this.applied = {}
    this.callback = undefined
    this.$store = $store
    this.func = ($store, ids) => { return {id__in: ids} }
  }

  on_rows_change (list_data = isRequired(), ids = isRequired()) {
    let old = this.applied
    this.applied = this.func(this.$store, ids)
    this.callback.on_change(this.applied, old)
  }

  on_change (callback = isRequired()) {
    this.callback = callback
    return this
  }

  use_func (func = isRequired()) {
    this.func = func
    return this
  }
}

export {
  ConnectedFilter
}
