import {ValueParserError} from '../exceptions'

class ValueParser {
  constructor () {
    this.is_required = false
    this.default = undefined
  }

  by_default (value) {
    this.default = value
    return this
  }

  parse (value) {
    return [value, true]
  }

  to_storage (value) {
    return JSON.stringify(value)
  }

  set_to_storage (key, value) {
    return window.localStorage.setItem(this._key || key, this.to_storage(value))
  }

  get_from_storage (key) {
    return this.from_storage(window.localStorage.getItem(this._key || key))
  }

  remove_from_storage (key) {
    window.localStorage.removeItem(this._key || key)
  }

  from_storage (value) {
    try {
      value = JSON.parse(value)
    } catch (e) {
      if (!(e instanceof SyntaxError)) throw (e)
      value = this.default
    }
    let result
    try {
      result = this.parse(value)
    } catch (e) {
      if (!(e instanceof ValueParserError)) throw (e)
    }
    return result
  }

  required () {
    this.is_required = true
    return this
  }

  format_value (value) {
    return value
  }

  use_key (key) {
    this._key = key
    return this
  }
}

export {
  ValueParser}
