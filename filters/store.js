import Vue from 'vue'
import {ModuleSchema} from '../vuex_module'
import {vuex_action, vuex_mutation} from '../vuex_method'
import {MultipleChoiceFilterType} from './types/multiple_choice'
import {cached_property} from '../helpers'
import {OptionalFilterRequiredError, WrongFilterName} from './exceptions'
import lodash_isEqual from 'lodash/isEqual'
import cloneDeep from 'lodash/cloneDeep'

let filter_store = {
  namespaced: true,
  state: {
    // managers: {},
    // filters: {},
  },
  actions: {},
  mutations: {}
}

let filter_editable_store = {}

let filter_schema = new ModuleSchema('filters', filter_store)

class FilterView {
  constructor (filter_operator, filter) {
    this.filter_operator = filter_operator
    this.filter_manager = filter_operator.filter_manager
    this.filter = filter
    this.filter_dict = {}
  }

  @cached_property
  get session_key () {
    return `${this.filter_manager.name}-${this.filter.name}`
  }

  get_initial () {
    return this.filter.get_initial(this, this.filter.load(this))
  }

  apply_filter (state, values) {
    if (this.filter_dict.is_changed || !this.filter_dict.initialized) {
      let filter_values = this.filter.apply_filter(this.filter, values)
      Vue.set(this.filter_dict, 'filter', filter_values)
      Vue.set(this.filter_dict, 'applied', cloneDeep(values))
      Vue.set(this.filter_dict, 'current', cloneDeep(values))
      Vue.set(this.filter_dict, 'is_changed', false)
    }
    return this.filter_dict['filter']
  }

  apply_current (state) {
    return this.apply_filter(state, this.filter_dict['current'])
  }

  // @cached_property
  // get filter_dict () {
  //   return filter_editable_store[this.filter_manager.name]['enabled_filters'][this.filter.name]
  // }

  get name () {
    return `${this.filter_manager.name}-${this.filter.name}`
  }

  // @vuex_action(filter_schema)
  on_change (state, values) {
    if (this.filter._apply_on_change) {
      this._apply_local(state, values)
      this.filter_operator.update_filters(state)
    } else {
      let is_changed = this.filter_dict.is_changed || !lodash_isEqual(values, this.filter_dict.applied)
      Vue.set(this.filter_dict, 'current', cloneDeep(values))
      this.set_is_changed(state, is_changed)
      this.filter_operator.update_is_changed(state)
    }
  }

  set_is_changed (state, is_changed) {
    Vue.set(this.filter_dict, 'is_changed', is_changed)
  }

  // @vuex_action(filter_schema)
  apply_local (state, values) {
    this._apply_local(state, values)
    this.filter_operator.update_filters(state)
  }

  _apply_local (state, values) {
    Vue.set(this.filter_dict, 'applied', cloneDeep(values))
    Vue.set(this.filter_dict, 'current', cloneDeep(values))
    Vue.set(this.filter_dict, 'filter', this.get_filter(state))
    Vue.set(this.filter_dict, 'is_changed', false)
    Vue.set(this.filter_dict, 'initialized', true)
  }

  get_values (state) {
    return this.filter_dict.current
  }

  get_filter (state, save = false) {
    return this.filter.apply_filter(this, this.filter_dict['applied'], save)
  }

  initialize (state) {
    if (this.filter.is_router) {
      let new_filter = this.filter.get_default_filter(this)
      this.filter_operator.add_filter(state, new_filter)
    }
    Vue.set(filter_editable_store[this.filter_manager.name]['enabled_filters'], this.filter.name, {})
    let initials = this.get_initial()
    this._apply_local(state, initials)
  }

  get applied_filter () {
    return this.filter_dict['filter']
  }

  get is_changed () {
    return this.filter_dict.is_changed
  }

  @vuex_mutation(filter_schema)
  clear (state) {
    this.filter.clear()
    this.initialize(state)
  }
}

class FilterOperator {
  constructor (filter_manager) {
    this.filter_manager = filter_manager
  }

  @vuex_action(filter_schema)
  initialize (state) {
    this.set_initial_state(state)
    this.enable_default_filters(state)
    let new_filters = this.collect_filters()
    this.set_filters(state, new_filters)
  }

