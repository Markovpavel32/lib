import moment from 'moment'
import lodash_map from 'lodash/map'
import lodash_camelCase from 'lodash/camelCase'
import VueFormGenerator from 'vue-form-generator'
import {isRequired} from '../vuex_method'
import Vue from 'vue'

function use_form_generator () {
  Object.assign(VueFormGenerator.validators.resources, {
    fieldIsRequired: 'Обязательное поле',
    invalidFormat: 'Неправильный формат',

    numberTooSmall: 'Число слишком маленькое! Минимум: {0}',
    numberTooBig: 'Число слишком большое! Максимум: {0}',
    invalidNumber: 'Неправильное число',

    textTooSmall: 'Длина слишком маленькая! Текущая: {0}, Минимум: {1}',
    textTooBig: 'Длина слишком большая! Текущая: {0}, Максимум: {1}',
    thisNotText: 'Это не текст!',

    thisNotArray: 'Это не список!',

    selectMinItems: 'Выберите минимум {0} элемент(ов)',
    selectMaxItems: 'Выберите максимум {0} элемент(ов)',

    invalidDate: 'Неправильная дата',
    dateIsEarly: 'Дата слишком маленькая! Текущая: {0}, Максимум: {1}',
    dateIsLate: 'Дата слишком большая! Текущая: {0}, Максимум: {1}',

    invalidEmail: 'Неправильный адрес почты',
    invalidURL: 'Неправильный адрес',

    invalidCard: 'Неправильный формат номера карты',
    invalidCardNumber: 'Неправильный номер карты',

    invalidTextContainNumber: 'Не может содержать цифры или специальные символы',
    invalidTextContainSpec: 'Не может содержать специальные символы'
  })
}

function get_country_phone_cleave_settings (country) {
  let options = {
    numericOnly: true,
    prefix: '+7',
    blocks: [2, 3, 3, 2, 2],
  }
  if (country.toUpperCase() === 'UA') {
    options.prefix = '+380'
    options.blocks = [4, 2, 3, 2, 2]
  }
  if (country.toUpperCase() === 'BE') {
    options.prefix = '+375'
    options.blocks = [4, 2, 3, 2, 2]
  }
  return options
}

function get_field_components () {
  let vue_form_generator = require('vue-form-generator')
  let components = vue_form_generator.component.components
  if (components.formGroup) components = components.formGroup.components
  use_form_generator()
  return components
}

class VueFieldData {
  constructor (name, type) {
    this.model = this.name = name
    this.type = type
    this._is_disabled = undefined
    this.is_focus = undefined
    this.options = {
      model: this.name,
      label: name,
      inputType: 'text',
      inputName: name,
      validator: [],
      selectOptions: {
        noneSelectedText: 'выберите один из вариантов',
        hideNoneSelectedText: true
      },
      add_when: function () {
        return true
      },
      is_visible: function (model) {
        return true
      },
      attributes: {},
      events: {},
      required: true
    }
  }

  input () {
    this.type = 'input2'
    return this
  }

  tel () {
    this.type = 'input2'
    this.options.inputType = 'tel'
    return this
  }

  password () {
    this.type = 'input2'
    this.options.inputType = 'password'
    return this
  }

  number () {
    this.type = 'input2'
    this.options.inputType = 'number'
    return this
  }

  typeahead (search_func = isRequired(), format_func) {
    this.options.typeahead = {
      format: format_func || ((item) => item.id),
      search_func: search_func,
      key: 'id'
    }
    this.type = 'typeahead'
    return this
  }

  typeahead_key (key = isRequired()) {
    this.options.typeahead['key'] = key
    return this
  }

  use_type (type) {
    this.type = type
    return this
  }

  set_focus () {
    this.is_focus = true
    return this
  }

  use_component (component) {
    this.component = component
    this._component_name = component.name
    this.type = component.name
    return this
  }

  use_component_name (name) {
    this._component_name = name
    this.type = name
    return this
  }

  component_name () {
    return this._component_name || lodash_camelCase(`field_${this.type}`)
  }

  optional () {
    this.options.required = false
    this.options.selectOptions.hideNoneSelectedText = false
    return this
  }

  phone_mask () {
    /* eslint-disable no-unused-vars */
    let cleave = require(/* webpackChunkName: "cleave" */'cleave.js')
    require('cleave.js/dist/addons/cleave-phone.ru.js')
    // let cleave = require('cleave.js')
    /* eslint-disable no-unused-vars */
    this.options.cleaveOptions = {
      numericOnly: true,
      // delimiters: [') ', '-', '-', '-'],
      prefix: '+7 ',
      // blocks: [7, 3, 2, 2],
      phone: true,
      phoneRegionCode: 'RU'
      // noImmediatePrefix: true,
      // delimiterlazyshow: true
    }
    return this
  }

