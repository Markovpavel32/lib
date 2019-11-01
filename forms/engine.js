import lodash_each from 'lodash/each'
import {ErrorMessage} from '../errors/store'
import {FormEngineErrorsParser} from './form'
import {isRequired} from '../vuex_method'
import moment from 'moment'

function validate_field (field = isRequired()) {
  let errors = []
  if (!field.options.validator || field.readonly === true) return errors
  field.options.validator.forEach((validator) => {
    let addErrors = err => {
      if (Array.isArray(err)) Array.prototype.push.apply(errors, err)
      else if (err.length) errors.push(err)
    }
    let res = validator(undefined, field, {})
    if (res && res.then) {
      res.then(err => {
        if (err) addErrors(err)
      })
    } else if (res) addErrors(res)
  })
  return errors
}

class FormEngine {
  constructor (component = isRequired(), name = isRequired()) {
    this.name = name
    this.component = component
    this.errors = []
    this.fields = []
    this.showFieldErrors = true
    // this.field_components = []
    this.field_components = new Map()
    this.on_change_callbacks = []
    this.formOptions = {
      validateAfterChanged: true,
      fieldIdPrefix: `${this.name}-`
    }
  }

  no_field_errors () {
    this.showFieldErrors = false
    return this
  }
  with_fields (fields) {
    this.fields = [...this.fields, ...fields]
    return this
  }

  modelUpdated (newVal, schema) {
    this.on_change_callbacks.forEach((x) => x.on_change ? x.on_change(newVal, schema) : x(newVal, schema))
  }

  get_field (name) {
    return this.fields.find((x) => x.name === name)
  }

  on_change (callback) {
    this.on_change_callbacks.push(callback)
    return this
  }
  // Child field executed validation
  onFieldValidated (res, errors, field) {
    // Remove old errors for this field
    this.errors = this.errors.filter(e => e.field !== field.schema.model)

    if (!res && errors && errors.length > 0) {
      // Add errors with this field
      errors.forEach((err) => {
        this.errors.push({
          field: field.schema,
          error: err
        })
      })
    }
    let isValid = this.errors.length === 0
    this.component.$emit('validated', isValid, this.errors)
  }

  // Validating the model properties
  validate () {
    this.clearValidationErrors()
    for (let field of this.fields) {
      let errors = []
      if (this.field_components.has(field.name) && this.field_components.get(field.name).$refs.form_field) {
        let child = this.field_components.get(field.name).$refs.form_field
        errors = child.validate(true)
      } else {
        errors = validate_field(field)
      }
      errors.forEach((err) => {
        this.errors.push({
          field: field.name,
          error: err
        })
      })
    }
    let isValid = this.errors.length === 0
    this.component.$emit('validated', isValid, this.errors)
    return isValid
  }

  // Clear validation errors
  clearValidationErrors () {
    this.errors.splice(0)
    lodash_each(this.field_components.values(), (field_component) => {
      if (field_component && field_component.$refs.form_field) {
        field_component.$refs.form_field.clearValidationErrors()
      }
    })
  }
  register_field_component (field_component) {
    this.field_components.set(field_component.field.name, field_component)
  }
  unregister_field_component (field_component) {
    this.field_components.delete(field_component.field.name)
  }

  get_errors (field_name) {
    return this.errors.filter(e => e.field.model === field_name || e.field === field_name)
  }

  hide_errors (state) {
    new ErrorMessage(this.name).hide_error(state)
    new FormEngineErrorsParser(this.name, this, state).clear_errors()
  }

  parse_errors (state, e) {
    new FormEngineErrorsParser(this.name, this, state).parse_errors(e)
  }

  call_field_component (field_name, callback) {
    if (this.field_components.has(field_name)) callback(this.field_components.get(field_name).$refs.form_field)
    return this
  }

  extract_initials (object, name_relations) {
    name_relations = name_relations || {}
    let result = {}
    for (let field of this.fields) {
      let relation_name = name_relations[field.name] || field.name
      if (object.hasOwnProperty(relation_name)) {
        if (field.type === 'DatePicker') {
          let value = object[relation_name]
          result[field.name] = value ? moment(value).toDate() : value
        } else result[field.name] = object[relation_name]
      }
    }
    return result
  }

  format_values (model) {
    let result = {...model}
    for (let field of this.fields) {
      if (result.hasOwnProperty(field.name) && field.type === 'DatePicker' && result[field.name]) {
        let value = result[field.name]
        let format = field.options.dateTimePickerOptions.format
        let parsed = moment(value, format)
        if (parsed.isValid()) {
            if (format === 'LT') parsed = parsed.format('HH:mm:ss')
            else if (format === 'L') parsed = parsed.format('YYYY-MM-DD')
            else if (format === 'L LT') parsed = parsed.format('YYYY-MM-DD HH:mm:ss')
            result[field.name] = parsed
        }
      }
    }
    return result
  }
}

export {
  FormEngine
}
