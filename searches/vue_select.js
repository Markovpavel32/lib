import {FilterManager} from '../filters/manager'
import {ValueFilterType} from '../filters/types/value'
import {ServerListData, ServerListSource} from '../list/server_list'
import {ServerInstanceData} from '../list/fetch_instance'
import {mapState} from 'vuex'
import lodash_map from 'lodash/map'
import {isRequired} from '../vuex_method'

const vue_select_mixin = {
  props: {
    on_select: {
      required: true,
    },
    query: {
      default: () => {
        return {}
      },
      required: false
    },
    selected: {
      required: true
    },
    custom_inventory: {
      required: false
    }
  },
  data () {
    let inventory = this.get_inventory()
    let url = inventory.get_list_url()
    let filters = new FilterManager(url + ':filters').add_filters([
      new ValueFilterType('query', '').string().in_memory().required().apply_on_change().modify_filter((x) => x.allow_empty()),
    ]).initialize()
    let source = new ServerListSource(url, inventory.model)
    let list = (new ServerListData(url + ':multiselect', source).use_filters(this.$store, filters)
      .add_query_filter(this.query).on_init(() => { this.initiated = true }))
    return {
      filters: filters,
      list: list,
      value: [],
      _value: [],
      initiated: false,
      inventory: inventory
    }
  },
  computed: {
    ...mapState({
      list_data (state) {
        return lodash_map(this.list.ids, (key) => this.inventory.get_instance(state, key))
      },
    })
  },
  methods: {
    asyncFind (query) {
      let query_filter = this.filters.get_filter('query')
      query_filter.values['val_from'] = query
      query_filter.on_change()
    },
    get_inventory () {
      if (this.custom_inventory) return this.custom_inventory
      throw new Error('get_inventory is undefined')
    }
  },
  mounted () {
    if (this.selected) {
        let checker_source = new ServerListSource(this.inventory.get_instance_url(this.selected), this.inventory.model)
        this.server_instance = new ServerInstanceData(`ajax:search`, checker_source)
        this.server_instance.on_init(() => {
          let instance = this.inventory.get_instance(this.$store, this.selected)
          this.value = [instance]
          this.asyncFind(this.inventory.get_query(instance))
          // query_filter.apply_local()
          this.list.fetch(this.$store)
        })
        this.server_instance.fetch(this.$store)
      } else {
        this.list.fetch(this.$store)
    }
  },
  beforeDestroy () {
    if (this.server_instance) this.server_instance.destroy(this.$store)
    this.list.destroy(this.$store)
  }
}

class BaseModelInventory {
  constructor () {
    this._url = undefined
  }
  get model () {
    throw new Error('Inventory model undefined')
  }

  get instance_cls () {
    throw new Error('Inventory instance_cls undefined')
  }

  get_instance ($store = isRequired(), selected = isRequired()) {
    if (selected) return this.model.get_instance($store, this.instance_cls, selected)
  }

  get_query (instance = isRequired()) {
    return instance && instance.values.id
  }

  get_instance_url (selected = isRequired()) {
    throw new Error('Inventory get_instance_url undefined')
  }

  get_list_url (context) {
    if (this._url) return this._url
    throw new Error('Inventory get_list_url undefined')
  }

  use_list_url (url) {
    this._url = url
    return this
  }
}

export {
  vue_select_mixin,
  BaseModelInventory
}
