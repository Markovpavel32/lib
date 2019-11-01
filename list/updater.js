import {ModelSchemaSubscribe} from '../model_store/store'

class ListItemSubscriber {
  constructor (updater) {
    this.updater = updater
  }

  on_create (id, new_values) {
    if (this.updater.list.ids.indexOf(id) < 0) {
      this.updater.list.ids.push(id)
    }
  }
}

class ListItemsUpdater {
  constructor (list) {
    this.list = list
    this.subscriber = new ListItemSubscriber(this)
    new ModelSchemaSubscribe(this.list.source.entity).subscribe_create(this.subscriber)
  }

  destroy () {
    new ModelSchemaSubscribe(this.list.source.entity).unsubscribe(this.subscriber)
  }
}

export {
  ListItemsUpdater
}
