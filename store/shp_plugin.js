import Vue from 'vue'
import * as uiv from 'uiv'
import VueFormGenerator from 'vue-form-generator'
import fieldDatePicker from '../fields/fieldDatePicker.vue'
import {DjangoUrlsPlugin} from '../django_urls/urls'
import {moment_plugin} from '../store/moment_plugin'
import {gettext_plugin} from '../store/gettext_plugin'
import VueCroppie from 'vue-croppie'
import 'croppie/croppie.css'
import {scroll_to_plugin} from './scroll_to_plugin'
import {yandex_plugin} from './yandex_plugin'
import {api_cache_plugin} from './api_cache_plugin'
import * as Sentry from '@sentry/browser'
import {Vue as VueIntegration} from '@sentry/integrations/dist/vue'

function uiv_plugin () {
  Vue.use(uiv)
}

function vue_form_generator_plugin () {
  Vue.component('fieldDatePicker', fieldDatePicker)
  Vue.use(VueFormGenerator)
}

function vue_croppie_plugin () {
  Vue.use(VueCroppie)
}

function sentry_plugin (only_production) {
  let is_prod = process.env.NODE_ENV === 'production' && window.location.host.includes('informatics')
  if (only_production && !is_prod) return
  Sentry.init({
    dsn: 'https://4b4b54c3b2114dbf8b68d81b93bc9979@sentry.informatics.ru/5',
    integrations: [new VueIntegration({Vue, attachProps: true})],
  })
}

function shp_store_plugin () {
  gettext_plugin()
  moment_plugin()
  uiv_plugin()
  vue_form_generator_plugin()
  yandex_plugin()
  api_cache_plugin()
  Vue.use(DjangoUrlsPlugin)
  vue_croppie_plugin()
  yandex_plugin()
  scroll_to_plugin()
  sentry_plugin(true)
}

export {
  shp_store_plugin
}
