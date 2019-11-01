let vuex_index = 0

function vuex_mutation (schema) {
  function _mutation (cls, method, descriptor) {
    vuex_index++
    let local_mutation_name = `${vuex_index}${cls.constructor.name}_${method}`
    let mutation_name = `${schema.module_name}/${local_mutation_name}`
    let original_func = descriptor.value
    function mutation_func (state, payload) {
      // let $this = payload.$this
      // original_func.bind($this)(state, ...payload)
      let $this = payload[0]
      payload.shift()
      original_func.bind($this)(state, ...payload)
    }
    schema.module_data.mutations[local_mutation_name] = mutation_func
    schema.new_mutation(local_mutation_name, mutation_func)
    descriptor.value = function ($store, ...data) {
      // let payload = {data: data, $this: this}
      // return $store.commit(mutation_name, payload, {root: true})
      data.unshift(this)
      return $store.commit(mutation_name, data, {root: true})
    }
  }
  return _mutation
}

function vuex_action (schema) {
  function _action (cls, method, descriptor) {
    vuex_index++
    let local_action_name = `${vuex_index}${cls.constructor.name}_${method}`
    let action_name = `${schema.module_name}/${local_action_name}`
    let original_func = descriptor.value
    function action_func (state, payload) {
      let $this = payload[0]
      payload.shift()
      original_func.bind($this)(state, ...payload)
    }
    schema.module_data.actions[local_action_name] = action_func
    schema.new_action(action_name, action_func)
    descriptor.value = function ($store, ...data) {
      data.unshift(this)
      return $store.dispatch(action_name, data, {root: true})
    }
  }
  return _action
}

function vuex_props (schema) {
  function _vuex_props (cls, method, descriptor) {
    let original_func = descriptor.value

    descriptor.value = function ($store, ...data) {
      return original_func($store.state[schema.name], ...data)
    }
  }
  return _vuex_props
}

const isRequired = () => {
  // if (process.env.NODE_ENV !== 'production') console.trace('param is required')
  throw new Error('param is required')
}

export {
  vuex_mutation,
  vuex_action,
  vuex_props,
  isRequired,
}
