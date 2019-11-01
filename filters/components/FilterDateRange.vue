<template>
  <div class="row">
    <div class="col-xs-6">
      <label class="control-label col-xs-2 col-xs-no-padding-left">От</label>
      <form-field class="col-xs-10" :form-engine="formEngine" :field="formEngine.get_field('val_from')" :model="filter.values"></form-field>
    </div>
    <div class="col-xs-6">
      <label class="control-label col-xs-2 col-xs-no-padding-left">До</label>
      <form-field class="col-xs-10" :form-engine="formEngine" :field="formEngine.get_field('val_to')" :model="filter.values"></form-field>
    </div>
  </div>
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
      this.formEngine = new FormEngine(this, this.filter.get_id()).with_fields([
        new VueFieldData('val_from').date_picker().values(this.filter.values.val_from),
        new VueFieldData('val_to').date_picker().values(this.filter.values.val_to),
      ]).on_change(this.filter)
    },
  }
</script>
