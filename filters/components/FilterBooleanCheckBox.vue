<template>
  <div>
    <pretty-checkbox color="success" v-model="selected" value="true" @change="on_change">{{filter.config.title}}</pretty-checkbox>
  </div>
</template>

<script>
  import PrettyCheckbox from 'pretty-checkbox-vue/check'
  import {AppliedFilter} from '../filter'
  require('pretty-checkbox/dist/pretty-checkbox.css')

  export default {
    name: 'filter-boolean-check-box',
    components: { PrettyCheckbox },
    props: {
      filter: AppliedFilter,
    },
    data () {
      let selected = ''
      if (this.filter.values.val_from === undefined || this.filter.values.val_from === '') selected = false
      else selected = this.filter.values.val_from
      return {
        selected: selected
      }
    },
    methods: {
      on_change (value) {
        this.filter.values.val_from = value
        this.filter.on_change()
      }
    }
  }
</script>
