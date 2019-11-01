export function plain (iterable, key_func = (x) => x) {
  return iterable.reduce((flat, current) => { return flat.concat(key_func(current)) }, [])
}

export function group_by (iterable, key_func) {
  let result = {}
  iterable.forEach((x) => {
    let key = key_func(x)
    if (!result[key]) result[key] = []
    result[key].push(x)
  })
  return result
}

export function * iterate_by (object, sort_func = (key, value) => key) {
  let keys = Object.keys(object)
  keys = keys.sort((a, b) => Number(sort_func(a) < sort_func(b)))
  for (let key of keys) {
    yield object[key]
  }
}
