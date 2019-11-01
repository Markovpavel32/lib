import moment from 'moment/moment'
import {ValueParser} from './base'

class DateTimeParser extends ValueParser {
  format_value (value) {
    return value instanceof Date ? moment(value).format('L LT') : undefined
  }

  parse (value) {
    let result
    if (Number.isInteger(value) && value >= 1000000000) result = new Date(value)
    else if (value instanceof Date) result = value
    else if (typeof (value) === 'string' && (value.indexOf('-') >= 0) && Date.parse(value)) result = new Date(value)
    return result
  }
}

export {DateTimeParser}
