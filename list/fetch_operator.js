import {ActionStateOperator} from '../action_states/store'
import {ErrorDisplay, ErrorMessage} from '../errors/store'
import {ajax_get} from '../ajax'
import lodash_difference from 'lodash/difference'
import {ModelSchemaDelete, ModelSchemaLock, ModelSchemaUpdater} from '../model_store/store'

class ServerListDataParser {
  constructor (server_list, normalized) {
    this.server_list = server_list
    this.normalized = normalized
  }

  parse (response_data) {
    this.server_list.paginator.parse(response_data)
    this.server_list.ids = this.normalized.result
  }
}

class FetchListOperator {
  constructor (server_list) {
    this.source = server_list.source
    this.server_list = server_list
  }

  get_list ($store) {
    if (this.server_list.is_fetching) return
    this.server_list.is_fetching = true
    new ActionStateOperator(this.server_list.name).pending($store)
    new ErrorMessage(this.server_list.name).hide_error($store)
    let query = this.server_list.get_query($store)
    ajax_get(this.source.url, query)
      .then((response) => {
        let normalized = this.source.get_model_data(response)
        let old_ids = lodash_difference(this.server_list.ids, normalized.result)
        this._remove_ids($store, old_ids)
        new ModelSchemaUpdater().insert_list($store, this.source.entity, normalized)
        new ServerListDataParser(this.server_list, normalized).parse(response.data)
        new ModelSchemaLock(this.server_list.ids, this.source.entity, this.server_list.lock_id).acquire($store)
        this.server_list.paginator.change_page()
        this.server_list.on_fetched(normalized.result, normalized)
        this.server_list.is_fetching = false
        let is_initiated = this.server_list.initiated
        this.server_list.initiated = true
        new ActionStateOperator(this.server_list.name).finally($store)
        if (!is_initiated) {
          this.server_list.on_initiated(normalized.result)
          this.server_list.resolve_iniated && this.server_list.resolve_iniated(normalized.result)
        }
        this.server_list.fetch_count += 1
      })
      .catch((e) => {
        this.server_list.is_fetching = false
        this.server_list.paginator.rollback_page()
        if (e.response && e.response.status === 404 && e.response.data && e.response.data.detail && !this.server_list.paginator.is_initial()) {
          this.server_list.set_page($store, 1)
        } else {
          new ErrorDisplay(this.server_list.name, $store).catch_error(e)
        }
        this.server_list.fetch_count += 1
      })
  }

  _remove_ids ($store, old_ids) {
    if (old_ids.length) {
      new ModelSchemaLock(old_ids, this.source.entity, this.server_list.lock_id).release($store)
      new ModelSchemaDelete(old_ids, this.source.entity).collect($store)
    }
  }

  remove_ids ($store, old_ids) {
    this._remove_ids($store, old_ids)
    this.server_list.ids = lodash_difference(this.server_list.ids, old_ids)
  }
}

export {
  FetchListOperator
}
