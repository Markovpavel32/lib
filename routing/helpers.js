
function direct_redirect (to, from, next) {
    window.location = to.path
    return to
}

export {
  direct_redirect
}
