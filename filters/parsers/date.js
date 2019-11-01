import moment from 'moment/moment'
import {ValueParser} from './base'

class DateParser extends ValueParser {
  format_value (value) {
    return value instanceof Date ? moment(value).format('YYYY-MM-DD') : undefined
  }

  parse (value) {
    let result
    if (Number.isInteger(value) && value >= 1000000000) result = new Date(value)
    else if (value instanceof Date) result = value
    else if (typeof (value) === 'string') {
      if (value.indexOf('-') >= 0 && Date.parse(value)) result = new Date(value)
      else if (value.length === 10 && moment(value, 'L')._isValid) result = moment(value, 'L')._d
    }
    return result
  }
}

export {DateParser}
