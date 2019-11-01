import {Callbacks} from './row_expander'

class ListRowIterator {
  constructor (list, row_checker) {
    this.list = list
    this.row_checker = row_checker
  }

  get cur_index () {
    return this.list.ids.findIndex((x) => this.row_checker.is_open(x))
  }

  set_next () {
    if (this.is_has_next) this.row_checker.open(this.list.ids[this.cur_index + 1])
  }

  set_prev () {
    if (this.is_has_prev) this.row_checker.open(this.list.ids[this.cur_index - 1])
  }

  get is_has_next () {
    return (this.cur_index >= 0 && this.cur_index + 1 < this.list.ids.length)
  }

  get is_has_prev () {
    return (this.cur_index > 0 && this.cur_index < this.list.ids.length)
  }
}

class IdListIterator {
  constructor (items) {
    this.items = items
    this.index = undefined
    this.is_first = true
    this.is_last = true
    this.on_change = new Callbacks(this)
  }

  set_by_value (value) {
    this.set_index(this.items.indexOf(value))
    return this
  }

  set_index (index) {
    let is_init = this.index === undefined
    let old
    if (!is_init) old = this.items[this.index]
    if (index >= 0 && index < this.items.length) {
      this.index = index
      this.is_last = index + 1 === this.items.length
      this.is_first = index === 0
      if (!is_init) this.on_change.emit(this.items[index], old)
    }
  }

  next () {
    if (!this.is_last) this.set_index(this.index + 1)
  }

  prev () {
    if (!this.is_first) this.set_index(this.index - 1)
  }
}
export {
  ListRowIterator,
  IdListIterator
}
