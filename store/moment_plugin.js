import Vue from 'vue'
import moment from 'moment'
const vue_moment = require('vue-moment')

function moment_plugin () {
  moment.locale('ru')
  Vue.use(vue_moment)
}

export {
  moment_plugin
}