  country_phone_mask (country) {
    /* eslint-disable no-unused-vars */
    let cleave = require('cleave.js')
    this.options.cleaveOptions = get_country_phone_cleave_settings(country || 'RU')
    return this
  }

  values (values) {
    this.options.values = values
    return this
  }

  add_options (options) {
    Object.assign(this.options, options)
    return this
  }

  add_select_options (options) {
    Object.assign(this.options.selectOptions, options)
    return this
  }

  add_date_picker_options (options) {
    Object.assign(this.options.dateTimePickerOptions, options)
    return this
  }

  copy_icon () {
    this.options.copy_icon = true
    return this
  }

  choices (values) {
    return this.values(lodash_map(values, (x) => {
      return {id: x[0], name: x[1]}
    }))
  }

  select_choices (values) {
    return this.values(lodash_map(values, (x) => {
      return {code: x[0], label: x[1]}
    }))
  }

  use_default (value) {
    this.options.default = value
    return this
  }

  label (label) {
    this.options.label = label
    return this
  }

  is_disabled (data, formEngine) {
    return this._is_disabled && this._is_disabled(data, formEngine)
  }

  disabled () {
    return this.disabled_when((data, formEngine) => true)
  }

  disabled_when (checker) {
    this._is_disabled = checker
    return this
  }

  visible_when (checker) {
    this.options.is_visible = checker
    return this
  }

  add_when (checker) {
    this.options.add_when = checker
    return this
  }

  add_validator (validator) {
    this.options.validator.push(validator)
    return this
  }

  get_schema () {
    return this.options
  }

  min_length (length) {
    this.options.min = length
    return this.add_validator(VueFormGenerator.validators.string)
  }

  max_length (length) {
    if (length > 0) this.options.maxlength = length
    return this
  }

  max_value (value) {
    this.options.max = value
    return this
  }

  on_enter (callback) {
    this.options.events['keyup'] = (e) => {
      if (e.keyCode === 13) callback(e)
    }
    return this
  }

  placeholder (placeholder) {
    this.options.placeholder = placeholder
    return this
  }

  help_text (text) {
    this.options.help_text = text
    this.hint = text
    return this
  }

  datetime_picker () {
    this.type = 'DatePicker'
    Vue.set(this.options, 'dateTimePickerOptions', {})
    Object.assign(this.options.dateTimePickerOptions, {
      locale: moment.locale(),
      minDate: moment('2012-01-01'),
      maxDate: moment().add(730, 'days'),
      format: 'L LT'
    })
    return this
  }

  date_picker () {
    this.type = 'DatePicker'
    Vue.set(this.options, 'dateTimePickerOptions', {})
    Object.assign(this.options.dateTimePickerOptions, {
      locale: moment.locale(),
      minDate: moment('2012-01-01'),
      maxDate: moment().add(730, 'days'),
      format: 'L'
    })
    return this
  }

  time_picker () {
    this.type = 'DatePicker'
    Vue.set(this.options, 'dateTimePickerOptions', {})
    Object.assign(this.options.dateTimePickerOptions, {
      locale: moment.locale(),
      format: 'LT'
    })
    return this
  }

  multi_select () {
    this.type = 'vueMultiSelect'
    Object.assign(this.options.selectOptions, {
      id: 'id',
      key: 'id',
      trackBy: 'id',
      label: 'name',
      multiple: true,
      optionsLimit: 7,
      taggable: false,
      hideSelected: true,
      selectLabel: '',
      selectedLabel: '',
      deselectLabel: ''

    })
    this.options.placeholder = 'Выберите вариант'
    return this
  }

  select () {
    this.type = 'select'
    return this.add_options({
      selectOptions: {
        noneSelectedText: 'выберите один из вариантов',
        hideNoneSelectedText: true
      }
    })
  }

  vue_select () {
    this.type = 'select'
    return this.use_component_name('fieldVueSelect')
  }

  file_button () {
    this.use_component_name('file-button')
    return this
  }

  on_change (callback) {
    this.options.onChange = callback
    return this
  }

  on_select_fabric (model) {
    return (selectedOption, id) => {
      model[this.name] = selectedOption.id
    }
  }

  modify (modifier) {
    return modifier(this)
  }

  radio (type) {
    this.use_type(type || 'radios')
    return this.add_options({
      radiosOptions: {
        value: 'id',
        name: 'name'
      }
    })
  }

  required () {
    this.options.validator.push('required')
    return this
  }

  get_attrs (formEngine = isRequired(), model = isRequired()) {
    return {
      field: this,
      schema: this.get_schema(),
      disabled: this.is_disabled(model, formEngine),
      model: model,
      formOptions: {
        fieldIdPrefix: formEngine.formOptions.fieldIdPrefix,
        validateAfterLoad: false,
        validateAfterChanged: true,
        validationErrorClass: 'error',
        validationSuccessClass: '',
      },
    }
  }
}

export {
  VueFieldData,
  get_field_components
}
