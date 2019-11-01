import Vue from 'vue'

export function yandex_plugin () {
  Object.defineProperty(Vue.prototype, '$yandex', {
    get () {
      this.$root.yandex = process.env.NODE_ENV === 'yandex'
      return this.$root.yandex
    },
    configurable: true
  })
}
