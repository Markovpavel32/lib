import {AbstractMethodError} from '../exceptions'
import pickBy from 'lodash/pickBy'
import {IntegerParser} from '../parsers/integer'
import {BooleanParser} from '../parsers/boolean'
import {DateTimeParser} from '../parsers/datetime'
import {DateParser} from '../parsers/date'
import {StringParser} from '../parsers/string'

class BaseFilterType {
  constructor () {
    this.is_required = true
    this.is_enabled = false
    this._apply_on_change = false
  }

  set_required (value) {
    this.is_required = value
    return this
  }

  optional () {
    this.is_required = false
    return this
  }

  apply_on_change () {
    this._apply_on_change = true
    return this
  }

  required () {
    return this.set_required(true)
  }

  apply_filter (filter, cond, save = true) {
    throw AbstractMethodError('method apply_filter must be defined')
  }

  load (filter) {
    return {}
  }

  get_initial (filter, saved) {
    let initials = this.get_initial_cond(filter)
    let loaded = pickBy(this.load(filter), (x) => x !== undefined && x !== null)
    Object.assign(initials, loaded, saved || {})
    return initials
  }

  get_initial_cond (filter) {
    return {}
  }
}

class ListFilterType extends BaseFilterType {
  constructor (name, title) {
    super()
    this.title = title
    this.name = name
    this.key = name
    this.parser = new StringParser()
    this.apply_case = false
    this._condition_filter = undefined
    this._component_name = 'filter-dumb'
    this._in_memory = false
  }

  use_key (key) {
    this.key = key
    return this
  }

  get component_name () {
    return this._component_name
  }

  use_component (component_name) {
    this._component_name = component_name
    return this
  }

  clean (filter, cond) {
    return {}
  }

  destroy (applied_filter) {
    this.is_enabled = false
    if (!this.is_required) this.clear(applied_filter)
  }

  enable (applied_filter) {
    this.is_enabled = true
  }

  clear (applied_filter) {}

  use_parser (parser) {
    this.parser = parser
    return this
  }

  number () {
    return this.use_parser(new IntegerParser())
  }

  string () {
    return this.use_parser(new StringParser())
  }

  use_case () {
    this.apply_case = true
    return this
  }

  date () {
    return this.use_parser(new DateParser())
  }

  datetime () {
    return this.use_parser(new DateTimeParser())
  }

  boolean () {
    return this.use_parser(new BooleanParser())
  }

  in_memory () {
    this._in_memory = true
    return this
  }

  use_filter (condition_filter) {
    this._condition_filter = condition_filter
    return this
  }
}

export {ListFilterType, BaseFilterType}
