import {ModelSchemaDelete, ModelSchemaLock, ModelSchemaSubscribe} from '../model_store/store'
import {ErrorMessage} from '../errors/store'

class DestroyListOperator {
  constructor (server_list) {
    this.source = server_list.source
    this.server_list = server_list
  }

  destroy ($store) {
    if (this.server_list.is_fetching) return
    this.server_list.is_fetching = true
    new ErrorMessage(this.server_list.name).hide_error($store)
    new ModelSchemaLock(this.server_list.ids, this.source.entity, this.server_list.lock_id).release($store)
    new ModelSchemaDelete(this.server_list.ids, this.source.entity).collect($store)
    this.server_list.ids.splice(0, this.server_list.ids.length)
    this.server_list.is_fetching = false
    new ModelSchemaSubscribe(this.source.entity).unsubscribe(this.server_list.remove_handler)
    this.server_list.on_destroyed()
  }
}

export {
  DestroyListOperator
}
