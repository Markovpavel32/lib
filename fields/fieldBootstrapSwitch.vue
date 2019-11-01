<template>
  <div class="switch-small">
    <input type="checkbox" v-model="value" :autocomplete="schema.autocomplete" :disabled="disabled" :name="schema.inputName" :class="schema.fieldClasses" ref="input">
  </div>
</template>

<script>
  import 'bootstrap-switch'
  import 'bootstrap-switch/dist/css/bootstrap3/bootstrap-switch.min.css'
  import { abstractField } from 'vue-form-generator'
  import jquery from 'jquery'

  export default {
    mixins: [abstractField],
    mounted () {
      jquery(this.$refs.input).bootstrapSwitch({
        'onText': this.$gettext('да'),
        'offText': this.$gettext('нет')
      })
      jquery(this.$refs.input).on('switchChange.bootstrapSwitch', (e, state) => {
        this.value = state
      })
      jquery(this.$refs.input).bootstrapSwitch('state', this.value)
    },
    watch: {
      value (current, old) {
        jquery(this.$refs.input).bootstrapSwitch('state', current)
      }
    }
  }
</script>
