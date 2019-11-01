<template>
  <div class="filter-component panel panel-default">
    <div class="panel-heading bold toggle-collapse" :class="{clickable: is_collapsed}" :data-toggle="is_collapsed ? 'collapse' : ''" :href="'#filter-collapse-' + name" :aria-controls="'filter-collapse-' + name" aria-expanded="true">
        {{ title }}
    </div>
    <div class="panel-collapse toggle_content collapse in" :id="'filter-collapse-' + name" aria-expanded="true">
      <div class="panel-body" :class="direction">
        <div v-for="filter in filters" :key="filter.name">
          <component :is="filter.component_name()" :filter="filter"></component>
        </div>
      </div>
      <div class="panel-footer">
        <action-button class="btn btn-primary" :action="apply" :disabled="!is_modified" >Применить</action-button>
        <action-button class="btn btn-default" :action="clear">Очистить</action-button>
      </div>
    </div>
  </div>
</template>

<script>
  import {FilterManager} from './manager'
  import ActionButton from '../buttons/ActionButton'
  import FilterBoolean from './components/FilterBoolean'
  import FilterBooleanCheckBox from './components/FilterBooleanCheckBox'
  import FilterBooleanRadio from './components/FilterBooleanRadio'
  import FilterChoice from './components/FilterChoice'
  import FilterDate from './components/FilterDateRange'
  import FilterPills from './components/FilterPills'
  import FilterString from './components/FilterString'
  import FilterDatetime from './components/FilterDatetime'
  import FilterDatetimeRange from './components/FilterDatetimeRange'
  import FilterDumb from './components/FilterDumb'
  import FilterMultiChoice from './components/FilterMultiChoice'
  import FilterNotImplemented from './components/FilterNotImplemented'
  import FilterNumber from './components/FilterNumber'

  export default {
    name: 'table-filters',
    components: {
      FilterNumber,
      FilterNotImplemented,
      FilterMultiChoice,
      FilterDumb,
      FilterDatetimeRange,
      FilterDatetime,
      FilterString,
      FilterPills,
      FilterDate,
      FilterChoice,
      FilterBooleanRadio,
      FilterBooleanCheckBox,
      FilterBoolean,
      ActionButton,
    },
    props: {
      name: { required: true },
      title: {
        type: String,
        'default': 'Фильтры',
      },
      direction: {
        type: String,
        'default': 'rows'
      },
      is_collapsed: {
        type: Boolean,
        'default': true
      },
      filters: {
        required: true
      }
    },
    data () {
      return {
        filtersCond: {},
        is_modified: false
      }
    },
    created () {
      setTimeout(() => {
        this.is_modified = false
      }, 300)
    },
    watch: {
      filters: {
        handler () {
          this.is_modified = true
        },
        deep: true
      }
    },
    methods: {
      apply () {
        this.filters.map((filter) => {
          return filter.apply()
        })
        this.is_modified = false
        this.$emit('apply', this.name)
      },
      clear () {
        new FilterManager(this.name).apply(this.$store)
      }
    }
  }
</script>

<style lang="scss">
  @mixin basic{
    display: flex;
  }

  .filter-component{
    .rows {
      @include basic;
      flex-direction: column;
    }

    .cols {
      @include basic;
      flex-direction: row;
    }

    .form-item{
      display: inline-block;
    }
  }

</style>
