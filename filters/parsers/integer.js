import {ValueParserError} from '../exceptions'
import {ValueParser} from './base'

class IntegerParser extends ValueParser {
  parse (value) {
    let result = Number.parseInt(value)
    if (value && isNaN(result)) throw new ValueParserError(`Значение "${value}" не является числом`)
    if (isNaN(result)) result = undefined
    return result
  }
}

export {IntegerParser}
