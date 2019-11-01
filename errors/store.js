import {ModuleSchema} from '../vuex_module'
import Vue from 'vue'
import {vuex_mutation} from '../vuex_method'

let store = {
  namespaced: true,
  state () {
    return {
      messages: {

      }
    }
  },
  mutations: {}
}

let error_message_schema = new ModuleSchema('errors', store)

class ErrorMessage {
  constructor (uid) {
    this.uid = uid
  }

  @vuex_mutation(error_message_schema)
  init_error (state) {
    // Vue.set(state.messages, this.uid, '')
  }

  @vuex_mutation(error_message_schema)
  show_error (state, message) {
      Vue.set(state.messages, this.uid, message)
  }

  @vuex_mutation(error_message_schema)
  hide_error (state) {
    if (state.messages[this.uid] !== undefined) Vue.set(state.messages, this.uid, '')
  }
}

class ErrorDisplay {
  constructor (uid, state) {
    this.uid = uid
    this.state = state
    this._show_object_error = false
  }

  catch_error (e) {
    let message = this.get_error(e)
    new ErrorMessage(this.uid).show_error(this.state, message)
  }

  get_error (e) {
    let message = ''
    if (process.env.NODE_ENV !== 'production') {
      if (typeof e.stack.indexOf('TypeError') >= 0 || process.env.NODE_ENV === 'test') throw e
      console.log(e)
    }
    if (!e.response) {
      if (e.message === 'Network Error') {
        message = `Сервер недоступен, попробуйте повторить операцию`
      } else if (e.message) {
        message = e.message
      } else {
      message = e
      }
    } else if (e.response.status === 500) {
      message = `Произошла ошибка сервера, администраторы уже в курсе`
    } else if (e.response.status === 502 || e.response.status === 503) {
      message = `${e.response.status} Сервер временно недоступен, попробуйте позже`
    } else if (e.response.status >= 404) {
      message = `${e.response.status} Страница не найдена`
    } else if (e.response.status >= 403) {
      message = `${e.response.status} Недостаточно прав`
    } else if (e.response.status >= 400) {
      if (e.response.data && e.response.data.length) {
        message = e.response.data[0]
      } else if (e.response.data.detail) {
        message = e.response.data.detail
      } else {
        if (e.response.status !== 400) message = `${e.response.status} ${e.response.statusText}`
        else if (this._show_object_error && typeof e.response.data === 'object') {
          for (let prop in e.response.data) {
            message = e.response.data[prop]
            break
          }
        }
      }
    } else if (e.response && e.response.data) {
      message = e.response.data[0]
    } else if (e.message) {
      message = e.message
    } else {
      message = e
    }
    return message
  }

  show_object_error (value = false) {
    this._show_object_error = value
    return this
  }
}
export {
  ErrorMessage,
  ErrorDisplay,
  error_message_schema,
}
