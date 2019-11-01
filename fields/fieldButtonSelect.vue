<template>
  <dropdown menu-right append-to-body :disabled="disabled" class="full-width">
    <btn type="white" :disabled="disabled" class="full-width">
      <div class="flex to-top" :title="value_display">
        <span class="overflow-hidden text-overflow-ellipsis flex-grow-8" :class="schema.styleClasses" v-html="value_display"></span> <span class="caret m-t-xs"></span>
      </div>
    </btn>
    <template slot="dropdown">
      <li v-for="item in schema.values" @click="value=item.id">
        <a v-html="item.name">
        </a>
      </li>
    </template>
  </dropdown>
</template>

<script>
  import { abstractField } from 'vue-form-generator'

  export default {
    name: 'field-button-select',
    mixins: [abstractField],
    computed: {
      value_display () {
        let item = this.schema.values.find((x) => x.id === this.value)
        if (item) return item.name
        return this.schema.placeholder
      }
    }
  }
</script>
