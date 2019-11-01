<template>
  <div>
    <refresh-error :uid="uid" @refresh="fetch_data()">
      <template slot="else" v-if="!this.ajax.initiated">
        <spinner-wave></spinner-wave>
      </template>
    </refresh-error>
    <slot v-if="html_data" :html_data="html_data"></slot>
  </div>
</template>

<script>
  import RefreshError from '../errors/RefreshError'
  import {AjaxOperator} from '../model_store/operators'
  import {load_require} from '../requirejs'
  import SpinnerWave from '../spinners/SpinnerWave'

  export default {
    name: 'html-fetcher',
    components: {SpinnerWave, RefreshError},
    props: {
      url: {
        type: String,
        required: true
      },
    },
    data () {
      let html_data = ''
      const uid = this.url
      let ajax = new AjaxOperator(this.url, uid).get().ajax()
      return {html_data, uid, ajax}
    },
    created () {
      load_require([
        '/static/mshp/studies/diary2.js',
        '/static/mshp/libs/views_helpers/spyable.js',
        '/static/mshp/libs/iterator.js',
        '/static/jquery/plugins/jQRangeSlider-5.7.0/range_date_slider.js']
      ).then(() => {
        this.ajax.on_success(($store, response) => { this.html_data = response.data.html })
        this.fetch_data()
      })
    },
    methods: {
      fetch_data () {
        this.ajax.execute(this.$store, {})
      }
    }
  }
</script>
