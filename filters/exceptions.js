function error_fabric (name) {
  function func (message) {
    this.name = name
    this.message = message || 'Сообщение по умолчанию'
    this.stack = (new Error()).stack
  }
  func.prototype = Object.create(Error.prototype)
  func.prototype.constructor = func
  return func
}

const ValueParserError = error_fabric('ValueParserError')
const FilterTypeError = error_fabric('FilterTypeError')
const AbstractMethodError = error_fabric('AbstractMethodError')
const OptionalFilterRequiredError = error_fabric('OptionalFilterRequiredError')
const WrongFilterName = error_fabric('WrongFilterName')
export {
  ValueParserError,
  AbstractMethodError,
  FilterTypeError,
  WrongFilterName,
  OptionalFilterRequiredError,
}
