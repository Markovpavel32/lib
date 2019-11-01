<template>
  <div class="wrapper">
    <input class="form-control"	:id="getFieldID(schema)"
      ref="form_field"
      :type="schema.inputType"
      :value="value"
      @input="value = $event.target.value"
      :class="schema.fieldClasses"
      @change="schema.onChange || null"
      :disabled="disabled"
      :accept="schema.accept"
      :alt="schema.alt"
      :autocomplete="schema.autocomplete"
      :checked="schema.checked"
      :dirname="schema.dirname"
      :formaction="schema.formaction"
      :formenctype="schema.formenctype"
      :formmethod="schema.formmethod"
      :formnovalidate="schema.formnovalidate"
      :formtarget="schema.formtarget"
      :height="schema.height"
      :list="schema.list"
      :max="schema.max"
      :maxlength="schema.maxlength"
      :min="schema.min"
      :minlength="schema.minlength"
      :multiple="schema.multiple"
      :name="schema.inputName"
      :pattern="schema.pattern"
      :placeholder="schema.placeholder"
      :readonly="schema.readonly"
      :required="schema.required"
      :size="schema.size"
      :src="schema.src"
      :step="schema.step"
      :width="schema.width"
      :files="schema.files"
      v-on="schema.events"/>
    <div class="absolute inline" v-if="schema.copy_icon">
      <div class="relative field_input2__copy_icon_container">
        <div class="clickable field_input2__copy_icon" @click="copy_to_clipboard(value)" v-tooltip="'Скопировать'">
          <i class="icon-copy icon-large"></i>
        </div>
      </div>
    </div>
      <i v-if="schema.tooltip"
         class="icon-question-sign inline"
         v-tooltip="schema.tooltip"></i>
      <span class="helper" v-if="schema.inputType === 'color' || schema.inputType === 'range'">
        {{ value }}
      </span>

  </div>

</template>
<script>
  import {abstractField} from 'vue-form-generator'
  import moment from 'moment'
  import Vue from 'vue'
  function clear_alphabet (value, alphabet, case_sensitive) {
    if (alphabet) {
      let new_value = ''
      for (let x of value) {
        if (alphabet.indexOf(x) >= 0 ||
          (!case_sensitive && alphabet.indexOf(x.toLowerCase()) >= 0) ||
          (!case_sensitive && alphabet.indexOf(x.toUpperCase()) >= 0)) new_value += x
      }
      value = new_value
    }
    return value
  }

  function clear_max_length (value, max_length) {
    if (max_length && value && value.length > max_length) {
      value = String(value).slice(0, max_length)
    }
    return value
  }

  function clear_max_value (value, max_value) {
    if ((max_value || max_value === 0) && value && value > max_value) {
      value = max_value
    }
    return value
  }

  function clear_min_value (value, min_value) {
    if ((min_value || min_value === 0) && value && value < min_value) {
      value = min_value
    }
    return value
  }

  export default {
    mixins: [abstractField],
    name: 'field-input2',
    methods: {
      formatValueToField (value) {
        if (value != null) {
          let dt
          switch (this.schema.inputType) {
            case 'date':
              dt = this.schema.format ? moment(value, this.schema.format) : new Date(value)
              return moment.format(dt, 'YYYY-MM-DD')
            case 'datetime':
              dt = this.schema.format ? moment(value, this.schema.format) : new Date(value)
              return moment.format(dt, 'YYYY-MM-DD HH:mm:ss')
            case 'datetime-local':
              dt = this.schema.format ? moment(value, this.schema.format) : new Date(value)
              return moment.format(dt, 'YYYY-MM-DDTHH:mm:ss')
          }
        }
        return value
      },
      log (e) {
      },
      formatValueToModel (value) {
        if (value != null) {
          let m
          let original_value = value
          switch (this.schema.inputType) {
            case 'date':
              m = moment(value, 'YYYY-MM-DD')
              if (m !== false) {
                if (this.schema.format) value = moment.format(m, this.schema.format)
                else value = m.valueOf()
              }
              break
            case 'datetime':
              m = moment(value, 'YYYY-MM-DD HH:mm:ss')
              if (m !== false) {
                if (this.schema.format) value = moment.format(m, this.schema.format)
                else value = m.valueOf()
              }
              break
            case 'datetime-local':
              m = moment(value, 'YYYY-MM-DDTHH:mm:ss')
              if (m !== false) {
                if (this.schema.format) value = moment.format(m, this.schema.format)
                else value = m.valueOf()
              }
              break
            case 'text':
              value = clear_alphabet(value, this.schema.alphabet, this.schema.case_sensitive)
              value = clear_max_length(value, this.schema.maxlength)
              if (original_value !== value) {
                this.$nextTick(() => {
                  Vue.set(this.$refs.form_field, 'value', value)
                })
              }
              return value
            case 'number':
              if (!(!isNaN(parseFloat(value)) && isFinite(value))) return value
              value = clear_alphabet(value, this.schema.alphabet, this.schema.case_sensitive)
              value = clear_max_length(value, this.schema.maxlength)
              value = clear_max_value(value, this.schema.max)
              value = clear_min_value(value, this.schema.min)
              if (original_value !== value) {
                this.$nextTick(() => {
                  Vue.set(this.$refs.form_field, 'value', value)
                })
              }
              return Number(value)
            case 'range':
              return Number(value)
          }
        }
        return value
      },
      copy_to_clipboard (value) {
        navigator.clipboard.writeText(value)
      }
    },
    created () {
      if (this.schema.inputType === 'file') {
        console.warn('The "file" type in input field is deprecated. Use "file" field instead.')
      }
    },
  }
</script>

<style lang="scss">
  .vue-form-generator .field-input .wrapper {
    width: 100%;
  }

  .vue-form-generator .field-input input[type="radio"] {
    width: 100%;
  }

  .vue-form-generator .field-input input[type="color"] {
    width: 60px;
  }

  .vue-form-generator .field-input input[type="range"] {
    padding: 0;
  }

  .vue-form-generator .field-input .helper {
    margin: auto 0.5em;
  }
</style>
