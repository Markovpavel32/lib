import Vuex from 'vuex'
import Vue from 'vue'
import {error_message_schema} from '../errors/store'
import {model_schema, ModelSchemaDelete, ModelSchemaUpdater} from './store'
import {discussion_model} from '../../discussions/discussion_store'
import {normalize} from 'normalizr'
import {discussion_comment_model} from '../../discussions/comments/models'

Vue.use(Vuex)


function get_model_store () {
  const debug = process.env.NODE_ENV !== 'production'

  let store = new Vuex.Store({
    state: {},
    mutations: {},
    actions: {},
    strict: debug
  })

  model_schema.register_module(store)
  error_message_schema.register_module(store)
  return store
}

describe('test List', () => {
  let store
  let discussion = [{
    id: 1,
    discussion_labels: [
      {id: 1},
      {id: 2},
    ],
    discussion_users: [
      {id: 1, user: {id: 1}},
      {id: 2, user: {id: 2}},
    ]
  }]
  let comment = [{
    id: 1,
    discussion_id: 1,
    author: {id: 1}
  }]

  beforeAll(() => {
    store = get_model_store()
    let normalized = normalize(discussion, [discussion_model.normalizr_entity])
    new ModelSchemaUpdater().insert_list(store, discussion_model, normalized)
    normalized = normalize(comment, [discussion_comment_model.normalizr_entity])
    new ModelSchemaUpdater().insert_list(store, discussion_comment_model, normalized)
  })

  test('discussion inserted', () => {
    expect(store.state.models.discussions).toHaveProperty('1')
  })

  test('user inserted', () => {
    expect(store.state.models.users).toHaveProperty('1')
    expect(store.state.models.users).toHaveProperty('2')
  })

  test('comment inserted', () => {
    expect(store.state.models.comments).toHaveProperty('1')
  })

  test('remove comment', () => {
    new ModelSchemaDelete([comment[0].id], discussion_comment_model).collect(store)
    expect(store.state.models.users).toHaveProperty('1')
    expect(store.state.models.comments).not.toHaveProperty('1')
  })
})
