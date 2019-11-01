import Vue from 'vue'
import lodash_forOwn from 'lodash/forOwn'
import lodash_each from 'lodash/each'
import lodash_difference from 'lodash/difference'
import {ModuleSchema} from '../vuex_module'
import {isRequired, vuex_mutation} from '../vuex_method'

let model_store = {
  namespaced: true,
  actions: {},
  mutations: {},
  state: {
  }
}

let model_schema = new ModuleSchema('models', model_store)
let model_references = {}

class ModelSchemaUpdater {
  @vuex_mutation(model_schema)
  insert (state, entities_schema, normalized) {
    this._insert_list(state, entities_schema, {entities: {[entities_schema.key]: {[normalized.result.id]: normalized.result}}})
  }

  @vuex_mutation(model_schema)
  insert_list (state, entities_schema, normalized) {
    this._insert_list(state, entities_schema, normalized)
  }

  _insert_list (state, entities_schema, normalized) {
    for (let model_name in entities_schema.schemas) {
      if (!state[model_name]) {
        Vue.set(state, model_name, {})
       }
    }
    lodash_forOwn(normalized.entities, (items, model_name) => {
       let model_store = state[model_name]
       let current_schema = entities_schema.schemas[model_name]
       lodash_forOwn(items, (instance, key) => {
         key = instance[current_schema.normalizr_entity.idAttribute]
         if (model_store[key]) {
           this.update_references(state, current_schema, key, instance, model_store[key])
           model_store[key] = {...model_store[key], ...instance}
           let cur_subscribers = update_subscribers[current_schema.key]
            cur_subscribers && cur_subscribers.forEach((x) => {
              x.on_update && x.on_update(key, instance, model_store[key])
           })
         } else {
           this.update_references(state, current_schema, key, instance, {})
           Vue.set(model_store, key, instance)
           let cur_subscribers = create_subscribers[current_schema.key]
            cur_subscribers && cur_subscribers.forEach((x) => {
              x.on_create && x.on_create(key, instance)
           })
         }
       })
     })
    // console.log(model_references)
    return normalized
  }

  update_references (state, schema, pk, values, old_values) {
    lodash_forOwn(schema.relations, (relation, relation_name) => {
      let related_key = relation.entity.key
      if (values[relation_name] === undefined) return
      if (!model_references[related_key]) model_references[related_key] = {}
      let [new_ids, old_ids] = get_relation_changes_ids(relation, values[relation_name], old_values[relation_name])
      new_ids.forEach((related_id) => {
        if (!model_references[related_key][related_id]) model_references[related_key][related_id] = new Map()
        model_references[related_key][related_id].set(`${schema.key}-${relation_name}-${pk}`, relation)
      })
      old_ids.forEach((related_id) => {
        model_references[related_key][related_id].delete(`${schema.key}-${relation_name}-${pk}`)
        if (relation.on_delete === 'remove' || (relation.on_delete === 'check_relations' && model_references[relation.entity.key][related_id] &&
            model_references[relation.entity.key][related_id].size === 0)) {
          new ModelSchemaDelete([related_id], relation.entity)._collect(state, relation.entity, related_id)
          }
      })
    })
  }
}

class ModelSchemaLock {
  constructor (ids, entity, lock_key) {
    this.ids = ids
    this.entity = entity
    this.lock_key = lock_key
  }

  acquire ($store) {
    if (!model_references[this.entity.key]) model_references[this.entity.key] = {}
    let references = model_references[this.entity.key]
    lodash_each(this.ids.slice(), (id) => {
      if (!references[id]) references[id] = new Map()
       references[id].set(this.lock_key, {on_delete: 'protect'})
    })
  }

  release ($store) {
    let references = model_references[this.entity.key]
    references && lodash_each(this.ids.slice(), (id) => {
      if (references[id] !== undefined) references[id].delete(this.lock_key)
    })
  }
}

let _uid = 0
function get_lock_uid () {
  _uid += 1
  return _uid
}

function get_relation_changes_ids (relation, new_values, old_values) {
  let new_ids = []
  if (new_values) {
    if (relation.is_multiple && new_values) new_ids = new_values; else new_ids = [new_values]
  }
  let old_ids = []
  if (old_values) {
    if (relation.is_multiple && old_values) old_ids = old_values; else old_ids = [old_values]
  }
  if (old_ids.length) {
    return [lodash_difference(new_ids, old_ids), lodash_difference(old_ids, new_ids)]
  } else {
    return [new_ids, old_ids]
  }
}

class ModelSchemaDelete {
  constructor (ids, entity) {
    this.ids = ids
    this.entity = entity
    this._force = false
  }

