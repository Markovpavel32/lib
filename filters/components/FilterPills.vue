<template>
  <ul class="nav nav-pills inline-block">
    <li v-for="item in this.filter.config.parser.choices" class="rounded" :class="{'active': filter.values.selected === item[0]}" @click="on_change(item[0])">
      <slot :name="item[0]" :item="item">
        <a>{{ item[1] }}</a>
      </slot>
    </li>
  </ul>
</template>

<script>
  import {AppliedFilter} from '../filter'

  export default {
    name: 'filter-pills',
    props: {
      filter: AppliedFilter,
    },
    methods: {
      on_change (value) {
        this.filter.values.selected = value
        this.filter.on_change()
      }
    }
  }
</script>
