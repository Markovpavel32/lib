<template>
    <div v-if="error" :class="classes">
      <div class="cell full-width">
       <slot name="message">{{ error }}</slot>
      </div>
      <div class="cell">
        <button v-show='!hide && !auto_hide' type="button" class="close" data-dismiss="alert" aria-label="Close" @click="hide_error">
          <span aria-hidden="true">&times;</span>
        </button>
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
    name: 'alert-error',
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
      auto_hide: {
        type: Boolean,
        default: false
      },
      auto_hide_interval: {
        type: Number,
        default: 3 // in seconds
      },
      classes: {
        required: false,
        default: 'bs-callout bs-callout-danger'
      }
    },
    watch: {
      error (val) {
        if (val && this.auto_hide) {
          setTimeout(() => {
            this.hide_error()
          }, this.auto_hide_interval * 1000)
        }
      }
    }
  }
</script>