  @vuex_mutation(model_schema)
  collect (state) {
    lodash_each(this.ids.slice(), (id) => {
      this._collect(state, this.entity, id)
    })
  }

  _collect (state, entities_schema, id) {
    let entity_key = entities_schema.key
    let references = model_references[entity_key]
    if ((this._force && !(entity_key === this.entity.key && this.ids.indexOf(id) >= 0)) ||
        (!this._force && references && references[id] && references[id].size > 0)) return
    if (references && references[id] && references[id].size > 0) {
      let references_array = Array.from(references[id].entries())
      references[id].clear()
      references_array.forEach((pair) => {
        let relation = pair[1]
        let key = pair[0]
        let parts = key.split('-')
        if (!(parts.length === 3)) return
        let from_id = parseInt(parts[2])
        if (!state[relation.from_entity] || !state[relation.from_entity][from_id]) return
        let related_instance = state[relation.from_entity][from_id]
        if (relation.is_multiple) {
          if (related_instance[relation.from_name]) {
            let index = related_instance[relation.from_name].indexOf(id)
            if (index >= 0) related_instance[relation.from_name].splice(index, 1)
          }
        } else if (relation.reverse_remove === 'remove') this._collect(state, relation.entity, from_id)
        else related_instance[relation.from_name] = undefined
      })
    }
    lodash_forOwn(entities_schema.relations, (relation, relation_name) => {
      let entity_data = state[entity_key][id]
      if (!entity_data) return
      let ids = entity_data[relation_name]
      if (!relation.is_multiple) ids = [ids]
      ids && ids.forEach((related_id) => {
        if (model_references[relation.entity.key] && model_references[relation.entity.key][related_id]) {
          model_references[relation.entity.key][related_id].delete(`${entities_schema.key}-${relation_name}-${id}`)
          if (relation.on_delete === 'remove' || (relation.on_delete === 'check_relations' && !model_references[relation.entity.key][related_id].length)) {
            this._collect(state, relation.entity, related_id)
          }
        }
      })
    })
    let cur_subscribers = remove_subscribers[entity_key]
    cur_subscribers && cur_subscribers.forEach((x) => {
      x.on_delete && x.on_delete(id)
    })
    if (references && references[id]) delete references[id]
    Vue.delete(state[entity_key], id)
  }

  force () {
    this._force = true
    return this
  }
}

let update_subscribers = {}
let create_subscribers = {}
let remove_subscribers = {}
let subscribers_uid = 0

class ModelSchemaSubscribe {
  constructor (entity) {
    this.entity = entity
  }

  subscribe_update (subscriber) {
    this.subscribe(update_subscribers, subscriber)
    subscriber._is_update = true
  }

  subscribe_create (subscriber) {
    this.subscribe(create_subscribers, subscriber)
    subscriber._is_create = true
  }

  subscribe_create_update (subscriber) {
    this.subscribe(create_subscribers, subscriber)
    this.subscribe(update_subscribers, subscriber)
  }

  subscribe_remove (subscriber) {
    this.subscribe(remove_subscribers, subscriber)
    subscriber._is_remove = true
  }

  subscribe (holder, subscriber) {
    subscriber.uid = ++subscribers_uid
    if (!holder[this.entity.key]) {
      holder[this.entity.key] = []
    }
    holder[this.entity.key].push(subscriber)
  }

  unsubscribe (subscriber) {
    subscriber._is_create && this._unsubscribe(create_subscribers, subscriber)
    subscriber._is_update && this._unsubscribe(update_subscribers, subscriber)
    subscriber._is_remove && this._unsubscribe(remove_subscribers, subscriber)
  }

  _unsubscribe (holder, subscriber) {
    if (holder[this.entity.key]) {
      let index = holder[this.entity.key].findIndex((x) => x.uid === subscriber.uid)
      if (index >= 0) holder[this.entity.key].splice(index, 1)
    }
  }
}

class ModelModifier {
  constructor (model = isRequired(), id = isRequired()) {
    this.model = model
    this.id = id
    this._modifiers = []
  }

  modify ($store = isRequired()) {
    let data = $store.state.models[this.model.key][this.id]
    let new_data = {id: this.id}
    this._modifiers.forEach((modifier) => {
      new_data = {...modifier(data), ...new_data}
    })
    new ModelSchemaUpdater().insert($store, this.model, {result: new_data})
  }

  use_modifier (modifier = isRequired()) {
    this._modifiers.push(modifier)
    return this
  }
}

export {
  model_schema,
  ModelSchemaDelete,
  ModelSchemaUpdater,
  ModelSchemaSubscribe,
  ModelSchemaLock,
  ModelModifier,
  get_lock_uid
}
