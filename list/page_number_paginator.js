
class PageNumberPaginator {
  constructor (name) {
    this.name = name
    /* eslint-disable no-undef */
    this.per_page = localStorage.getItem(`PageNumberPaginator:${this.name}:per_page`) || 20
    /* eslint-disable no-undef */
    this.page_number = localStorage.getItem(`PageNumberPaginator:${this.name}:page_number`) || 1
    this.next_page = this.page_number
    this.possible_per_pages = [5, 10, 20, 50]
    this.total_pages = 0
    this.count = 0
  }

  get_next_page () {
    if (this.page_number < this.total_pages) return +this.page_number + 1
  }

  get_prev_page () {
    if (this.page_number > 1) return this.page_number - 1
  }

  set_page (page_number) {
    this.page_number = page_number
    localStorage.setItem(`PageNumberPaginator:${this.name}:page_number`, page_number)
  }

  change_page () {
    this.set_page(this.next_page)
  }

  rollback_page () {
    this.next_page = this.page_number
  }

  parse (response_data) {
    this.count = response_data.count
    this.total_pages = Math.ceil(1.0 * response_data.count / this.per_page)
  }

  is_initial () {
    return (this.page_number === 1 || this.next_page === 1)
  }

  set_limit (limit) {
    this.per_page = limit
    return this
  }

  get offset () {
    return (this.page_number - 1) * this.per_page
  }
}

export {
  PageNumberPaginator
}
