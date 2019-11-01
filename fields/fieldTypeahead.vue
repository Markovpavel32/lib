<template>
    <section>
    <input ref="string_input" class="form-control" type="text">
      <typeahead v-if="is_mounted" v-model="string_value" :target="$refs.string_input" :async-function="queryFunction" :item-key="schema.typeahead.key">
      <template slot="item" slot-scope="props">
        <li v-for="(item, index) in props.items" :class="{active:props.activeIndex===index}">
          <a role="button" @click="select(props, item)">
            {{ schema.typeahead.format(item) }}
          </a>
        </li>
      </template>
    </typeahead>
  </section>
</template>

<script>
  import {abstractField} from 'vue-form-generator'

  export default {
    name: 'field-typeahead',
    mixins: [abstractField],
    data () {
      return {
        string_value: '',
        is_mounted: false,
      }
    },
    mounted () {
      this.is_mounted = true
    },
    methods: {
      queryFunction (query, done) {
        this.schema.typeahead.search_func(query, done)
      },
      select (props, item) {
        props.select(item)
        this.value = item.id
        this.schema.onChange(item.id, item)
      }
    }
  }
</script>
