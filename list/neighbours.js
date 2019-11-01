import {cached_property} from '../helpers'

class Neighbours {
  constructor (iterable, current_id) {
    this.current_id = current_id
    this.iterable = iterable
    this.index = this.iterable.indexOf(current_id)
    this._wrapper = (x) => x
  }

  wrap (wrapper) {
    this._wrapper = wrapper
    return this
  }

  @cached_property
  get next () {
    if (this.index < this.iterable.length - 1) return this._wrapper(this.iterable[this.index + 1])
  }

  @cached_property
  get prev () {
    if (this.index > 0) return this._wrapper(this.iterable[this.index - 1])
  }

  @cached_property
  get item () {
    return this._wrapper(this.iterable[this.index])
  }
}

export {
  Neighbours
}
