import {ValueParser} from './base'

class BooleanParser extends ValueParser {
  parse (value) {
    let result
    if (value === undefined || value === null) result = value
    else if (value === true || value === false) result = value
    else if (typeof (value) === 'string') {
      if (value === 'true') result = true
      else if (value === 'false') result = false
    } else result = Boolean(value)
    return result
  }
  format_value (value) {
    value = String(value)
    return value[0].toUpperCase() + value.slice(1)
  }
}

export {BooleanParser}
