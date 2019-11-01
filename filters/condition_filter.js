class BaseConditionFilter {
  constructor () {
    this.key = ''
    this.apply_case = false
  }

  use_case () {
    this.apply_case = true
    return this
  }

  use_key (key) {
    this.key = key
    return this
  }

  get_filter (filter, cond) {
    return {}
  }
}

class LambdaConditionFilter {
  constructor (filter_function) {
    this.filter_function = filter_function
  }

  get_filter (filter, cond) {
    return this.filter_function(cond)
  }
}

export {
  BaseConditionFilter,
  LambdaConditionFilter
}
