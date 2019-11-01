import {ValueParserError} from '../exceptions'
import {ValueParser} from './base'

class StringParser extends ValueParser {
  parse (value) {
    if (value === undefined) return ''
    if (typeof value === 'string' || value instanceof String) {
      return value
    } else {
      throw new ValueParserError('Значение не является строкой')
    }
  }
}

export {StringParser}
