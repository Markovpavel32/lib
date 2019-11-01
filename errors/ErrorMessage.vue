<template>
    <div v-if="error">
      <div :class="classes">
        {{ error }}
        <slot></slot>
      </div>
    </div>
    <div v-else>
      <slot name='no-errors'></slot>
    </div>
</template>

<script>
  import { mapState } from 'vuex'
  import {ErrorMessage} from './store'

  export default {
    name: 'error-message',
    methods: {
      hide_error () {
        new ErrorMessage(this.uid).hide_error(this.$store)
      }
    },
    computed: mapState({
      error (state) {
        return state['errors']['messages'][this.uid]
      }
    }),
    props: {
      uid: {
        type: String,
        required: true,
      },
      hide: {
        required: false,
        default: false
      },
      classes: {
        required: false,
        default: ''
      }
    }
  }
</script>
