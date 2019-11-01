import {ChoiceParser} from '../parsers/choice'
import {ListFilterType} from './base'
import {ArrayParser} from '../parsers/array'

class MultipleChoiceFilterType extends ListFilterType {
  apply_filter (filter, cond, save = true) {
    let val_from = this.clean(filter, cond).selected
    if (save && !this._in_memory) this.save(filter, val_from)
    return val_from !== undefined ? {[this.key]: this.parser.format_value(val_from).join(', ')} : {}
  }

  clean (filter, cond) {
    return {selected: this.parser.parse(cond.selected)}
  }

  for_choices (choices) {
    this.parser = new ArrayParser(new ChoiceParser(choices).required())
    return this
  }

  by_default (value) {
    this.parser.by_default(value)
    return this
  }

  get_initial_cond (filter) {
    return {selected: this.parser.default}
  }

  load (filter) {
    if (this._in_memory) return {selected: this.parser.from_storage(undefined)}
    return {selected: this.parser.get_from_storage(`${filter.storage_key}:selected`)}
  }

  save (filter, selected) {
    this.parser.set_to_storage(`${filter.storage_key}:selected`, selected)
  }

  clear (filter) {
    this.parser.remove_from_storage(`${filter.storage_key}:selected`)
  }
}

export {MultipleChoiceFilterType}
