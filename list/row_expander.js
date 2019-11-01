import Vue from 'vue'

class Callbacks {
  constructor (parent) {
    this.events = []
    this.parent = parent
  }

  push (callback) {
    this.events.push(callback)
    return this.parent
  }

  remove (callback) {
    let index = this.events.indexOf(callback)
    if (index >= 0) this.events.splice(index, 1)
  }
  emit (...args) {
    this.events.forEach((x) => x(...args))
  }
}

class CheckedRows {
  constructor (name) {
    this.name = name
    this.is_single = false
    this.is_opened = false
    this.opened = this.get_opened()
    Vue.set(this, 'opened', this.opened)
    this._in_memory = false
    this.update_is_opened()
    this.possible_getter = undefined
    this.on_open = new Callbacks(this)
    this.on_close = new Callbacks(this)
    this._default = undefined
  }

  single () {
    this.is_single = true
    return this
  }

  in_memory () {
    this._in_memory = true
    return this
  }

  get_opened () {
    let stored = window.sessionStorage.getItem(`RowExpander:${this.name}:ids5`)
    if (stored) stored = JSON.parse(stored)
    else if (this._default) stored = {[String(this._default)]: 1}
    else stored = {}
    if (this.is_single && stored.length > 1) stored = {[stored.keys[0]]: 1}
    return stored
  }

  get_opened_ids () {
    return Object.keys(this.get_opened()) || []
  }

  get_opened_id () {
    let keys = Object.keys(this.opened)
    return keys[0]
  }

  by_default (default_value) {
    this._default = default_value
    this.opened = this.get_opened()
    return this
  }
  save () {
    this.update_is_opened()
    if (!this._in_memory) {
      window.sessionStorage.setItem(`RowExpander:${this.name}:ids5`, JSON.stringify(this.opened))
    }
  }

  open (id) {
    id = String(id)
    if (this.is_single) Vue.set(this, 'opened', {[id]: 1}); else Vue.set(this.opened, id, 1)
    this.on_open.emit(id)
    this.save()
  }

  close (id) {
    id = String(id)
    if (this.opened.hasOwnProperty(id)) Vue.delete(this.opened, id)
    this.on_close.emit(id)
    this.save()
  }

  is_open (id) {
    id = String(id)
    return id && this.opened[id]
  }

  close_multiple (removed_ids) {
    removed_ids.forEach((id) => {
      id = String(id)
      if (this.opened.hasOwnProperty(id)) Vue.delete(this.opened, id)
    })
    this.save()
  }

  close_other (ids) {
    let string_ids = ids.map((x) => String(x))
    for (let key in this.opened) {
      if (string_ids.indexOf(String(key)) === -1 && this.opened.hasOwnProperty(key)) delete this.opened[key]
    }
    this.update_is_opened()
  }

  clear_on_page_change (list) {
    list.on_row_remove_callbacks.push((list, removed_ids) => this.close_multiple(removed_ids))
    list.on_initiated_callbacks.push((list, new_ids) => this.close_other(new_ids))
    this.update_is_opened()
    return this
  }

  update_is_opened () {
    /* eslint-disable no-unused-vars */
    for (let i in this.opened) {
      this.is_opened = true
      return
    }
    this.is_opened = false
  }

  toggle (id) {
    if (!this.is_open(String(id))) this.open(id); else this.close(id)
  }

  use_possible (possible_getter) {
    this.possible_getter = possible_getter
    return this
  }

  get is_all_selected () {
    if (!this.possible_getter) return false
    let possible = this.possible_getter()
    return possible.length > 0 && possible.length === Object.keys(this.opened).length
  }

  select_all () {
    this.possible_getter().forEach((x) => {
      Vue.set(this.opened, x, 1)
    })
    this.save()
    return this
  }

  deselect_all () {
    Vue.set(this, 'opened', {})
    this.update_is_opened()
    this.save()
    return this
  }

  next () {
    if (!this.is_single || !this.possible_getter) return
    let possible = this.possible_getter()
    let current_index = possible.findIndex((x) => this.is_open(x))
    if (current_index >= 0 && current_index + 1 < possible.length) {
      this.open(possible[current_index + 1])
    }
  }

  prev () {
    if (!this.is_single || !this.possible_getter) return
    let possible = this.possible_getter()
    let current_index = possible.findIndex((x) => this.is_open(x))
    if (current_index > 0) {
      this.open(possible[current_index - 1])
    }
  }
}

export {
  Callbacks,
  CheckedRows
}