  @vuex_mutation(filter_schema)
  set_initial_state (state) {
    Vue.set(filter_editable_store, this.filter_manager.name, {
      enabled_filters: new Map(),
      enabled: {}
    })
    Vue.set(state, this.filter_manager.name, {
      filters: [],
      applied_filters: {},
    })
    Vue.set(state[this.filter_manager.name], 'is_changed', false)
  }

  @cached_property
  get selector () {
    let choices = this.filter_manager.filters.map((x) => [x.name, x.name])
    return new MultipleChoiceFilterType(this.filter_manager.name + '_selected_filters', '').for_choices(choices)
  }

  @cached_property
  get selector_view () {
    return new FilterView(this, this.selector)
  }

  @vuex_mutation(filter_schema)
  enable_default_filters (state) {
    let selected = this.selector_view.get_initial().selected
    this.filter_manager.filters.forEach((filter) => {
      if (filter.is_required || (!filter.is_required && selected.find((x) => x === filter.name))) {
        this.initialize_filter(state, filter)
      }
    })
  }

  initialize_filter (state, filter) {
    let filter_view = new FilterView(this, filter)
    this.enabled_filters.set(filter.name, filter_view)
    filter_editable_store[this.filter_manager.name].enabled[filter.name] = filter_view
    filter_view.initialize()
  }

  @vuex_mutation(filter_schema)
  add_filter (state, filter) {
    if (filter.is_required) throw OptionalFilterRequiredError('Включить можно только опциональный фильтр')
    this.initialize_filter(state, filter)
    let initial = this.selector_view.get_initial()
    if (initial.selected.findIndex((x) => x === filter.name) < 0) {
      initial.selected.push(filter.name)
      this.selector_view.apply_filter(state, initial)
    }
  }

  @vuex_mutation(filter_schema)
  remove_filter (state, filter) {
    if (filter.name in this.enabled_filters) {
      this.enabled_filters.delete(filter.name)
    }
  }

  get_filter (state, name) {
    if (!(name in this.enabled_filters)) {
      throw WrongFilterName(`Wrong filter name ${name}\n possible: ${this.filter_manager.filters.map((x) => x.name)}`)
    }
    // return this.enabled_filters.get(name)
    return filter_editable_store[this.filter_manager.name].enabled[name]
  }

  get enabled_filters () {
    return filter_editable_store[this.filter_manager.name]['enabled_filters']
  }

  @vuex_mutation(filter_schema)
  update_is_changed (state) {
    let is_changed = false
    this.enabled_filters.forEach((x) => {
      is_changed |= x.is_changed
    })
    Vue.set(state[this.filter_manager.name], 'is_changed', is_changed)
  }

  // @vuex_action(filter_schema)
  update_filters (state) {
    let new_filters = this.apply_filters(state)
    this.update_is_changed(state)
    this.set_filters(state, new_filters)
  }

  collect_filters () {
    let new_filters = {}
    for (let filter of this.enabled_filters.values()) {
      Object.assign(new_filters, filter.applied_filter)
    }
    return new_filters
  }

  apply_filters (state) {
    let new_filters = {}
    for (let filter of this.enabled_filters.values()) {
      Object.assign(new_filters, filter.apply_current(state))
    }
    return new_filters
  }

  @vuex_mutation(filter_schema)
  set_filters (state, new_filters) {
    let old_filters = state[this.filter_manager.name].applied_filters
    Vue.set(state[this.filter_manager.name], 'applied_filters', new_filters)
    if (!lodash_isEqual(new_filters, old_filters)) this.filter_manager.on_change_callbacks.forEach((x) => x.on_change(new_filters, old_filters))
  }

  @vuex_action(filter_schema)
  clear_filters (state) {
    Array.from(this.enabled_filters.values()).forEach((filter) => {
      if (filter.config.is_router && !filter.config.is_required) this.enabled_filters.delete(filter.name); else filter.clear()
    })
    this.apply_filters(state)
  }
}

export {
  filter_schema,
  FilterView,
  FilterOperator,
}
