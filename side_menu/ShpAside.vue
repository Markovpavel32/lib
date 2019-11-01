<template>
  <div ref="container" class="position-sticky shp-aside" @mousein="update_size">
    <div ref="affix" class="flex-column" style="top:0;">
      <div ref="pre_menu" class="flex-no-resizable">
        <slot name="pre-menu"></slot>
      </div>
      <vue-perfect-scrollbar :settings="{suppressScrollX:'true'}">
        <div ref="menu" class="flex-resizable shp-aside__content">
          <slot></slot>
        </div>
      </vue-perfect-scrollbar>
    </div>
  </div>
</template>

<script>
  import {can_i_use} from '../helpers'
  import VuePerfectScrollbar from 'vue-perfect-scrollbar'

  export default {
    name: 'ShpAside',
    components: {VuePerfectScrollbar},
    data () {
      return {state: 'relative'}
    },
    mounted () {
      if (!can_i_use('position', 'sticky')) {
        document.addEventListener('scroll', this.on_scroll)
        this.$refs.affix.style.width = this.$refs.container.getBoundingClientRect().width + 'px'
        this.on_scroll()
      }
      document.addEventListener('scroll', this.update_size)
      this.update_size()
    },
    beforeDestroy () {
      if (this.on_scroll) {
        document.removeEventListener('scroll', this.on_scroll)
      }
      document.removeEventListener('scroll', this.update_size)
    },
    methods: {
      on_scroll (e) {
        let container = this.$refs.container
        let affix = this.$refs.affix
        let rect = container.getBoundingClientRect()
        if (rect.top <= 0 && this.state === 'relative') {
          affix.style.position = 'fixed'
          this.state = 'fixed'
        } else if (rect.top > 0 && this.state === 'fixed') {
          affix.style.position = 'relative'
          this.state = 'relative'
        }
      },
      update_size (e) {
        let top = this.$refs.container.getBoundingClientRect().top
        if (top > 0) this.$refs.affix.style.height = `calc(100vh - ${top}px)`
        this.$refs.affix.scroll()
      }
    }
  }
</script>
