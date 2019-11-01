import {BooleanParser} from '../parsers/boolean'
import {ListFilterType} from './base'

class RangeNumberFilterType extends ListFilterType {
  apply_filter (filter, cond, save = true) {
    if (save && !this._in_memory) this.save(filter, cond.val_from, cond.val_to, cond.gt_lt_e)
    let val_from = cond.val_from
    let val_to = cond.val_to
    cond = this.clean(filter, cond)
    let lt_prefix = cond.gt_lt_e ? 'lte' : 'lt'
    let gt_prefix = cond.gt_lt_e ? 'gte' : 'gt'
    let result = {}
    if (!isNaN(val_from)) result[`${this.key}__${gt_prefix}`] = this.parser.format_value(val_from)
    if (!isNaN(val_to)) result[`${this.key}__${lt_prefix}`] = this.parser.format_value(val_to)
    return result
  }

  load (filter) {
    if (this._in_memory) return {val_from: this.parser.from_storage(), val_to: this.parser.from_storage(), gt_lt_e: new BooleanParser().from_storage()}
    return {
      val_from: this.parser.get_from_storage(`${filter.storage_key}:val_from`),
      val_to: this.parser.get_from_storage(`${filter.storage_key}:val_to`),
      gt_lt_e: new BooleanParser().get_from_storage(`${filter.storage_key}:gt_lt_e`),
    }
  }

  clean (filter, cond) {
    return {
      gt_lt_e: new BooleanParser().parse(cond.gt_lt_e),
      val_from: this.parser.parse(cond.val_from),
      val_to: this.parser.parse(cond.val_to),
    }
  }

  save (filter, val_from, val_to, gt_lt_e) {
    this.parser.set_to_storage(`${filter.storage_key}:val_from`, val_from)
    this.parser.set_to_storage(`${filter.storage_key}:val_to`, val_to)
    new BooleanParser().set_to_storage(`${filter.storage_key}:gt_lt_e`, gt_lt_e)
  }

  clear (filter) {
    this.parser.remove_from_storage(`${filter.storage_key}:val_from`)
    this.parser.remove_from_storage(`${filter.storage_key}:val_to`)
    new BooleanParser().remove_from_storage(`${filter.storage_key}:gt_lt_e`)
  }

  get_initial_cond (filter) {
    return {gt_lt_e: true, val_from: undefined, val_to: undefined}
  }
}

export {RangeNumberFilterType}
