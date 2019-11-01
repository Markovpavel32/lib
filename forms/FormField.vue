<template>
  <component :is="field.component_name()" :disabled='field.is_disabled(model, formEngine)' :model='model'
             :schema="field.get_schema()" ref="form_field"
             :formOptions='options' @model-updated='modelUpdated' @validated="onFieldValidated"></component>
</template>
<script>
  import fieldVueSelect from '../fields/fieldVueSelect'
  import fieldTypeahead from '../fields/fieldTypeahead'
  import {get_field_components, VueFieldData} from './field'
  import fieldMavon from '../fields/fieldMavon'
  import fieldButtonSelect from '../fields/fieldButtonSelect'
  import fieldPrettyRadio from '../fields/fieldPrettyRadio'
  import fieldPrettyCheckbox from '../fields/fieldPrettyCheckbox'
  import fieldBootstrapSwitch from '../fields/fieldBootstrapSwitch'
  import fieldPrettyCheckboxList from '../fields/fieldPrettyCheckboxList'
  import fieldInput2 from '../fields/fieldInput2.vue'
  import FieldAceEditor from '../fields/fieldAceEditor'
  import fieldCkeditor from '../fields/fieldCkeditor'
  import $ from 'jquery'
  import fieldChecklist2 from '../fields/fieldChecklist2'
  let components = get_field_components()

  export default {
    name: 'form-field',
    components: {
      fieldMavon: fieldMavon,
      fieldInput2: fieldInput2,
      fieldAceEditor: FieldAceEditor,
      fieldCkeditor: fieldCkeditor,
      fieldBbcode: fieldMavon,
      fieldVueSelect,
      fieldButtonSelect,
      fieldPrettyRadio,
      fieldPrettyCheckbox,
      fieldPrettyCheckboxList,
      fieldBootstrapSwitch,
      fieldTypeahead,
      fieldChecklist2,
      ...components
    },
    created () {
      this.formEngine.register_field_component(this)
    },
    mounted () {
      if (this.field.is_focus && this.$refs.form_field && this.$refs.form_field.getFieldID) {
        let input_field = window.$(document.getElementById(this.$refs.form_field.getFieldID(this.field.options)))
        if (this.is_scrolled_into_view(input_field)) {
          window.$(document.getElementById(this.$refs.form_field.getFieldID(this.field.options))).focus()
        }
      }
    },
    methods: {
      modelUpdated (newVal, schema) {
        this.$emit('model-updated', newVal, schema)
        this.formEngine.modelUpdated(newVal, schema)
      },
      onFieldValidated (res, errors, field) {
        this.formEngine.onFieldValidated(res, errors, field)
      },
      is_scrolled_into_view (elem) {
        let docViewTop = $(window).scrollTop()
        let docViewBottom = docViewTop + $(window).height()
        let offset = elem.offset()
        if (offset === undefined) return
        let elemTop = offset.top
        let elemBottom = elemTop + elem.height()
        return ((elemBottom <= docViewBottom) && (elemTop >= docViewTop))
    }
    },
    props: {
      field: {
        required: true,
        type: VueFieldData,
      },
      model: {
        required: true,
        type: Object
      },
      formEngine: {
        required: true
      },
      options: {
        type: Object,
        default () {
          return {
            fieldIdPrefix: this.formEngine.formOptions.fieldIdPrefix,
            validateAfterLoad: false,
            validateAfterChanged: true,
            validationErrorClass: 'error',
            validationSuccessClass: '',
          }
        }
      },
    }
  }
</script>
