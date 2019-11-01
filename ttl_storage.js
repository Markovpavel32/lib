let session_storage_ttl = {
  set: function (key, ttl, value) {
    /* eslint-disable no-undef */
    sessionStorage.setItem(`ttl:${key}:value`, value)
    /* eslint-disable no-undef */
    sessionStorage.setItem(`ttl:${key}:ttl`, new Date().getTime() + ttl * 1000)
  },
  get: function (key) {
    /* eslint-disable no-undef */
    let value = sessionStorage.getItem(`ttl:${key}:value`)
    /* eslint-disable no-undef */
    let ttl = sessionStorage.getItem(`ttl:${key}:ttl`)
    if (!ttl || value === undefined || parseInt(ttl) < new Date().getTime()) return undefined
    return value
  },
  remove: function (key) {
    sessionStorage.removeItem(`ttl:${key}:value`)
    /* eslint-disable no-undef */
    sessionStorage.removeItem(`ttl:${key}:ttl`)
  }

}

export {
  session_storage_ttl,
}
