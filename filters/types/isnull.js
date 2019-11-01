import {ListFilterType} from './base'

class IsNullFilterType extends ListFilterType {
  apply_filter (filter, cond) {
    return {[this.key]: true}
  }
}

export {IsNullFilterType}
