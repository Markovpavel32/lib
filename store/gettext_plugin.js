import Vue from 'vue'
import GetTextPlugin from 'vue-gettext'
import translations from '../../../translations/translations.json'

function gettext_plugin () {
  Vue.use(GetTextPlugin, {
    availableLanguages: {
      // en_US: 'American English',
      ru_RU: 'Russian'
    },
    defaultLanguage: 'ru_RU',
    languageVmMixin: {
      computed: {
        currentKebabCase: function () {
          return this.current.toLowerCase().replace('_', '-')
        },
      },
    },
    translations: translations,
    silent: true || !(process.env.NODE_ENV === 'development'),
  })
  Vue.filter('i18n', function i18n (value) {
    return (value && value.toString) ? Vue.prototype.$gettext(value.toString()) : ''
  })
}

export {
  gettext_plugin
}
