import {ValueParserError} from '../exceptions'
import {ValueParser} from './base'

class ArrayParser extends ValueParser {
  constructor (parser) {
    super()
    this.default = []
    this.parser = parser
  }

  parse (value) {
    let results = []
    let errors = []
    if (value === undefined) {

    } else if (Array.isArray(value)) {
      value.forEach((item) => {
        let is_error = false
        let result
        try {
          result = this.parser.format_value(this.parser.parse(item))
        } catch (e) {
          if (e instanceof ValueParserError) {
            is_error = true
            errors.push(e.message)
          } else throw e
        }
        if (!is_error && result !== undefined) results.push(result)
      })
      if (this.is_required && !results.length) throw new ValueParserError('Не найдены подходящие значения')
    } else if (this.is_required) {
      throw new ValueParserError('Значение не является массивом')
    }
    if (results.length === 0) results = [...this.default]
    return results
  }
}

export {ArrayParser}
