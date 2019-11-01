class TableFilterCallback {
  constructor (component) {
    this.component = component
  }

  on_change () {
    this.component.$refs.table && this.component.$refs.table.getData()
  }
}

export {
  TableFilterCallback
}
