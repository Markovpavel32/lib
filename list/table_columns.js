import {ChoiceParser} from '../filters/parsers/choice'

class TableColumn {
  constructor (name, title) {
    this.name = name
    this.title = title
    this.is_sortable = false
    this.by_default = true
    this.css_classes = ''
  }

  sortable () {
    this.is_sortable = true
    return this
  }

  center () {
    this.css_classes += ' text-center'
    return this
  }
}

class TableColumns {
  constructor () {
    this.columns = []
  }

  add_columns (columns) {
    columns.forEach((x) => this.columns.push(x))
    return this
  }

  copy () {
    let clone = new TableColumns()
    return clone.add_columns(this.columns)
  }
}

class AppliedTableColumn {
  constructor (applied_columns, column) {
    this.applied_columns = applied_columns
    this.column_config = column
    this.order = ''
  }
}

class AppliedTableColumns {
  constructor (namespace, table_columns) {
    this.namespace = namespace
    this.table_columns = table_columns
    this.columns = table_columns.columns.map((x) => new AppliedTableColumn(namespace, x))
    let names = this.table_columns.columns.map((x) => [x.name, x.name])
    this.columns_map = {}
    table_columns.columns.forEach((x) => {
      this.columns_map[x.name] = true
    })
    this.order_by_column = new ChoiceParser(names).use_key(this.namespace + ':orderByColumn')
    this.order_by_direction = new ChoiceParser([['', ''], ['ask', 'ask'], ['desc', 'desc']]).use_key(this.namespace + ':orderByDirection')
    this.applied = {}
    this._default_order = ''
    this.load_order()
    this.on_change_callbacks = []
  }

  load_order () {
    if (this.order_by_column.get_from_storage()) {
      this._orderBy(this.order_by_column.get_from_storage(), this.order_by_direction.get_from_storage())
    } else {
      this.applied = {orderBy: this._default_order}
    }
  }

  defaultOrder (order) {
    this._default_order = order
    this.load_order()
    return this
  }

  orderBy (name, direction) {
    this._orderBy(name, direction)
    this.trigger_on_change()
  }

  _orderBy (name, direction) {
    let index = this.columns.findIndex((x) => x.column_config.name === name)
    if (index >= 0) {
      this.columns.forEach((x) => { x.order = '' })
      this.columns[index].order = direction

      let final_sort = ''
      if (direction !== '') final_sort += name
      if (this._default_order) final_sort += (final_sort ? ', ' : '') + this._default_order

      if (direction === '') {
        this.order_by_column.remove_from_storage()
        this.order_by_direction.remove_from_storage()
        this.applied = {orderBy: this._default_order}
      } else {
        this.order_by_column.set_to_storage(undefined, name)
        this.order_by_direction.set_to_storage(undefined, direction)
        if (direction === 'ask') this.applied = {orderBy: final_sort}
        else if (direction === 'desc') this.applied = {orderBy: '-' + final_sort}
      }
    }
  }

  trigger_on_change () {
    this.on_change_callbacks.forEach((x) => x.on_change(this.applied, this.applied))
  }

  on_change (callback) {
    this.on_change_callbacks.push(callback)
    return this
  }
}

export {
  TableColumn,
  TableColumns,
  AppliedTableColumn,
  AppliedTableColumns
}
