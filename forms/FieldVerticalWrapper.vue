<template>
  <div :class="{'form-group': true, 'has-error': errors.length}" v-show="field.options.is_visible(model)" v-if="field.options.add_when(model)">
    <label :class="{'optional-field': !field.options.required}">
        {{ field.options.label }}
    </label>
    <div>
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
  </div>
</template>

<script>
  import {field_wrapper_mixin} from './wrapper_mixin'

  export default {
    name: 'field-vertical-wrapper',
    mixins: [
      field_wrapper_mixin
    ],
  }
</script>
