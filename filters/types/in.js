import {ArrayParser} from '../parsers/array'
import {ListFilterType} from './base'

class InFilterType extends ListFilterType {
  apply_filter (filter, cond, save = true) {
    let value = this.clean(filter, cond).val_in
    let result = {}
    if (value.length) result = {[this.key]: value}
    if (save && !this._in_memory) this.save(filter, value)
    return result
  }

  clean (filter, cond) {
    return {val_in: this.array_parser.parse(cond.val_in)}
  }

  get array_parser () {
    return new ArrayParser(this.parser)
  }

  get_initial_cond (filter) {
    return {val_in: []}
  }

  load (filter) {
    if (this._in_memory) return {val_in: []}
    return {val_in: this.array_parser.get_from_storage(`${filter.storage_key}:val_in`)}
  }

  save (filter, val_in) {
    this.array_parser.set_to_storage(`${filter.storage_key}:val_in`, val_in)
  }

  clear (filter) {
    this.parser.remove_from_storage(`${filter.storage_key}:val_in`)
  }
}

export {InFilterType}
