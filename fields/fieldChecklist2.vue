<template>
  <div class="wrapper field-checklist">
    <div v-if="schema.listBox" :disabled="disabled" class="listbox form-control">
      <div v-for="item in items" class="list-row" :class="{'is-checked': isItemChecked(item)}">
        <label>
          <input type="checkbox" :checked="isItemChecked(item)" :disabled="disabled" @change="onChanged($event, item)" :name="getInputName(item)">
          {{ getItemName(item) }}
        </label>
      </div>
    </div>
    <div v-if="!schema.listBox" :disabled="disabled" class="combobox form-control">
      <div @click="onExpandCombo" :class="{ expanded: comboExpanded }" class="mainRow">
        <div class="info">
          {{ selectedCount }} выбрано
          <div class="arrow"></div>
        </div>
      </div>
      <div class="droplist">
        <div v-if="comboExpanded" class="list-row">
          <label>
            <input type="checkbox" :disabled="disabled" @change="checkAll($event, item)">
            {{ "Выбрать все" }}
          </label>
        </div>
        <div v-if="comboExpanded" v-for="item in items" :class="{'is-checked': isItemChecked(item)}" class="list-row">
          <label>
            <input type="checkbox" :checked="isItemChecked(item)" :disabled="disabled" @change="onChanged($event, item)" :name="getInputName(item)">
            {{ getItemName(item) }}
          </label>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {isObject, isNil, clone} from 'lodash'
  import { abstractField } from 'vue-form-generator'

  function slugify (name = '') {
    return name
      .toString()
      .trim()
      .replace(/ /g, '-')
      .replace(/-{2,}/g, '-')
      .replace(/^-+|-+$/g, '')
      .replace(/([^a-zA-Z0-9-_/./:]+)/g, '')
  }

  export default {
    mixins: [ abstractField ],
    name: 'field-checklist2',
    data () {
      return {
        comboExpanded: false
      }
    },

    computed: {
      items () {
        let values = this.schema.values
        if (typeof (values) === 'function') return values.apply(this, [this.model, this.schema])
        else return values
      },

      selectedCount () {
        if (this.value) return this.value.length
        return 0
      }
    },

    methods: {
      checkAll (event, item) {
        if (event.target.checked) this.value = this.items.map(x => this.getItemValue(x))
        else this.value = []
      },

      getInputName (item) {
        if (this.schema && this.schema.inputName && this.schema.inputName.length > 0) {
          return slugify(this.schema.inputName + '_' + this.getItemValue(item))
        }
        return slugify(this.getItemValue(item))
      },

      getItemValue (item) {
        if (isObject(item)) {
          if (typeof this.schema['checklistOptions'] !== 'undefined' && typeof this.schema['checklistOptions']['value'] !== 'undefined') {
            return item[this.schema.checklistOptions.value]
          } else {
            if (typeof item['value'] !== 'undefined') {
              return item.value
            } else {
              throw new Error('`value` is not defined. If you want to use another key name, add a `value` property under `checklistOptions` in the schema. https://icebob.gitbooks.io/vueformgenerator/content/fields/checklist.html#checklist-field-with-object-values')
            }
          }
        } else {
          return item
        }
      },

      getItemName (item) {
        if (isObject(item)) {
          if (typeof this.schema['checklistOptions'] !== 'undefined' && typeof this.schema['checklistOptions']['name'] !== 'undefined') {
            return item[this.schema.checklistOptions.name]
          } else {
            if (typeof item['name'] !== 'undefined') {
              return item.name
            } else {
              throw new Error('`name` is not defined. If you want to use another key name, add a `name` property under `checklistOptions` in the schema. https://icebob.gitbooks.io/vueformgenerator/content/fields/checklist.html#checklist-field-with-object-values')
            }
          }
        } else {
          return item
        }
      },

      isItemChecked (item) {
        return (this.value && this.value.indexOf(this.getItemValue(item)) !== -1)
      },

      onChanged (event, item) {
        if (isNil(this.value) || !Array.isArray(this.value)) {
          this.value = []
        }

        if (event.target.checked) {
          // Note: If you modify this.value array, it won't trigger the `set` in computed field
          const arr = clone(this.value)
          arr.push(this.getItemValue(item))
          this.value = arr
        } else {
          // Note: If you modify this.value array, it won't trigger the `set` in computed field
          const arr = clone(this.value)
          arr.splice(this.value.indexOf(this.getItemValue(item)), 1)
          this.value = arr
        }
      },

      onExpandCombo () {
        this.comboExpanded = !this.comboExpanded
      }
    }
  }
</script>
