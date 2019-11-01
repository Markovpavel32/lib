import {FetchListOperator} from './fetch_operator'
import {PageNumberPaginator} from './page_number_paginator'
import {normalize} from 'normalizr'
import {get_lock_uid, ModelSchemaLock, ModelSchemaSubscribe} from '../model_store/store'
import {DestroyListOperator} from './destroy_operator'
import {isRequired} from '../vuex_method'
import {ActionStateInfo} from '../action_states/store'
import {cached_property} from '../helpers'

class ServerListTableCallback {
  constructor ($store, server_list) {
    this.$store = $store
    this.server_list = server_list
  }

  on_change (applied, old) {
    this.server_list.fetch(this.$store)
  }

  on_changed (applied, old) {
    this.server_list.fetch(this.$store)
  }
}

class ServerListData {
  constructor (name = isRequired(), source = isRequired()) {
    this.name = name
    this.lock_id = this.name + get_lock_uid()
    this.paginator = new PageNumberPaginator(name)
    this.ids = []
    this.data = []
    this.source = source
    this.on_row_remove_callbacks = []
    this.on_initiated_callbacks = []
    this.on_fetch_callbacks = []
    this.on_destroy_callbacks = []
    this.is_fetching = false
    this.initiated = false
    this.query_filter = {}
    this._filters = []
    this.initiated_promise = new Promise((resolve, reject) => {
      this.resolve_iniated = resolve
    })
    this.remove_handler = new ServerListRemoveHandler(this, this.source)
    new ModelSchemaSubscribe(this.source.entity).subscribe_remove(this.remove_handler)
    this.fetch_count = 0
  }

  fetch (state = isRequired()) {
    new FetchListOperator(this).get_list(state)
  }

  destroy (state = isRequired()) {
    new DestroyListOperator(this).destroy(state)
  }

  set_next_page ($store) {
    let next_page = this.paginator.get_next_page()
    if (next_page) this.set_page($store, next_page)
  }

  set_prev_page ($store) {
    let prev_page = this.paginator.get_prev_page()
    if (prev_page) this.set_page($store, prev_page)
  }

  set_page ($store, page_number) {
    this.paginator.next_page = page_number
    this.fetch($store)
  }

  set_page_func ($store = isRequired()) {
    return (page_number) => this.set_page($store, page_number)
  }

  on_rows_remove (removed_ids) {
    this.on_row_remove_callbacks.forEach((func) => {
      func(this, removed_ids)
    })
    return this
  }

  on_init (callback) {
    this.on_initiated_callbacks.push(callback)
    return this
  }

  on_initiated (initial_ids) {
    this.on_initiated_callbacks.forEach((func) => {
      func(this, initial_ids)
    })
    return this
  }

  on_fetch (callback) {
    this.on_fetch_callbacks.push(callback)
    return this
  }

  on_fetched (ids, normalized) {
    this.on_fetch_callbacks.forEach((func) => {
      func(this, ids, normalized)
    })
    return this
  }

  on_destroy (callback) {
    this.on_destroy_callbacks.push(callback)
    return this
  }

  on_destroyed () {
    this.on_destroy_callbacks.forEach((func) => func(this))
  }

  get_query () {
    let applied = {}
    this._filters.forEach((x) => Object.assign(applied, x.applied))
    return {...this.query_filter, ...applied, page: this.paginator.next_page, limit: this.paginator.per_page}
  }

  add_query_filter (query) {
    // this.query_filter = query
    for (let key in query) {
      this.query_filter[key] = query[key]
    }
    return this
  }

  use_filters ($store, filters) {
    this._filters.push(filters)
    filters.on_change && filters.on_change(new ServerListTableCallback($store, this))
    return this
  }

  push_first ($store = isRequired(), id = isRequired()) {
    this.ids.splice(0, 0, id)
    new ModelSchemaLock([id], this.source.entity, this.lock_id).acquire($store)
  }

  splice ($store = isRequired(), id, n) {
    this.ids.splice(n, 0, id)
    new ModelSchemaLock([id], this.source.entity, this.lock_id).acquire($store)
  }

  push (id) {
    this.ids.splice(this.ids.length, 0, id)
  }

  push_id ($store = isRequired(), id = isRequired()) {
    this.push(id)
    new ModelSchemaLock([id], this.source.entity, this.lock_id).acquire($store)
  }

  set_limit (limit) {
    this.paginator.set_limit(limit)
    return this
  }

  use_state (state = isRequired()) {
    this.state = state
    return this
  }

  @cached_property
  get action_info () {
    if (!this.state) throw Error('this.state undefined, use method use_state')
    this._states = new ActionStateInfo(this.state, this.name)
    return this._states
  }
}

class ServerListSource {
  constructor (url = isRequired(), entity = isRequired()) {
    this.url = url
    this.entity = entity
  }

  get_model_data (response = isRequired()) {
    return normalize(response.data.results, [this.entity.normalizr_entity])
  }

  get_instance_data (response = isRequired()) {
    return normalize([response.data], [this.entity.normalizr_entity])
  }
}

class ServerListRemoveHandler {
  constructor (server_list = isRequired()) {
    this.server_list = server_list
  }

  on_delete (id) {
    let index = this.server_list.ids.indexOf(id)
    if (index >= 0) {
      this.server_list.ids.splice(index, 1)
      this.server_list.on_rows_remove([id])
    }
  }
}

export {
  ServerListData,
  ServerListSource,
  ServerListRemoveHandler
}
