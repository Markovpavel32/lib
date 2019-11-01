import {isRequired} from '../vuex_method'

const indexedDB = window.indexedDB
const storeName = 'models'

let last_operation = null

class IndexdbCache {
  connect () {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('cached', 1)
      request.onerror = (event) => reject(event)
      request.onsuccess = () => resolve(request.result)
      request.onupgradeneeded = async (e) => {
        await this.wait_transaction(e.currentTarget.result.createObjectStore(storeName, {keyPath: 'key'}))
        resolve(e.currentTarget.result)
      }
    })
  }

  async wait_last_operation () {
    if (!last_operation) return
    try {
      await last_operation
    } finally {
      last_operation = null
    }
  }

  wait_transaction (request = isRequired()) {
    return new Promise((resolve, reject) => {
      request.onerror = reject
      request.onsuccess = () => {
        resolve(request.result)
      }
    })
  }

  async get_data (key = isRequired()) {
    if (!indexedDB) return
    await this.wait_last_operation()
    let promise = this._get_data(key)
    last_operation = promise
    return promise
  }

  async _get_data (key = isRequired()) {
    let db = await this.connect()
    const request = db.transaction([storeName], 'readonly').objectStore(storeName).get(key)
    let result = await this.wait_transaction(request)
    if (!result) return null
    if (result.expires_at < new Date().getTime()) return null
    return result.data
  }

  async set_data (key = isRequired(), data = isRequired(), expiration = isRequired()) {
    if (!indexedDB) return
    await this.wait_last_operation()
    let promise = this._set_data(key, data, expiration)
    last_operation = promise
    return promise
  }

  async _set_data (key = isRequired(), data = isRequired(), expiration = isRequired()) {
    let db = await this.connect()
    const obj = {
      key: key,
      expires_at: new Date().getTime() + Number(expiration),
      data: data
    }
    const request = db.transaction([storeName], 'readwrite').objectStore(storeName).put(obj)
    await this.wait_transaction(request)
  }

  clear () {
    if (!indexedDB) return
    last_operation = new Promise(async (resolve, reject) => {
      try {
        let db = await this.connect()
        const request = db.transaction([storeName], 'readwrite').objectStore(storeName).clear()
        await this.wait_transaction(request)
        resolve()
      } catch (e) {
        reject(e)
      }
    })
  }
}

export {
  IndexdbCache
}
