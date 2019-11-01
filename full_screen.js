import {ModuleSchema} from './vuex_module'
import {isRequired, vuex_mutation} from './vuex_method'

let full_screen_schema = new ModuleSchema('full_screen', {
  namespaced: true,
  mutations: {
  },
  state: {
    is_full: false,
    uid: undefined,
    callback: undefined
  }
})

let escape_full_screen = null

class FullScreen {
  static enable_full_screen (state = isRequired(), uid = isRequired(), callback) {
    FullScreen._enable_full_screen(state, uid, callback)
    window.$(document).off('keyup', escape_full_screen)
    escape_full_screen = (event) => {
      if (event.keyCode === 27) this.disable_full_screen(state)
    }
    window.$(document).on('keyup', escape_full_screen)
  }

  @vuex_mutation(full_screen_schema)
  static _enable_full_screen (state = isRequired(), uid = isRequired(), callback) {
    state.is_full = true
    state.uid = uid
    state.callback = callback
    window.$('body').addClass('shp-hide-overflow')
  }

  @vuex_mutation(full_screen_schema)
  static disable_full_screen (state) {
    FullScreen._disable_full_screen(state)
  }

  static _disable_full_screen (state) {
    window.$(document).off('keyup', escape_full_screen)
    state.is_full = false
    state.uid = undefined
    window.$('body').removeClass('shp-hide-overflow')
    if (state.callback) {
      state.callback()
      state.callback = undefined
    }
  }

  static toggle_full_screen ($store = isRequired()) {
    if ($store.state.full_screen.is_full) FullScreen.disable_full_screen($store); else FullScreen.enable_full_screen($store)
  }

  static is_full ($store) {
    return $store.state.full_screen.is_full
  }
}

export {
  FullScreen,
  full_screen_schema
}
