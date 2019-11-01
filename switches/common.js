export const gen_id = () => {
  let id = ''
  let n = 5
  while (n--) id += String.fromCharCode((id = Math.random() * 62 | 0, id += id > 9 ? (id < 36 ? 55 : 61) : 48))
  return id
}
