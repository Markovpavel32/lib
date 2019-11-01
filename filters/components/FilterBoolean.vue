<template>
  <form-field :field="formEngine.get_field('val_from')" :model="values" :formEngine="formEngine" @model-updated="update_selected"></form-field>
</template>

<script>
  import FormField from '../../../libs/forms/FormField'
  import {FormEngine} from '../../../libs/forms/engine'
  import {VueFieldData} from '../../../libs/forms/field'
  import {AppliedFilter} from '../filter'

  export default {
    name: 'filter-boolean',
    components: { FormField },
    props: {
      filter: AppliedFilter
    },
    created () {
      let options = [
        ['true', 'Соответствует'],
        ['false', 'Не соответствует']
      ]
      if (this.filter.config.types && this.filter.config.types.length > 1) {
        options.push(['isnull', 'Не определено'])
        options.push(['notnull', 'Заполнено'])
      }
      this.formEngine = new FormEngine(this, `${this.filter.name}:engine`).with_fields([
        new VueFieldData('val_from', 'select').choices(options)
      ])
    },
    data () {
      let val_from = ''
      if (this.filter.values.val_from === undefined || this.filter.values.val_from === '') val_from = 'true'
      if (this.filter.filter_type === 'exact') val_from = this.filter.values.val_from ? 'true' : 'false'
      else val_from = this.filter.values.val_from ? 'isnull' : 'notnull'
      return {
        values: {val_from: val_from}
      }
    },
    methods: {
      update_selected (new_value) {
        if (new_value === 'true') {
          this.filter.change_type('exact')
          Object.assign(this.filter.values, {val_from: true})
        } else if (new_value === 'false') {
          this.filter.change_type('exact')
          Object.assign(this.filter.values, {val_from: false})
        } else if (new_value === 'isnull') {
          this.filter.change_type('isnull')
          Object.assign(this.filter.values, {val_from: true})
        } else {
          this.filter.change_type('isnull')
          Object.assign(this.filter.values, {val_from: false})
        }
        this.filter.on_change()
      }
    }
  }
</script>
