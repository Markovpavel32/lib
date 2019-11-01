
class VueKiller {
  constructor () {
    this.vues = []
    this.uid = 0
    this.created_at = {}
    window.setInterval(() => {
      this.destroy_vue(this.vues)
    }, 1000)
  }

  add (vue) {
    this.uid += 1
    window.$(vue.$el).attr('id', `vue_instance_${this.uid}`)
    this.vues.push(vue)
    this.created_at[vue.$el] = Date.now()
  }

  destroy_vue (vue_instances) {
    [...vue_instances].forEach((vue_instance, index, array) => {
      if (!vue_instance) return
      if (!this.created_at[vue_instance.$el] || (Date.now() - this.created_at[vue_instance.$el]) < 10000) return
      let selected = window.$('#' + window.$(vue_instance.$el).attr('id'))
      if (selected.length) return
      if (process.env.NODE_ENV !== 'production') console.log('kill vue: ' + window.$(vue_instance.$el).attr('id'))
      vue_instance.$destroy()
      window.$(vue_instance.$el).remove()
      vue_instances[index] = undefined
    })
  }
}
export {
  VueKiller
}
