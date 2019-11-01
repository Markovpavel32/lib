import lodash_forOwn from 'lodash/forOwn'
import {schema} from 'normalizr'
import {cached_property} from '../helpers'
import {isRequired} from '../vuex_method'

class ModelEntity {
  constructor (key) {
    this.key = key
    this.relations = {}
    this._normalizr_entity = undefined
    this._normalizr_options = {}
    this._schemas = undefined
    this._check_relations = false
  }

  add_related (key, model_relation) {
    if (model_relation.is_binded) throw new Error('Отношение уже привязано')
    this.relations[key] = model_relation
    model_relation.from_name = key
    model_relation.from_entity = this.key
    model_relation.is_binded = true
    model_relation.from_model = this
    return this
  }

  get normalizr_entity () {
    if (this._normalizr_entity) return this._normalizr_entity

    let relation_entities = {}
    lodash_forOwn(this.relations, (relation, key) => {
      let related_entity = relation.entity.normalizr_entity
      if (relation.is_multiple) related_entity = [related_entity]
      relation_entities[key] = related_entity
    })
    this._normalizr_entity = new schema.Entity(this.key, relation_entities, this._normalizr_options)
    return this._normalizr_entity
  }

  id_entity () {
    this._normalizr_options = (value, parent, key) => {
      return value
    }
    return this
  }

  @cached_property
  get schemas () {
    if (this._schemas) return this._schemas
    this._schemas = {[this.key]: this}
    lodash_forOwn(this.relations, (relation) => {
      Object.assign(this._schemas, relation.entity.schemas)
    })
    return this._schemas
  }

  check_relations () {
    this._check_relations = true
    return this
  }

  get_instance ($store = isRequired(), Cls = isRequired(), pk = isRequired()) {
    let state = $store
    if (state.rootState) state = state.rootState
    if (state.models === undefined) state = state.state
    let models = state.models
    if (pk && models[this.key] && models[this.key].hasOwnProperty(pk)) {
      return new Cls(models[this.key][pk], state)
    }
  }
}

class ModelEntityRelation {
  constructor (entity) {
    // this.key = key
    this.entity = entity
    this.on_delete = 'save'
    this.reverse_remove = 'remove'
    this.is_multiple = false
  }

  multiple () {
    this.is_multiple = true
    this.reverse_remove = 'check_relations'
    return this
  }

  save_on_delete () {
    this.on_delete = 'save'
    return this
  }

  remove_on_delete () {
    this.on_delete = 'remove'
    return this
  }

  remove_without_relations () {
    this.on_delete = 'check_relations'
    return this
  }
}

export {
  ModelEntity,
  ModelEntityRelation
}
