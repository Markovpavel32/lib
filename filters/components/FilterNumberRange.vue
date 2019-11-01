<template>
  <div>
    <div class="col-sm-4 col-xs-no-padding-left">
      <form-field :field="formEngine.get_field('val_from')" :model="filter.values" :formEngine="formEngine"></form-field>
    </div>
    <div class="col-sm-4 col-xs-no-padding">
      <button class="btn btn-default btn-block btn-sm" @click="change_gte">{{ filter.values.gt_lt_e ? '=< X <=' : '< X <' }}</button>
    </div>
    <div class="col-sm-4 col-xs-no-padding-right">
      <form-field :field="formEngine.get_field('val_to')" :model="filter.values" :formEngine="formEngine"></form-field>
    </div>
  </div>
</template>

<script>
  import FormField from '../../../libs/forms/FormField'
  import {FormEngine} from '../../../libs/forms/engine'
  import {VueFieldData} from '../../../libs/forms/field'
  import {AppliedFilter} from '../filter'

  export default {
    name: 'filter-number-range',
    components: { FormField },
    props: {
      filter: AppliedFilter,
    },
    created () {
      this.formEngine = new FormEngine(this, `${this.filter.name}:engine`).with_fields([
        new VueFieldData('val_from').number().on_enter(() => this.filter.apply_local()),
        new VueFieldData('val_to').number().on_enter(() => this.filter.apply_local())
      ]).on_change(this.filter)
    },
    methods: {
      change_gte () {
        this.filter.values.gt_lt_e = !this.filter.values.gt_lt_e
        this.filter.on_change()
      }
    }
  }
</script>
