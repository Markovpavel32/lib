import {FilterRouter} from './types/router'
import {ValueFilterType} from './types/value'
import {ChoiceFilterType} from './types/choice'
import {RangeNumberFilterType} from './types/range'
// import {InFilterType} from './types/in'
import {MultipleChoiceFilterType} from './types/multiple_choice'

function prefixed (name, prefix) {
  if (prefix && prefix.length) return `${name}__${prefix}`
  return name
}

const MONTHS_CHOICES = [
  ['1', 'Январь'],
  ['2', 'Февраль'],
  ['3', 'Март'],
  ['4', 'Апрель'],
  ['5', 'Май'],
  ['6', 'Июнь'],
  ['7', 'Июль'],
  ['8', 'Август'],
  ['9', 'Сентябрь'],
  ['10', 'Октябрь'],
  ['11', 'Ноябрь'],
  ['12', 'Декабрь'],
]

const WEEK_DAYS_CHOICES = [
  ['0', 'Понедельник'],
  ['1', 'Вторник'],
  ['2', 'Среда'],
  ['3', 'Четверг'],
  ['4', 'Пятница'],
  ['5', 'Суббота'],
  ['6', 'Воскресение'],
]

const cur_date = new Date()

let YEAR_CHOICES = []
for (let i = 2012; i <= cur_date.getFullYear(); i++) YEAR_CHOICES.push([String(i), String(i)])

class FilterRouterFabric {
  constructor (name, title) {
    this.name = name
    this.title = title
    this.is_required = false
    this.types = []
  }

  get () {
    return new FilterRouter(this.name, this.title).use_types(this.types).set_required(this.is_required)
  }

  add_types (types) {
    this.types.push(...types)
    return this
  }

  for_string () {
    return this.add_types([
      new ValueFilterType(prefixed(this.name, 'exact'), 'Точное совпадение').string().use_case().use_component('filter-string').optional(),
      new ValueFilterType(prefixed(this.name, 'contains'), 'Вхождение подстроки').string().use_case().use_component('filter-string').optional(),
      // new InFilterType(prefixed(this.name, 'in'), 'Список, через запятую').string().use_component('filter-not-implemented'),
      new ValueFilterType(prefixed(this.name, 'startswith'), 'Начинается с... ').string().use_case().use_component('filter-string').optional(),
      new ValueFilterType(prefixed(this.name, 'endswith'), 'Заканчивается на ...').string().use_case().use_component('filter-string').optional(),
    ])
  }

  for_number () {
    return this.add_types([
      new ValueFilterType(this.name, '=').number().use_component('filter-number').optional(),
      new ValueFilterType(prefixed(this.name, 'lt'), '<').number().use_component('filter-number').optional(),
      new ValueFilterType(prefixed(this.name, 'lte'), '<=').number().use_component('filter-number').optional(),
      new ValueFilterType(prefixed(this.name, 'gt'), '>').number().use_component('filter-number').optional(),
      new ValueFilterType(prefixed(this.name, 'gte'), '=>').number().use_component('filter-number').optional(),
      // new InFilterType('in', 'Несколько значений').number().use_component('filter-not-implemented').optional(),
      new RangeNumberFilterType(prefixed(this.name, 'range'), 'Диапазон значений').use_key(this.name).number().use_component('filter-number-range').optional()
    ])
  }

  for_boolean () {
    return this.add_types([
      new ValueFilterType(this.name, 'равно').boolean().use_component('filter-boolean-radio').apply_on_change().optional(),
    ])
  }

  for_datetime () {
    return this.add_types([
      new ValueFilterType(this.name, 'Дата').datetime().use_component('filter-datetime').apply_on_change().optional(),
      // new InFilterType(prefixed(this.name, 'in'), 'Несколько дат').datetime().use_component('filter-not-implemented'),
      new ValueFilterType(prefixed(this.name, 'lt'), '<').datetime().use_component('filter-datetime').apply_on_change().optional(),
      new ValueFilterType(prefixed(this.name, 'lte'), '<=').datetime().use_component('filter-datetime').apply_on_change().optional(),
      new ValueFilterType(prefixed(this.name, 'gt'), '>').datetime().use_component('filter-datetime').apply_on_change().optional(),
      new ValueFilterType(prefixed(this.name, 'gte'), '>=').datetime().use_component('filter-datetime').apply_on_change().optional(),
      new ChoiceFilterType(prefixed(this.name, 'year'), 'По году').for_choices(YEAR_CHOICES).by_default(String(cur_date.getFullYear())).use_component('filter-choice').apply_on_change().optional(),
      new ChoiceFilterType(prefixed(this.name, 'month'), 'По месяцу').for_choices(MONTHS_CHOICES).by_default(String(cur_date.getMonth() + 1)).use_component('filter-choice').apply_on_change().optional(),
      new ChoiceFilterType(prefixed(this.name, 'week_day'), 'По дню недели').for_choices(WEEK_DAYS_CHOICES).use_component('filter-choice').apply_on_change().optional(),
      new RangeNumberFilterType(prefixed(this.name, 'range'), 'Диапазон дат').use_key(this.name).datetime().use_component('filter-datetime-range').apply_on_change().optional()
    ])
  }

  for_date () {
    return this.add_types([
      new ValueFilterType(this.name, 'Дата').date().use_component('filter-date').apply_on_change().optional(),
      new ValueFilterType(prefixed(this.name, 'lt'), '<').date().use_component('filter-date').apply_on_change().optional(),
      new ValueFilterType(prefixed(this.name, 'lte'), '<=').date().use_component('filter-date').apply_on_change().optional(),
      new ValueFilterType(prefixed(this.name, 'gt'), '>').date().use_component('filter-date').apply_on_change().optional(),
      new ValueFilterType(prefixed(this.name, 'gte'), '>=').date().use_component('filter-date').apply_on_change().optional(),
      // new InFilterType(prefixed(this.name, 'in'), 'Несколько дат').date().use_component('filter-not-implemented').optional(),
      new ChoiceFilterType(prefixed(this.name, 'year'), 'По году').for_choices(YEAR_CHOICES).by_default(String(cur_date.getFullYear())).use_component('filter-choice').apply_on_change().optional(),
      new ChoiceFilterType(prefixed(this.name, 'month'), 'По месяцу').for_choices(MONTHS_CHOICES).by_default(String(cur_date.getMonth() + 1)).use_component('filter-choice').apply_on_change().optional(),
      new ChoiceFilterType(prefixed(this.name, 'week_day'), 'По дню недели').for_choices(WEEK_DAYS_CHOICES).use_component('filter-choice').apply_on_change().optional(),
      new RangeNumberFilterType(prefixed(this.name, 'range'), 'Диапазон дат').use_key(this.name).date().use_component('filter-date-range').apply_on_change().optional()
    ])
  }

  for_choice (choices) {
    return this.add_types([
      new ChoiceFilterType(this.name, 'Равно').for_choices(choices).use_component('filter-choice').apply_on_change().optional(),
      new MultipleChoiceFilterType(prefixed(this.name, 'in'), 'Несколько значений').for_choices(choices).use_component('filter-multi-choice').optional(),
    ])
  }
  required () {
    this.is_required = true
    return this
  }
}

export {
  FilterRouterFabric
}
