<template>
  <div :class="{'form-group': true, 'has-error': errors.length}" v-show="field.options.is_visible(model)" v-if="field.options.add_when(model)">
    <!--TODO MPI: сделать стиль на форме, удалить yandex-wide-label-->
    <label class="control-label col-md-2 col-md-only-no-padding col-xs-12 yandex-wide-label" :class="{'optional-field': !field.options.required}">
        {{ field.options.label }}
    </label>
    <div class="col-md-10 col-xs-12">
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
    name: 'field-horizontal-wide-wrapper',
    mixins: [
      field_wrapper_mixin
    ],
  }
</script>
