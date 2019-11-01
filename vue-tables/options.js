
let TablesOptions = {
  responseAdapter: function (resp) {
    return {
      data: resp.data.results,
      count: resp.data.count
    }
  },
  requestAdapter: function (data) {
    if (data.orderBy && !data.ascending) {
      data.orderBy = '-' + data.orderBy
    }
    return data
  },
  skin: 'table table-striped table-hover',
  perPage: 20,
  debounce: 1000,
  dateFormat: 'DD.MM.YYYY',
  saveState: true,
  texts: {
    count: 'Показаны с {from} по {to} из {count} записей|{count} строк|1 запись',
    filter: '',
    filterPlaceholder: 'Введите что искать',
    limit: 'Отображать по:',
    noResults: 'Записи не найдены',
    page: 'Страница:',
  }
  // filterByColumn: true
  // perPageValues: [5, 10, 25, 50, 100]
}

class TableColumn {
  constructor (name, heading) {
    this.name = name
    this.is_sortable = true
    this.heading = heading || name
    this.is_date_column = false
    this.is_filterable = true
  }

  date_column () {
    this.is_date_column = true
    return this
  }

  not_filterable () {
    this.is_filterable = false
    return this
  }

  not_sortable () {
    this.is_sortable = false
    return this
  }

  custom () {
    this.is_filterable = false
    this.is_sortable = false
    return this
  }
}

class TableDataFactory {
  constructor (table_name) {
    this.columns = []
    this._table_name = table_name
    this._request_function = null
  }

  add_columns (columns) {
    this.columns = [...this.columns, ...columns]
    return this
  }

  get_options () {
    let heading = {}
    this.columns.forEach(function (x) {
      heading[x.name] = x.heading
    })

    return {
        columns: this.columns.map((x) => x.name),
        options: {
          requestFunction: this._request_function,
          sortable: this.columns.filter((x) => x.is_sortable).map((x) => x.name),
          dateColumns: this.columns.filter((x) => x.is_date_column).map((x) => x.name),
          headings: heading,
          filterByColumn: false,
          filterable: false,
          ...TablesOptions
        },
        name: this._table_name
    }
  }

  request (func) {
    this._request_function = func
    return this
  }
}

export {
  TablesOptions,
  TableColumn,
  TableDataFactory
}
