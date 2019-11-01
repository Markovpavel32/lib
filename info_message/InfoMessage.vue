<template>
  <div v-if="message_visible">
    <div :class="classes" v-if="condition">
      <div class="cell full-width">
         <slot name="message"></slot>
      </div>
      <div class="cell">
        <button v-show='!hide_close_icon' type="button" class="close" data-dismiss="alert" aria-label="Close" @click="hide_message()">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
    </div>
    <div v-else>
      <slot name="else"></slot>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'info-message',
    props: {
      classes: {
        required: false,
        default: 'bs-callout bs-callout-info'
      },
      hide_close_icon: {
        required: false,
        default: false
      },
      condition: {
        required: false,
        default: true
      }
    },
    data () {
      return {
        message_visible: true
      }
    },
    methods: {
      hide_message () {
        this.message_visible = !this.message_visible
      }
    }
  }
</script>
