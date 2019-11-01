<template>
    <div v-if="error">
      <alert-error :classes="classes" :uid="uid" :hide="true">
        <template slot="message">
          <slot name="message"></slot>
        </template>
      </alert-error>
      <button v-if="!is_rights_error && !hide_refresh" class="full-width btn btn-primary" @click="$emit('refresh')">
        <i class="icon-refresh"></i> {{ $gettext('Обновить') }}
      </button>
    </div>
    <div v-else>
      <slot name="else"></slot>
    </div>
</template>

<script>
  import AlertError from './AlertError'
  export default {
    name: 'refresh-error',
    components: {AlertError},
    computed: {
      error () {
        return this.$store.state['errors']['messages'][this.uid]
      },
      is_rights_error () {
        return this.$store.state['errors']['messages'][this.uid] === '403 Недостаточно прав'
      }
    },
    props: {
      uid: {
        type: String,
        required: true,
      },
      classes: {
        required: false,
        default: 'bs-callout bs-callout-danger'
      },
      hide_refresh: {
        required: false,
        default: false
      }
    }
  }
</script>
