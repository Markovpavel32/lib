import {ErrorDisplay, ErrorMessage} from '../errors/store'
import {ajax_get, ajax_post} from '../ajax'
import {get_lock_uid, ModelSchemaLock, ModelSchemaSubscribe, ModelSchemaUpdater} from '../model_store/store'
import {DestroyListOperator} from './destroy_operator'
import {ServerListRemoveHandler} from './server_list'
import {isRequired} from '../vuex_method'
import {cached_property} from '../helpers'
import {ActionStateInfo} from '../action_states/store'

class ServerInstanceData {
  constructor (name, source) {
    this.name = name
    this.lock_id = this.name + get_lock_uid()
    this.source = source
    this.is_fetching = false
    this.initiated = false
    this.ids = []
    this.on_initiated_callbacks = []
    this.before_insert_callbacks = []
    this.on_fail_callbacks = []
    this.on_destroy_callbacks = []
    this.on_fetched_callbacks = []
    this._post = false
    this.data = {}
    this.initiated_promise = new Promise((resolve, reject) => {
      this.resolve_iniated = resolve
    })
    this.remove_handler = new ServerListRemoveHandler(this, this.source)
    new ModelSchemaSubscribe(this.source.entity).subscribe_remove(this.remove_handler)
  }

  on_init (callback = isRequired()) {
    this.on_initiated_callbacks.push(callback)
    return this
  }

  on_initiated (initial_ids = isRequired()) {
    this.on_initiated_callbacks.forEach((func) => {
      func(this, initial_ids)
    })
    return this
  }

  on_fetch (callback = isRequired()) {
    this.on_fetched_callbacks.push(callback)
    return this
  }

  on_insert (callback = isRequired()) {
    this.before_insert_callbacks.push(callback)
    return this
  }

  before_insert (response = isRequired()) {
    this.before_insert_callbacks.forEach((func) => {
      func(response)
    })
  }

  on_fetched (initial_ids = isRequired()) {
    this.on_fetched_callbacks.forEach((func) => {
      func(this, initial_ids)
    })
    return this
  }

  on_failed (e = isRequired()) {
    this.on_fail_callbacks.forEach((func) => {
      func(this, e)
    })
  }

  fetch (state = isRequired()) {
    let operator = new FetchInstanceOperator(this)
    if (this._post) operator.post()
    operator.fetch(state)
  }

  post () {
    this._post = true
    return this
  }

  on_destroy (callback) {
    this.on_destroy_callbacks.push(callback)
    return this
  }

  on_destroyed () {
    this.on_destroy_callbacks.forEach((func) => func(this))
  }

  destroy (state = isRequired()) {
    new DestroyListOperator(this).destroy(state)
  }

  on_rows_remove (removed_ids = isRequired()) {
  }

  on_fail (callback = isRequired()) {
    this.on_fail_callbacks.push(callback)
    return this
  }

  push_id ($store = isRequired(), id = isRequired()) {
    new ModelSchemaLock([id], this.source.entity, this.lock_id).acquire($store)
    new ModelSchemaLock(this.ids, this.source.entity, this.lock_id).release($store)
    this.ids.splice(0, this.ids.length, id)
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

class FetchInstanceOperator {
  constructor (instance_data) {
    this.instance_data = instance_data
    this.source = instance_data.source
    this.func = ajax_get
  }

  post () {
    this.func = ajax_post
    return this
  }

  fetch ($store = isRequired()) {
    if (this.instance_data.is_fetching) return
    this.instance_data.is_fetching = true
    new ErrorMessage(this.instance_data.name).hide_error($store)
    this.func(this.source.url, this.instance_data.data)
      .then((response) => {
        this.instance_data.before_insert(response)
        console.log(response)
        let normalized = this.source.get_instance_data(response)
        this.instance_data.ids = normalized.result
        new ModelSchemaUpdater().insert_list($store, this.source.entity, normalized)
        new ModelSchemaLock(this.instance_data.ids, this.source.entity, this.instance_data.lock_id).acquire($store)
        let initiated = this.instance_data.initiated
        this.instance_data.initiated = true
        this.instance_data.is_fetching = false
        if (!initiated) {
          this.instance_data.on_initiated(normalized.result)
          this.instance_data.resolve_iniated && this.instance_data.resolve_iniated(normalized.result)
        }
        this.instance_data.on_fetched(normalized.result)
      })
      .catch((e) => {
        this.instance_data.is_fetching = false
        this.instance_data.on_failed(e)
        new ErrorDisplay(this.instance_data.name, $store).catch_error(e)
      })
  }
}

export {
  ServerInstanceData,
  FetchInstanceOperator,
}
