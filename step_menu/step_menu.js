import * as Vue from 'vue'
import {isRequired} from '../vuex_method'

class StepMenuData {
  constructor (routes = isRequired(), $router = isRequired()) {
    this.routes = routes
    this.$router = $router
  }

  update (route_id = isRequired(), route_name = isRequired(), allowed_route_id = isRequired()) {
    for (let i = 1; i < this.routes.length; i++) {
      Vue.set(this.routes[i], 'css', 'disabled')
    }
    if (route_id < 0) return
    for (let i = 0; i <= allowed_route_id; i++) {
      Vue.set(this.routes[i], 'css', '')
    }
    const route_to_id = this.routes.findIndex(({name}) => name === route_name)
    if (route_to_id >= 0) Vue.set(this.routes[route_to_id], 'css', 'btn-primary')
  }
}

export {
  StepMenuData
}
