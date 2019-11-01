import {isRequired} from '../vuex_method'
import lodash_throttle from 'lodash/throttle'

function non_strict_equal_objects (a, b) {
  let result = true
  for (let key in a) {
    /* eslint-disable eqeqeq */
    result &= a.hasOwnProperty(key) && b.hasOwnProperty(key) && a[key] == b[key]
  }
  for (let key in b) result &= a.hasOwnProperty(key)
  return result
}

class ObjectChangesWatcher {
  constructor (initial = isRequired(), model_func = isRequired()) {
    this.initial = initial
    this.is_equal = true
    this.model_func = model_func
    this._update_func = lodash_throttle(() => {
      this.is_equal = non_strict_equal_objects(this.initial, this.model_func())
    }, 1000)
  }

  update (current) {
    this._update_func(current)
  }

  bind_form (formEngine = isRequired()) {
    formEngine.on_change((field, schema) => this.update())
    return this
  }

  reinit (new_initial) {
    this.initial = {...new_initial}
    this.is_equal = true
    return this
  }
}

export {
  ObjectChangesWatcher
}
