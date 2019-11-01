import {cached_property} from '../helpers'

class MenuItem {
  constructor (title, name) {
    this.title = title
    this.name = name
    this.children = []
    this.router_params = []
    this.names_map = {}
    this.parent = null
    this.depth = 0
    this.is_hidden = false
  }

  add_children (children) {
    children.forEach((x) => {
      x.parent = this
      this.children.push(x)
    })
    return this
  }

  use_params (params) {
    this.router_params = [...this.router_params, ...params]
    return this
  }

  init () {
    this._init(this)
    return this
  }

  _init (node) {
    if (node.parent) node.depth = node.parent.depth + 1
    if (!this.names_map.hasOwnProperty(node.name)) this.names_map[node.name] = node
    node.children.forEach((x) => this._init(x))
 }

 get_from_root (depth) {
    let result = this
    while (result.depth > depth) {
      result = result.parent
    }
    return result
 }

 hide () {
  this.is_hidden = true
  return this
 }
}

class RoutedMenu {
  constructor (menu, $router) {
    this.menu = menu
    this.$router = $router
    this.is_active = $router.currentRoute && Boolean($router.currentRoute.matched
      .find((x) => x.name === menu.name || (x.meta && x.meta.name === menu.name)))
  }

  @cached_property
  get children () {
    let children = this.menu.children.map((x) => new RoutedMenu(x, this.$router))
    children = children.filter((x) => x.is_correct)
    return children
  }

  @cached_property
  get is_correct () {
    let is_correct = true
    this.menu.router_params.forEach((x) => {
      is_correct &= this.$router.currentRoute.params.hasOwnProperty(x)
    })
    return is_correct
  }
}

export {
  RoutedMenu,
  MenuItem
}
