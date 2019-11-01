function elementExists (element) {
    while (element) {
        // noinspection EqualityComparisonWithCoercionJS
      if (element === document) {
            return true
        }
        element = element.parentNode
    }
    return false
}
export {
  elementExists
}
