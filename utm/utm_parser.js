function parse_utm () {
  const urlParams = new URLSearchParams(window.location.search)
  for (const p of urlParams.entries()) {
    if (p[0].includes('utm') || p[0].includes('eduapp')) window.localStorage.setItem(p[0], p[1])
  }
}

function get_eduapp_utm_object () {
  const eduapp_utmname = {}
  parse_utm()
  for (let i = 0; i < window.localStorage.length; i++) {
    const key = window.localStorage.key(i)
    if (key.includes('utm') || key.includes('eduapp')) {
      eduapp_utmname[key.replace('eduapp_', '')] = window.localStorage.getItem(key)
    }
  }
  return eduapp_utmname
}

export {
  get_eduapp_utm_object,
  parse_utm
}
