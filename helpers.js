function cached_property (target, propertyKey, descriptor) {
  let originalGet = descriptor.get
  descriptor.get = function () {
    let called_key = '__called_' + propertyKey
    let value_key = '__' + propertyKey
    if (!this[called_key]) {
      this[value_key] = originalGet.call(this)
      this[called_key] = true
    }
    return this[value_key]
  }
}

function to_form_data (data, name, result) {
  /* eslint-disable no-undef */
  if (result === undefined) result = new FormData()
  if (Array.isArray(data)) {
    data.forEach(data, function (value, index) {
      result.append(name + '[' + index + ']', value)
    })
  } else if (typeof data === 'object') {
    for (let key in data) result.append(key, data[key])
  } else {
    result.append(name, data)
  }
  return result
}

function difference (a, b) {
  let to_create = []
  b.forEach(x => !a.includes(x) && to_create.push(x))
  let to_remove = []
  a.forEach((x) => !b.includes(x) && to_remove.push(x))
  return [to_create, to_remove]
}

function copy_text_to_clipboard (text, container) {
  if (navigator && navigator.clipboard) return navigator.clipboard.writeText(text)
  let textArea = document.createElement('textarea')
  textArea.value = text
  container.appendChild(textArea)
  textArea.focus()
  textArea.select()
  try {
    document.execCommand('copy')
  } catch (err) {
    console.error(err)
  }
  container.removeChild(textArea)
}

function can_i_use (property, value) {
  return window.CSS && window.CSS.supports && window.CSS.supports(property, value)
}

export {
  cached_property,
  to_form_data,
  difference,
  copy_text_to_clipboard,
  can_i_use
}
