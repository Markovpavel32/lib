import {ActionStateOperator} from '../action_states/store'
import {isRequired} from '../vuex_method'
import {ModelSchemaDelete, ModelSchemaUpdater} from './store'
import {ajax_get, ajax_patch, ajax_post} from '../ajax'
import {normalize} from 'normalizr'
import {ErrorDisplay, ErrorMessage} from '../errors/store'

class AjaxOperator {
  constructor (location = isRequired(), uid = isRequired()) {
    this.location = location
    this.uid = uid
    this._before = [callbacks.hide_errors(this.uid)]
    this._on_success = []
    this._on_error = [callbacks.show_errors(this.uid)]
    this.func = ajax_post
    this._promise = new Promise((resolve, reject) => {
      this._resolve = resolve
      this._reject = reject
    })
    this.initiated = false
    this.config = {headers: {}}
  }

  execute ($store = isRequired(), data = isRequired()) {
    let $this = this
    callbacks.lock(this.uid)($store)
    $this._before.forEach((x) => { x($store, data, this) })
    this.func(this.location, data, this.config)
    .then((response) => {
      $this._on_success.forEach((x) => { x($store, response, data, this) })
      callbacks.release(this.uid)($store)
      this._resolve({$store, response, data})
      this.initiated = true
    }).catch((e) => {
      if (process.env.NODE_ENV !== 'production') console.log(e.stack)
      $this._on_error.forEach((x) => { x($store, e, this) })
        callbacks.release(this.uid)($store)
    })
    return this._promise
  }

  on_success (callback = isRequired()) {
    this._on_success.push(callback)
    return this
  }

  on_error (callback = isRequired()) {
    this._on_error.push(callback)
    return this
  }

  on_before (callback = isRequired()) {
    this._before.push(callback)
    return this
  }

  finally (callback = isRequired()) {
    this._on_success.push(callback)
    this._on_error.push(callback)
    return this
  }

  parse_errors (formEngine) {
    this.on_before(($store) => formEngine.hide_errors($store))
    return this.on_error(($store, e) => formEngine.parse_errors($store, e))
  }

  patch () {
    this.func = ajax_patch
    return this
  }

  get () {
    this.func = ajax_get
    return this
  }

  ajax () {
    this.config.headers['X-Requested-With'] = 'XMLHttpRequest'
    return this
  }
}

function add_related ($store, model_relation, id, related_id) {
  let values = ($store.rootState || $store.state).models[model_relation.from_entity][id]
  let field = model_relation.from_name
  let related = values[field] || []
  if (related.indexOf(related_id) < 0) {
    related = [...related]
    related.push(related_id)
    callbacks.change_instance(model_relation.from_model, {id: id, [field]: related})($store)
  }
}

function remove_related ($store, model_relation, id, related_id) {
  let values = ($store.rootState || $store.state).models[model_relation.from_entity][id]
  let field = model_relation.from_name
  let related = values[field] || []
  let index = related.indexOf(related_id)
  if (index >= 0) {
    related = [...related]
    related.splice(index, 1)
    callbacks.change_instance(model_relation.from_model, {id: id, [field]: related})($store)
  }
}

const callbacks = {
  update_instance (model = isRequired()) {
    return ($store, response, data) => {
      let normalized = normalize([response.data], [model.normalizr_entity])
      // console.log(normalized)
      new ModelSchemaUpdater().insert_list($store, model, normalized)
    }
  },
  update_multiple (model = isRequired()) {
    return ($store, response, data) => {
      let normalized = normalize(response.data.results || response.data, [model.normalizr_entity])
      new ModelSchemaUpdater().insert_list($store, model, normalized)
    }
  },
  change_instance (model = isRequired(), data = isRequired()) {
    return ($store) => {
      let normalized = normalize([data], [model.normalizr_entity])
      new ModelSchemaUpdater().insert_list($store, model, normalized)
    }
  },
  remove_instance (id = isRequired(), model = isRequired()) {
    return ($store, response, data) => {
      new ModelSchemaDelete([id], model).force().collect($store)
    }
  },
  add_related (relation = isRequired(), id = isRequired()) {
    return ($store, response, data) => {
      add_related($store, relation, id, response.data.id)
    }
  },
  remove_related (relation = isRequired(), id = isRequired(), related_id) {
    return ($store, response, data) => {
      remove_related($store, relation, id, related_id)
    }
  },
  to_detail (action_operator = isRequired()) {
    return ($store, response, data) => { action_operator.detail($store) }
  },
  hide_errors (uid = isRequired()) {
    return ($store, e) => {
      let error_message = new ErrorMessage(uid)
      error_message.hide_error($store)
    }
  },

  show_success (action_operator, timeout = 2000) {
    return ($store, response, data) => {
      action_operator.success($store)
      if (timeout) {
        setTimeout(() => {
          action_operator.normal($store)
        }, timeout)
      }
    }
  },
  show_errors (uid = isRequired(), any) {
    return ($store, e) => {
      new ErrorDisplay(uid, $store).show_object_error(any).catch_error(e)
    }
  },
  show_all_errors (uid = isRequired()) {
    return ($store, e) => {
    }
  },
  lock (uid) {
    return ($store, e) => {
      new ActionStateOperator(uid).pending($store)
    }
  },
  release (uid) {
    return ($store) => {
      new ActionStateOperator(uid).finally($store)
    }
  }
}

export {
  AjaxOperator,
  callbacks,
  add_related
}
