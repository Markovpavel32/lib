<template>
  <span>
    <a class="file-input-button m-r-xs" :class="button_classes">
        {{ trigger }}
        <span v-html="schema.label"></span>
        <input
          ref="input"
          type="file"
          :id="getFieldID(schema)"
          :name="schema.inputName"
          @change="onChange"
          :accept="schema.accept"
          :multiple="schema.multiple"
          :placeholder="schema.placeholder"
          :readonly="schema.readonly"
          :required="schema.required"
          :disabled="disabled"/>
    </a>
    <template v-if="value && value.name" class="file-input-name"> {{ value.name }}</template>
    <a v-if="initial_value" :href="initial_value"><i class="icon-download-alt"></i> <translate>скачать</translate></a>
    </span>
</template>

<script>
  import { abstractField } from 'vue-form-generator'
  import Vue from 'vue'

  export default {
    name: 'field-file-button',
    mixins: [ abstractField ],
    methods: {
      onChange (event) {
        /* eslint-disable no-undef */
        let files = event.target.files || event.dataTransfer.files
        if (!files.length) return
        Vue.set(this.model, this.schema.model, files[0])
        if (this.schema.onChange) {
          this.schema.onChange(files[0])
        }
      }
    },
    data () {
      return {
        initial_value: this.value
      }
    },
    computed: {
      trigger () {
        if (!this.value && this.$refs.input) {
          this.$refs.input.value = ''
        }
        return ''
      },
      button_classes () {
        return this.schema.button_classes || 'btn btn-default'
      }
    }
  }
</script>
