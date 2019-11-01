<template>
  <dropdown menu-right class="form-group" ref="dropdown" :not-close-elements="elements">
    <btn :class="{'btn btn-default': true, 'disabled': !filter_manager.is_changed}" @click="apply_filters"><i class="icon-search"></i></btn>
    <btn type="info" class="dropdown-toggle updated"><span class="caret"></span></btn>
    <template slot="dropdown" class="pull-right">
      <li v-for="filter in filter_manager.filters" :key="filter.name" v-if="!filter.is_required">
        <a role="button" @click="toogle_filter(filter)">
          <pretty-checkbox name="check" color='info' v-model="filter.is_enabled">{{filter.title}}</pretty-checkbox>
        </a>
      </li>
      <li class="divider"></li>
      <li><a @click="filter_manager.clear()"><i class="icon-trash"></i> Очистить</a></li>
    </template>
  </dropdown>
</template>

<script>
  import {FilterManager} from '../manager'
  import PrettyCheckbox from 'pretty-checkbox-vue/check'

  export default {
    name: 'filter-selector',
    props: {
      filter_manager: FilterManager
    },
    components: {PrettyCheckbox},
    methods: {
      apply_filters () {
        this.filter_manager.apply_filters()
      },
      toogle_filter (filter) {
        if (filter.is_enabled) {
          this.filter_manager.disable_filter(filter.name)
        } else {
          this.filter_manager.enable_filter(filter.name)
        }
      }
    },
    data () {
      return {elements: []}
    },
    mounted () {
      this.elements.push(this.$refs.dropdown.$el)
    }
  }
</script>
