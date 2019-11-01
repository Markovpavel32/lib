import Vue from 'vue'
import {MoneyFilter} from '../../plugins/filters'

function shp_money_plugin () {
  Vue.use(MoneyFilter)
}

export {
  shp_money_plugin
}
