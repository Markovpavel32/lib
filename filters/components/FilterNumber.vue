<template>
  <form-field :field="formEngine.get_field('val_from')" :model="filter.values" :formEngine="formEngine" v-else></form-field>
</template>

<script>
  import FormField from '../../../libs/forms/FormField'
  import {FormEngine} from '../../../libs/forms/engine'
  import {VueFieldData} from '../../../libs/forms/field'
  import {AppliedFilter} from '../filter'

  export default {
    name: 'filter-number',
    components: { FormField },
    props: {
      filter: AppliedFilter,
    },
    created () {
      this.formEngine = new FormEngine(this, `${this.filter.name}:engine`).with_fields([
        new VueFieldData('val_from').number().optional().on_enter(() => {
          this.filter.apply_local()
        })
      ]).on_change(this.filter)
    },
  }
</script>
