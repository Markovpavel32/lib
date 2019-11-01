import {IndexdbCache} from '../db/indexdb_cache'

function api_cache_plugin () {
  let last_version = window.localStorage.getItem('VERSION')
  let current_version = String(process.env.VERSION)
  window.localStorage.setItem('VERSION', current_version)
  if (last_version !== current_version) new IndexdbCache().clear()
}

export {
  api_cache_plugin
}
