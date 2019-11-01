<template>
  <div>
    <refresh-error :uid="uid" @refresh="list.fetch($store)"></refresh-error>
    <slot v-if="!is_need || list.initiated" :list="list"></slot>
    <spinner-wave v-else></spinner-wave>
    <slot v-if="!is_need || list.initiated" name="paginator" :list="list"></slot>
    <template v-if="use_default_paginator && list.initiated">
      <list-paginator :paginator="list.paginator" :is_active="!list.is_fetching"
                      :set_page="(page_number) => {list.set_page($store, page_number)}">
      </list-paginator>
    </template>
  </div>
</template>

<script>
  import {django_urls} from '../django_urls/urls'
  import RefreshError from '../errors/RefreshError'
  import {ServerListData, ServerListSource} from '../list/server_list'
  import ListPaginator from '../model_store/ListPaginator'
  import SpinnerWave from '../spinners/SpinnerWave'

  export default {
    name: 'ListFetcher',
    components: {ListPaginator, SpinnerWave, RefreshError},
    props: {
      filters: {
        type: Array,
        default: () => ([])
      },
      url: {
        type: String,
        required: true
      },
      model: {
        required: true
      },
      limit: {
        default: 20
      },
      use_default_paginator: {
        type: Boolean,
        default: false
      },
      watch_key: {
        required: false,
        default: null
      },
      is_need: {
        required: false,
        default: true
      },
      params: {
        required: false,
        default: () => []
      },
      on_fetch_callback: {
        required: false,
        default: () => { return (list, ids, response) => {} }
      }
    },
    data () {
      const uid = this.url
      const source = new ServerListSource(django_urls[this.url](...this.params), this.model)
      const list = new ServerListData(uid, source)
      list.set_limit(this.limit).on_fetch(this.on_fetch_callback)
      // eslint-disable-next-line no-undef
      return {list, uid}
    },
    watch: {
      watch_key (val) {
        if (val === null || !this.is_need) return
        this.fetch()
      },
      is_need () {
        this.fetch()
      }
    },
    created () {
      this.fetch()
    },
    beforeDestroy () {
      this.list.destroy(this.$store)
    },
    methods: {
      fetch () {
        if (!this.is_need) return
        this.list._filters = []
        this.filters.forEach(x => {
          this.list.use_filters(this.$store, x)
        })
        this.list.fetch(this.$store)
      }
    }
  }
</script>
