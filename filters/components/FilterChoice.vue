<template>
  <form-field :form-engine="formEngine" :field="formEngine.get_field('selected')" :model="filter.values"></form-field>
</template>

<script>
  import FormField from '../../../libs/forms/FormField'
  import {FormEngine} from '../../../libs/forms/engine'
  import {VueFieldData} from '../../../libs/forms/field'
  import {AppliedFilter} from '../filter'

  export default {
    name: 'filter-choice',
    components: { FormField },
    props: {
      filter: AppliedFilter,
    },
    created () {
      this.formEngine = new FormEngine(this, this.filter.get_id()).with_fields([
        new VueFieldData('selected', 'select').label('Опции').choices(this.filter.config.parser.choices),
      ]).on_change(this.filter)
    },
  }
</script>
