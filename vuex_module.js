import Vue from 'vue'
import Vuex from 'vuex'
import {isRequired} from './vuex_method'

class ModuleSchema {
  constructor (module_name, module) {
    this.module_name = module_name
    this.module_data = module
    this.module = module
    this.getters = module.getters || {}
    this.mutation_callbacks = []
    this.action_callbacks = []
    this._on_register = []
  }

  on_new_mutation (callback) {
    this.mutation_callbacks.push(callback)
    return this
  }

  new_mutation (mutation_name = isRequired(), func = isRequired()) {
    this.mutation_callbacks.forEach((callback) => callback(mutation_name, func))
  }

  on_new_action (callback) {
    this.action_callbacks.push(callback)
    return this
  }

  new_action (action_name = isRequired(), func = isRequired()) {
    this.action_callbacks.forEach((callback) => callback(action_name, func))
  }

  register_module (store) {
    store.registerModule(this.module_name, this.module_data)
    this._on_register.forEach((x) => { x(store) })
  }

  get mutations () {
    return this.module.mutations
  }

  get actions () {
    return this.module.actions
  }

  from_state (key) {
    let that = this
    return function (component) {
      return component.$store.state[that.module_name][key]
    }
  }

  on_register (callback) {
    this._on_register.push(callback)
    return this
  }
}

function isPromise (val) {
  return val && typeof val.then === 'function'
}

class StoreFabric {
  constructor () {
    this.modules = []
    this.plugins = [() => { Vue.use(Vuex) }]
    this._is_debug = process.env.NODE_ENV !== 'production'
    this.stores = []
  }

  create () {
    this.plugins.forEach((x) => x())
    let store = new Vuex.Store({
      state: {},
      strict: this._is_debug
    })
    if (this._is_debug) {
      Vue.config.devtools = true
      Vue.config.debug = true
      Vue.config.silent = false
    } else {
      Vue.config.devtools = false
      Vue.config.debug = false
      Vue.config.silent = true
    }
    return this.initialize(store)
  }

  initialize (store) {
    if (store === undefined) return this.create()
    this.stores.push(store)
    this.modules.forEach((x) => {
      if (!store._modules.root._children || !store._modules.root._children[x.module_name]) x.register_module(store)
    })
    this.modules.forEach((x) => {
      x.on_new_mutation((mutation_name = isRequired(), mutation = isRequired()) => {
        store._mutations[x.module_name + '/' + mutation_name] = [(payload) => {
          mutation.call(store, store.state[x.module_name], payload)
        }]
      })
    })
    this.modules.forEach((x) => {
      x.on_new_action((action_name = isRequired(), action = isRequired()) => {
        store._actions[action_name] = [(payload, cb) => {
          let local = store._modules.root._children[x.module_name]
          let res = action.call(store, {
              dispatch: local.context.dispatch,
              commit: local.context.commit,
              getters: local.context.getters,
              state: local.state,
              rootGetters: store.getters,
              rootState: store.state
          }, payload, cb)
          if (!isPromise(res)) res = Promise.resolve(res)
          if (store._devtoolHook) {
            return res.catch(function (err) {
              store._devtoolHook.emit('vuex:error', err)
              throw err
            })
          } else {
            return res
          }
        }]
      })
    })
    return store
  }

  destroy (store) {
    store && this.modules.forEach((x) => store.unregisterModule(x.module_name))
  }

  use_modules (modules) {
    modules.forEach((x) => this.modules.push(x))
    return this
  }

  use_plugins (plugins) {
    plugins.forEach((x) => this.plugins.push(x))
    return this
  }
}

export {
  ModuleSchema,
  StoreFabric
}
