class TreeNodeConf {
  constructor () {
    this.checkbox = false
    this.selected = []
    this._on_checked_callbacks = []
    this._on_unchecked_callbacks = []
  }

  use_selected (selected) {
    this.checkbox = true
    this.selected = selected
    return this
  }

  get node_unchecked_callback () {
    return (node) => this.node_unchecked(node)
  }

  node_unchecked (node) {
    this._on_unchecked_callbacks.forEach((x) => x(node, this.server_instance))
  }

  get node_checked_callback () {
    return (node) => this.node_checked(node)
  }

  node_checked (node) {
    this._on_checked_callbacks.forEach((x) => x(node, this.server_instance))
  }

  on_checked (callback) {
    this._on_checked_callbacks.push(callback)
    return this
  }

  on_unchecked (callback) {
    this._on_unchecked_callbacks.push(callback)
    return this
  }
}

export {
  TreeNodeConf
}
