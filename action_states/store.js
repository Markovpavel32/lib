import Vue from 'vue'
import {ModuleSchema} from '../vuex_module'
import {isRequired, vuex_mutation} from '../vuex_method'
import {cached_property} from '../helpers'

let action_state_store = {
  namespaced: true,
  actions: {},
  mutations: {},
  state: {
    pending: {},
    operations: {}
  }
}

let action_state_schema = new ModuleSchema('action_states', action_state_store)

class ActionStateOperator {
  constructor (uid) {
    this.uid = uid
    this._save = false
  }

  save_to_store () {
    this._save = true
    return this
  }

  save (state = isRequired(), state_name, namespace) {
    let uid = this.uid
    if (namespace) uid = namespace + uid
    Vue.set(state.operations, uid, state_name)
    if (this._save && state_name) window.sessionStorage.setItem(uid + ':state', state_name)
    if (this._save && !state_name) window.sessionStorage.removeItem(uid + ':state')
  }

  @vuex_mutation(action_state_schema)
  edit (state) {
    this.save(state, 'edit')
  }

  @vuex_mutation(action_state_schema)
  more (state) {
    this.save(state, 'more')
  }

  @vuex_mutation(action_state_schema)
  create (state) {
    this.save(state, 'create')
  }

  @vuex_mutation(action_state_schema)
  detail (state) {
    this.save(state, undefined)
  }

  @vuex_mutation(action_state_schema)
  remove (state) {
    this.save(state, 'remove')
  }

  @vuex_mutation(action_state_schema)
  set (state, operation, namespace) {
    this.save(state, operation, namespace)
  }

  @vuex_mutation(action_state_schema)
  pending (state) {
    Vue.set(state.pending, this.uid, 'pending')
  }

  @vuex_mutation(action_state_schema)
  finally (state) {
    Vue.set(state.pending, this.uid, undefined)
  }

  @vuex_mutation(action_state_schema)
  load_state (state = isRequired()) {
    this.save_to_store()
    let saved_state = window.sessionStorage.getItem(this.uid + ':state')
    if (saved_state) Vue.set(state.operations, this.uid, saved_state)
  }

  @vuex_mutation(action_state_schema)
  success (state) {
    this.save(state, 'success', 'status')
  }

  @vuex_mutation(action_state_schema)
  normal (state) {
    this.save(state, undefined, 'status')
  }
}

class ActionStateInfo {
  constructor (state, uid) {
    this.state = state
    this.uid = uid
    this._callbacks = []
  }

  get is_edit () {
    return this.state.action_states.operations[this.uid] === 'edit'
  }

  get is_more () {
    return this.state.action_states.operations[this.uid] === 'more'
  }

  get is_create () {
    return this.state.action_states.operations[this.uid] === 'create'
  }

  get is_detail () {
    return this.state.action_states.operations[this.uid] === undefined
  }

  get is_remove () {
    return this.state.action_states.operations[this.uid] === 'remove'
  }

  get is_pending () {
    return this.state.action_states.pending[this.uid] === 'pending'
  }

  get disabled_dict () {
    return {disabled: this.is_pending}
  }

  is (operation, namespace) {
    let uid = this.uid
    if (namespace) uid = namespace + uid
    return this.state.action_states.operations[uid] === operation
  }

  get is_success () {
    return this.is('success', 'status')
  }

  get is_error () {
    return Boolean(this.state.errors[this.uid])
  }
}

class ActionStateMixin {
  @cached_property
  get action_operator () {
    return new ActionStateOperator(this.uid)
  }

  @cached_property
  get action_info () {
    return new ActionStateInfo(this.state, this.uid)
  }

  save_state ($store) {
    this.action_operator.load_state($store)
    return this
  }
}

export {
  action_state_schema,
  ActionStateOperator,
  ActionStateInfo,
  ActionStateMixin
}
