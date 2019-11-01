<template>
  <div class='radio-list field_pretty_checkbox__checkbox' :disabled="disabled">
    <div v-for="item in items" :key="getItemValue(item)">
      <pretty-check-box class="inline-block m-r-xs field_pretty_checkbox__checkbox" :class="schema.fieldClasses" :name="id" color="primary" type="checkbox"  :disabled="disabled" :ref="item.id"
                    :checked="isItemChecked(item)" @change="onSelection(item)">
      </pretty-check-box>
      <div v-html="getItemName(item)" class="field_pretty_checkbox__items clickable" @click="onSelection(item)"></div>
    </div>
  </div>
</template>

<script>
  import PrettyCheckBox from 'pretty-checkbox-vue/check'
  import { abstractField } from 'vue-form-generator'

  export default {
    mixins: [abstractField],
    components: {
      PrettyCheckBox
    },
    computed: {
      items () {
        let values = this.schema.values || []
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
        let value = this.getItemValue(item)
        let index = this.value.indexOf(value)
        if (index < 0) this.value = [...this.value, value]; else {
          let values = [...this.value]
          values.splice(index, 1)
          this.value = values
        }
      },
      isItemChecked (item) {
        let currentValue = this.getItemValue(item)
        return this.value.indexOf(currentValue) >= 0
      },
    }
  }
</script>

<style lang="scss">
  .pretty.m-r-xs {
    margin-right: 5px;
  }
  .field_pretty_checkbox__checkbox {
    white-space: normal !important;
    margin-bottom: unset !important;
  }
  .field_pretty_checkbox__items {
    font-size: 16px;
    line-height: 20px;
    display: inline !important;
  }
  .field_pretty_checkbox__items > span {
    display: inline !important;
  }
</style>
