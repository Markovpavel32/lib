import {ActionStateMixin} from './store'

class ActionManager extends ActionStateMixin {
  constructor (state, uid) {
    super()
    this.state = state
    this.uid = uid
  }
}

export {
  ActionManager
}
