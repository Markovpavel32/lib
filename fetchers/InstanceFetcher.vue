<template>
  <div>
    <refresh-error :uid="uid" @refresh="instance.fetch($store)"></refresh-error>
    <slot v-if="!is_need || instance.initiated" :instance="instance"></slot>
    <spinner-wave v-else></spinner-wave>
  </div>
</template>

<script>
  import {django_urls} from '../django_urls/urls'
  import RefreshError from '../errors/RefreshError'
  import {ServerInstanceData} from '../list/fetch_instance'
  import {ServerListSource} from '../list/server_list'
  import SpinnerWave from '../spinners/SpinnerWave'

  export default {
    name: 'InstanceFetcher',
    components: {SpinnerWave, RefreshError},
    props: {
      instance_id: {
        required: false
      },
      url: {
        type: String,
        required: true
      },
      model: {
        required: true
      },
      watch_key: {
        required: false,
        default: null
      },
      is_need: {
        required: false,
        default: true
      },
      configure: {
        type: Function,
        required: false
      }
    },
    data () {
      const uid = this.url
      const instance = new ServerInstanceData(uid, this.get_source())
      if (this.configure) this.configure(instance)
      instance.on_fetch((data) => {
        this.$emit('fetched', data)
      })
      return {instance, uid}
    },
    watch: {
      watch_key (val) {
        if (val === null || !this.is_need) return
        this.instance.source = this.get_source(this.instance_id)
        this.instance.fetch(this.$store)
      },
      instance_id (val) {
        if (!this.is_need) return
        this.instance.source = this.get_source(val)
        this.instance.fetch(this.$store)
      },
    },
    methods: {
      get_source (id) {
        id = id || this.instance_id
        if (id) return new ServerListSource(django_urls[this.url](id), this.model)
        return new ServerListSource(django_urls[this.url](), this.model)
      }
    },
    created () {
      if (this.is_need) this.instance.fetch(this.$store)
    },
    beforeDestroy () {
      this.instance.destroy(this.$store)
    }
  }
</script>
