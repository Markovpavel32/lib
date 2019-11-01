<template>
  <div>
    <refresh-error :uid="uid" @refresh="list.fetch($store)"></refresh-error>
    <slot v-if="list.initiated" :list="list"></slot>
    <spinner-wave v-else></spinner-wave>
    <slot v-if="list.initiated" name="paginator" :list="list"></slot>
  </div>
</template>

<script>
  import {IndexdbCache} from '../db/indexdb_cache'
  import {django_urls} from '../django_urls/urls'
  import RefreshError from '../errors/RefreshError'
  import {ServerListData, ServerListSource} from '../list/server_list'
  import {ModelSchemaLock, ModelSchemaUpdater} from '../model_store/store'
  import SpinnerWave from '../spinners/SpinnerWave'

  export default {
    name: 'CachedListFetcher',
    components: {SpinnerWave, RefreshError},
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
      // time in ms
      expiration: {
        required: true,
        // default: 1000 * 60 * 60 - 1h
      }
    },
    data () {
      const uid = this.url
      const source = new ServerListSource(django_urls[this.url](), this.model)
      const list = new ServerListData(uid, source)
      list.set_limit(this.limit)
      list.on_fetch((list, ids, normalized) => {
        new IndexdbCache().set_data('cached_fetcher:' + this.model.key, normalized, this.expiration)
      })
      this.filters.forEach(x => {
        list.use_filters(this.$store, x)
      })
      return {list, uid, source}
    },
    async created () {
      try {
        const normalized = await new IndexdbCache().get_data('cached_fetcher:' + this.model.key)
        if (!normalized) {
          this.list.fetch(this.$store)
          return
        }
        new ModelSchemaUpdater().insert_list(this.$store, this.source.entity, normalized)
        new ModelSchemaLock(normalized.result, this.source.entity, this.list.lock_id).acquire(this.$store)
        this.list.ids = normalized.result
        this.list.initiated = true
      } catch (e) {
        this.list.fetch(this.$store)
      }
    },
    beforeDestroy () {
      this.list.destroy(this.$store)
    }
  }
</script>
