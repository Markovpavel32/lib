<template>
  <form-field :form-engine="formEngine" :field="formEngine.get_field('selected')" :model="model"></form-field>
</template>

<script>
  import Vue from 'vue'
  import 'vue-multiselect/dist/vue-multiselect.min.css'
  import FormField from '../../../libs/forms/FormField'
  import {FormEngine} from '../../../libs/forms/engine'
  import {VueFieldData} from '../../../libs/forms/field'
  import {AppliedFilter} from '../filter'
  import Multiselect from 'vue-multiselect'

  Vue.component('multiselect', Multiselect)

  export default {
    name: 'filter-multi-choice',
    components: {
      FormField,
    },
    props: {
      filter: AppliedFilter,
    },
    created () {
      this.formEngine = new FormEngine(this, this.filter.get_id()).with_fields([
        new VueFieldData('selected').multi_select().label('Опции').choices(this.filter.config.parser.parser.choices),
      ]).on_change(this)
    },
    computed: {
      model () {
        let items = this.formEngine.get_field('selected').options.values
        let selected = (this.filter.values.selected || []).map(value => items.find(option => option.id === value))
        return {selected: selected}
      }
    },
    methods: {
      on_change (new_value) {
        this.filter.values.selected = new_value.map(value => value.id)
        this.filter.on_change()
      }
    }
  }
</script>

<style lang="scss">
  .multiselect {
    /*position: initial !important;*/
  }
  .multiselect .multiselect__content-wrapper {
    z-index: 100;
  }
</style>
