<template>
  <div class='radio-list' :disabled="disabled">
    <div class="flex flex-vertical-center" v-for="item in items" :key="getItemValue(item)">
      <pretty-radio class="inline-block m-r-xs m-b-n-xs field_pretty_radio__wrap" :class="schema.fieldClasses" color="primary" :disabled="disabled"
                    :value="getItemValue(item)" :checked="isItemChecked(item)" @change="onSelection(item)"/>
      <div v-html="getItemName(item)" class="inline-block clickable field_pretty_radio__text" @click="onSelection(item)"></div>
    </div>
  </div>
</template>

<script>
  import PrettyRadio from 'pretty-checkbox-vue/radio'
  import { abstractField } from 'vue-form-generator'

  export default {
    mixins: [abstractField],
    components: {
      PrettyRadio
    },
    computed: {
      items () {
        let values = this.schema.values
        if (values.apply) return values.apply(this, [this.model, this.schema])
        return values
      },
      id () {
        return this.schema.model
      }
    },
    methods: {
      getItemValue (item) {
        let item_value = this.schema.radiosOptions.value || 'value'
        if (item[item_value] !== undefined) return item[item_value]
        /* eslint-disable no-throw-literal */
        throw '`value` is not defined. If you want to use another key name, add a `value` property under `radiosOptions` in the schema. https://icebob.gitbooks.io/vueformgenerator/content/fields/radios.html#radios-field-with-object-values'
      },
      getItemName (item) {
        let item_name = this.schema.radiosOptions.name || 'name'
        if (item[item_name] !== undefined) return item.name
        /* eslint-disable no-throw-literal */
        throw '`name` is not defined. If you want to use another key name, add a `name` property under `radiosOptions` in the schema. https://icebob.gitbooks.io/vueformgenerator/content/fields/radios.html#radios-field-with-object-values'
      },
      onSelection (item) {
        this.value = this.getItemValue(item)
      },
      isItemChecked (item) {
        let currentValue = this.getItemValue(item)
        return (currentValue === this.value)
      },
    }
  }
</script>

<style lang="scss">
  .pretty.m-r-xs {
    margin-right: 5px;
  }
  .field_pretty_radio__wrap {
    white-space: normal !important;
  }
  .field_pretty_radio__text {
    line-height: 34px;
  }
</style>
