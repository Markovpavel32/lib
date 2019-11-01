import axios from 'axios'
import qs from 'qs'
import {AjaxDisabledError} from './exceptions'
require('es6-promise').polyfill()

if (process.env.EDUAPP_HOST) {
  axios.defaults.baseURL = process.env.EDUAPP_HOST
}

function get_csrfmiddlewaretoken () {
  let _input = document.querySelector('[name=csrfmiddlewaretoken]')
  return _input && _input.value
}

function ajax_disabled () {
  throw new AjaxDisabledError('Ajax недоступен в тестах')
}

function disable_ajax (sinon_sandbox) {
  sinon_sandbox.stub(axios, 'get').returns(ajax_disabled)
  sinon_sandbox.stub(axios, 'post').returns(ajax_disabled)
}

function ajax_post (url, data, config) {
  data = data || {}
  let options = data.options
  let newData = {}
  if (process.env.NODE_ENV !== 'test') {
    let token = get_csrfmiddlewaretoken()
    // eslint-disable-next-line no-undef
    if (data instanceof FormData) {
      data.append('csrfmiddlewaretoken', token)
     } else {
      data['csrfmiddlewaretoken'] = token
      for (let key in data) {
        if (key !== 'options') newData[key] = data[key]
      }
      data = qs.stringify({...(newData || {})}, options)
    }
  }
  return axios.post(url, data, config)
}

function ajax_patch (url, data, config) {
  data = data || {}
  let token = ''
  if (process.env.NODE_ENV !== 'test') {
    token = get_csrfmiddlewaretoken()
    // eslint-disable-next-line no-undef
    if (!(data instanceof FormData)) data = qs.stringify({...(data || {})})
  }
  config = config || {headers: {}}
  config['headers']['X-CSRFToken'] = token
  return axios.patch(url, data, config)
}

function ajax_get (url, data, config) {
  // if (process.env.NODE_ENV !== 'testing') {
  //   throw new AjaxDisabledError('Ajax недоступен в тестах')
  // }
  let token = get_csrfmiddlewaretoken()
  data = data || {}
  data['csrfmiddlewaretoken'] = token
  config = config || {}
  config = {
    ...config,
    params: data,
    paramsSerializer: function (params) {
       return qs.stringify(params, {arrayFormat: 'repeat'})
    },
  }
  return axios.get(url, config)
}

function get_form_data (object) {
  let result = new window.FormData()
  for (let key in object) {
    if (object.hasOwnProperty(key) && object[key] !== null) result.append(key, object[key])
  }
  return result
}

export {
  ajax_get,
  ajax_post,
  ajax_patch,
  disable_ajax,
  get_form_data,
}
