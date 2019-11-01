import {ValueParserError} from '../exceptions'
import {ValueParser} from './base'

class ChoiceParser extends ValueParser {
  constructor (choices) {
    super()
    this.choices = choices || []
  }

  parse (value) {
    let item = this.choices.find((x) => x[0] === value)
    if (item === undefined) {
      if (this.is_required) throw new ValueParserError(`Значение "${value}" не является возможным вариантом`); else value = this.default
    }
    return value
  }

  by_default (value) {
    if (this.choices.find((x) => x[0] === value)) this.default = value
    return this
  }
}

export {ChoiceParser}
