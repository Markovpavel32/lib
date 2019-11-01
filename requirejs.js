function load_require (scripts) {
  return new Promise(function (resolve, reject) {
    try {
      /* eslint-disable no-undef */
      requirejs(scripts, function (result) {
        resolve(...arguments)
      })
    } catch (err) {
      reject(err)
    }
  })
}

export {
  load_require
}
