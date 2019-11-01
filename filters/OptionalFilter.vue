<template>
  <div class="form-horizontal">
    <div class="row margin-bottom-divider">
      <div class="col-sm-2 col-xs-12">
        <label class="control-label bold to-top m-l-lg">{{ filter.config.title }}</label>
      </div>
      <div class="col-sm-9 col-xs-11" v-if="true">
        <div class="col-sm-5 col-xs-no-padding-left">
          <template v-for="field in formEngine.fields" v-if="list.length > 1">
            <form-field :field="field" :model="model" :formEngine="formEngine" @model-updated="change_type">
            </form-field>
          </template>
        </div>
        <div class="col-sm-7 col-xs-no-padding">
          <component :key='filter.config.current_filter.name' :is="filter.config.current_filter.component_name" :filter="filter.config.current_filter"></component>
        </div>
      </div>
        <a class="btn btn-sm btn-icon btn-inverse m-r" @click="filter.destroy()"><i class="icon-trash"></i></a>
    </div>
  </div>
</template>

<script>
  import CircleSwitch from '../../libs/switches/CircleSwitch'
  import {AppliedFilter} from '../../libs/filters/filter'
  import {FormEngine} from '../forms/engine'
  import {VueFieldData} from '../forms/field'
  import FormField from '../forms/FormField'
  import FilterString from '../../libs/filters/components/FilterString'
  import FilterNumber from '../../libs/filters/components/FilterNumber'
  import FilterBoolean from '../../libs/filters/components/FilterBoolean'
  import FilterDatetime from '../../libs/filters/components/FilterDatetime'
  import FilterDatetimeRange from '../../libs/filters/components/FilterDatetimeRange'
  import FilterDumb from '../../libs/filters/components/FilterDumb'
  import FilterDate from '../../libs/filters/components/FilterDate'
  import FilterDateRange from '../../libs/filters/components/FilterDateRange'
  import FilterNotImplemented from '../../libs/filters/components/FilterNotImplemented'
  import FilterBooleanRadio from './components/FilterBooleanRadio'
  import FilterChoice from '../../libs/filters/components/FilterChoice'
  import FilterNumberRange from '../../libs/filters/components/FilterNumberRange'
  import FilterMultiChoice from '../../libs/filters/components/FilterMultiChoice'

  export default {
    name: 'optional-filter',
    components: {
      FilterBooleanRadio, FormField, CircleSwitch, FilterString, FilterNumber, FilterBoolean, FilterDatetime, FilterDatetimeRange, FilterDumb, FilterNotImplemented, FilterDate, FilterDateRange, FilterChoice, FilterNumberRange, FilterMultiChoice
    },
    props: {
      filter: {
        required: true,
        type: AppliedFilter
      },
      name: String
    },
    data: function () {
      let list = this.filter.config.types.map((item) => { return [item.name, item.title] })
      return {
        list: list,
        formEngine: new FormEngine(this, this.filter.name + 'wrapper').with_fields([
          new VueFieldData('list_selected', 'select').label('Опции').choices(list)
        ]),
      }
    },
    methods: {
      change_type (newVal, schema) {
        this.filter.change_type(newVal)
      }
    },
    computed: {
      model: function () {
        return {list_selected: this.filter.config.applied_type}
      },
      is_enabled: {
        get: function () {
          return true
        },
        set: function (newValue) {
        }
      }
    }
  }
</script>
