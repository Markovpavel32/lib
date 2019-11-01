import {BooleanParser} from '../parsers/boolean'
import {ListFilterType} from './base'
import {BaseConditionFilter} from '../condition_filter'

class ValueConditionFilter extends BaseConditionFilter {
  get_filter (filter, cond) {
    let prefix = this.key
    let val_from = cond.val_from
    if (this.apply_case && !cond.case) {
      let splitted = prefix.split('__')
      splitted[splitted.length - 1] = 'i' + splitted[splitted.length - 1]
      prefix = splitted.join('__')
    }
    return val_from !== undefined && (val_from !== '' || this._allow_empty) ? {[prefix]: filter.parser.format_value(val_from)} : {}
  }

  allow_empty () {
    this._allow_empty = true
    return this
  }
}

class ValueFilterType extends ListFilterType {
  constructor (name, title) {
    super(name, title)
    this._val_from = undefined
    this._condition_filter = new ValueConditionFilter().use_key(this.key)
  }

  use_case () {
    this._condition_filter.use_case()
    return this
  }

  use_key (key) {
    this._condition_filter.use_key(this.key)
    return this
  }

  apply_filter (filter, cond) {
    cond = this.clean(filter, cond)
    if (!this._in_memory) this.save(filter, cond.val_from, cond.case)
    return this._condition_filter.get_filter(this, cond)
  }

  clean (filter, cond) {
    return {val_from: this.parser.parse(cond.val_from), case: cond.case}
  }

  get_initial_cond (filter) {
    return {val_from: this._val_from, case: false}
  }

  load (filter) {
    if (this._in_memory) return {val_from: this.parser.from_storage(), case: new BooleanParser().from_storage()}

    let loaded = {val_from: this.parser.get_from_storage(`${filter.storage_key}:val_from`)}
    if (this.apply_case) loaded['case'] = new BooleanParser().get_from_storage(`${filter.storage_key}:case`)
    return loaded
  }

  save (filter, val_from, with_case) {
    this.parser.set_to_storage(`${filter.storage_key}:val_from`, val_from)
    if (this.apply_case) new BooleanParser().set_to_storage(`${filter.storage_key}:case`, with_case)
  }

  clear (filter) {
    this.parser.remove_from_storage(`${filter.storage_key}:val_from`)
    if (this.apply_case) new BooleanParser().remove_from_storage(`${filter.storage_key}:case`)
  }

  by_default (value) {
    this.parser.by_default(value)
    this._val_from = value
    return this
  }

  modify_filter (modifier) {
    modifier(this._condition_filter)
    return this
  }
}

export {ValueFilterType}
