<template>
    <div v-if="formEngine.errors.length" class="bs-callout bs-callout-danger">
      <div v-for="error in formEngine.errors">
        {{ formEngine.get_field(error.field).options.label }}: {{ error.error }}
      </div>
      <slot></slot>
      <!--<div class="cell">-->
        <!--<button v-show='!hide' type="button" class="close" data-dismiss="alert" aria-label="Close" @click="hide_error">-->
          <!--<span aria-hidden="true">&times;</span>-->
        <!--</button>-->
      <!--</div>-->
    </div>
    <div v-else>
      <slot name='no-errors'></slot>
    </div>
</template>

<script>
  import {ErrorMessage} from './store'
  import {FormEngine} from '../forms/engine'

  export default {
    name: 'form-errors',
    methods: {
      hide_error () {
        new ErrorMessage(this.uid).hide_error(this.$store)
      }
    },
    props: {
      formEngine: {
        type: FormEngine,
        required: true,
      },
      hide: {
        required: false,
        default: false
      }
    }
  }
</script>
