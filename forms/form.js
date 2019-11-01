import {ErrorDisplay, ErrorMessage} from '../errors/store'
import lodash_each from 'lodash/each'
import lodash_remove from 'lodash/remove'
import lodash_find from 'lodash/find'

function get_form_error (message) {
  let called = false
  function ajax_validator (value) {
    if (!called) {
      called = true
      return message
    }
  }
  ajax_validator.func_name = 'ajax_validator'
  return ajax_validator
}

class FormEngineErrorsParser {
  constructor (name, form, state) {
    this.name = name
    this.form = form
    this.state = state
    this.fields = this.form.fields
  }

  parse_errors (event) {
    if (!event) return
    if (event.response && event.response.status === 400) {
      let data = event.response.data
      if (data.non_field_errors) {
        new ErrorMessage(this.name).show_error(this.state, data.non_field_errors[0])
      } else if (data.splice && data.length > 0) {
        new ErrorMessage(this.name).show_error(this.state, data[0])
      } else {
        lodash_each(data, (message, key) => {
          let field = lodash_find(this.fields, (x) => x.name === key)
          if (field) {
            field.options.validator.splice(0, 0, get_form_error(message))
          }
        })
      }
      this.form.validate()
    } else {
      new ErrorDisplay(this.name, this.state).catch_error(event)
    }
  }

  clear_errors () {
    lodash_each(this.fields, (field) => {
      lodash_remove(field.options.validator, (x) => x && x.func_name && x.func_name === 'ajax_validator')
    })
    this.form.clearValidationErrors()
  }
}

export {
  FormEngineErrorsParser
}
