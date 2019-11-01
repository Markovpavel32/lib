<template>
  <form-field :form-engine="formEngine" :field="formEngine.get_field('val_from')" :model="filter.values"></form-field>
</template>

<script>
  import FormField from '../../../libs/forms/FormField'
  import {FormEngine} from '../../../libs/forms/engine'
  import {VueFieldData} from '../../../libs/forms/field'
  import {AppliedFilter} from '../filter'

  export default {
    name: 'filter-date',
    components: { FormField },
    props: {
      filter: AppliedFilter,
    },
    created () {
      this.formEngine = new FormEngine(this, this.filter.get_id()).with_fields([new VueFieldData('val_from').date_picker().values(this.filter.values.val_from),
      ]).on_change(this.filter)
    },
  }
</script>
