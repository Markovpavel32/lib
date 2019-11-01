<template>
  <div>
    <pretty-radio color="success" v-model="selected" value="true" @change="on_change">Да</pretty-radio>
    <pretty-radio color="primary" v-model="selected"  value="false" @change="on_change">Нет</pretty-radio>
  </div>
</template>

<script>
  import PrettyRadio from 'pretty-checkbox-vue/radio'
  import {AppliedFilter} from '../filter'
  import PrettyCheckbox from 'pretty-checkbox-vue'
  import Vue from 'vue'
  require('pretty-checkbox/dist/pretty-checkbox.css')

  Vue.use(PrettyCheckbox)

  export default {
    name: 'filter-boolean-radio',
    components: { PrettyRadio },
    props: {
      filter: AppliedFilter,
    },
    data () {
      let selected = ''
      if (this.filter.values.val_from === undefined || this.filter.values.val_from === '') selected = ''
      else selected = this.filter.values.val_from ? 'true' : 'false'
      return {
        selected: selected
      }
    },
    methods: {
      on_change (value) {
        if (value === 'true') this.filter.values.val_from = true
        else if (value === 'false') this.filter.values.val_from = false
        this.filter.on_change()
      }
    }
  }
</script>
