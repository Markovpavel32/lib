<template>
  <div class="form-group m-r to-top" :class="{'has-error': errors.length}" v-show="field.options.is_visible(model)" v-if="field.options.add_when(model)">
    <div class="inline-block">
      <slot>
      </slot>
      <div class="shp-clear" v-if="field.hint">
          <small class="text-muted">
              {{ field.hint }}
          </small>
      </div>
      <div class="help-inline text-danger" v-if="formEngine.showFieldErrors && errors.length">
        <span v-for="error in errors">{{error.error}}<br></span>
      </div>
    </div>
    <label v-if="!is_label_hidden" class="control-label inline-block" :class="{'optional-field': !field.options.required}">
        {{ field.options.label }}
    </label>
  </div>
</template>

<script>
  import {field_wrapper_mixin} from './wrapper_mixin'

  export default {
    name: 'field-inline-reversed-wrapper',
    props: {
      is_label_hidden: {
        default: false
      }
    },
    mixins: [
      field_wrapper_mixin
    ],
  }
</script>
