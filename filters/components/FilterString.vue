<template>
  <div>
    <div class="input-group">
      <form-field :field="formEngine.get_field('val_from')" :model="filter.values" :formEngine="formEngine"></form-field>
      <slot name="buttons">
      <span class="input-group-btn" v-if="enable_clear">
        <btn :class="{'btn btn-default': true, 'disabled': !filter.filter_data.is_changed}" @click="filter.apply_local()"><i class="icon-search"></i></btn>
        <btn :class="{'btn btn-default': true, 'disabled': !formEngine.get_field('val_from')}" @click="filter.values.val_from = ''; filter.apply_local()">×</btn>
      </span>
      <span v-else>
        <button v-if="filter.values.case" class="btn btn-default bold text-center btn-fixed-width" type="button" @click="change_case" v-tooltip.right="'Учитывает регистр'">Aa</button>
        <button v-else class="btn btn-default bold text-center btn-fixed-width " type="button" @click="change_case" v-tooltip.right="'Не учитывает регистр'">a</button>
      </span>
      </slot>
    </div>
  </div>
</template>

<script>
  import FormField from '../../../libs/forms/FormField'
  import {FormEngine} from '../../../libs/forms/engine'
  import {VueFieldData} from '../../../libs/forms/field'
  import {AppliedFilter} from '../filter'

  export default {
    name: 'filter-string',
    components: { FormField },
    props: {
      filter: {
        type: AppliedFilter
      },
      enable_clear: {
        type: Boolean,
        default: false
      }
    },
    data: function () {
      let filter = this.filter
      let formEngine = new FormEngine(this, `${this.filter.name}:engine`).with_fields([
        new VueFieldData('val_from').input().placeholder('Поиск').on_enter(() => {
          filter.apply_local()
        })
      ]).on_change(this.filter)
      return {
        formEngine: formEngine
      }
    },
    methods: {
      change_case () {
        this.filter.values.case = !this.filter.values.case
        this.filter.on_change()
      }
    }
  }
</script>
