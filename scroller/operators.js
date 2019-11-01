class AttemptScroller {
  constructor (component) {
    this.component = component
  }

  scroll_to (index) {
    console.log('focus')
    let name = 'item' + index
    if (!this.component.$refs[name]) return
    let item = this.component.$refs[name][0]
    let scroll = this.component.$refs.scroll
    if (scroll) window.$(scroll).animate({scrollLeft: item.offsetLeft - scroll.offsetLeft - scroll.clientWidth / 2 + 100}, 400, 'linear')
  }
}

export {
  AttemptScroller
}
