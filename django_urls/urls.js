import './reverse'

const django_urls = window.Urls

const DjangoUrlsPlugin = {
  install (Vue, options) {
    Vue.prototype.$django_url = django_urls
  }
}


export {
  django_urls,
  DjangoUrlsPlugin
}
