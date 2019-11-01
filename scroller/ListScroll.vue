<template>
    <div class="attempts-scroll">
        <div class="flex attempts-list">
          <div class="h4">
            <slot name="title"></slot>
          </div>
          <a class="lead no-bottom m-r" v-if="show_prev" @click="prev_or_scroll()"><i class="icon-chevron-left"></i></a>
          <div class="nowrap" style="overflow-x: hidden; flex-grow: 12" ref="scroll" v-dragscroll id="scroll" :class="scroll_classes">
            <div class="scroll-item inline-block relative" v-for="(item, index) in items" :ref="'item' + index" :id="'question' + item.values.id">
              <slot name="item" :item="item">
              </slot>
            </div>
            <slot name="post_items"></slot>
          </div>
          <a class="lead no-bottom m-l" v-if="show_next" @click="next_or_scroll()"><i class="icon-chevron-right"></i></a>
        </div>
      </div>
</template>

<script>
  import {dragscroll} from 'vue-dragscroll'

  export default {
    name: 'list-scroll',
    props: {
      items: {
        required: true
      },
      show_prev: {
        default: true
      },
      show_next: {
        default: true
      },
      scroll_classes: {
        required: false,
        default: ''
      }
    },
    directives: {
      'dragscroll': dragscroll
    },
    methods: {
      prev_or_scroll () {
        if (this.$refs.scroll.scrollWidth <= this.$refs.scroll.clientWidth) this.$emit('prev')
        else this.scroll(-1)
      },
      next_or_scroll () {
        if (this.$refs.scroll.scrollWidth <= this.$refs.scroll.clientWidth) this.$emit('next')
        else this.scroll(1)
      },
      scroll (sign) {
        // let amount = sign * this.$refs.scroll.clientWidth / this.items.length
        console.log(this.$refs.item19)
        console.log(this.$refs.scroll)
        console.log(this.$refs)
        window.$(this.$refs.scroll).animate({scrollLeft: 1000}, 400, 'linear')
      },
    },
  }
</script>
