<template>
    <a :class="css_classes" @click="run_action" :href="href">
      <slot></slot>
    </a>
</template>

<script>
  export default {
    name: 'action-button',
    props: {
      classes: {},
      action: {
        type: Function,
        required: true
      },
      disabled_on: {
        type: Function,
        default: () => false
      },
      timeout: {
        default: 1000
      },
      debounce: {
        default: 200
      },
      href: {
        default: undefined
      }
    },
    computed: {
      css_classes: function () {
        let final_classes = this.classes
        if (!final_classes) final_classes = {}
        if (typeof this.classes === 'string') {
          final_classes = {}
          final_classes[this.classes] = true
        }
        let is_disabled = final_classes['disabled']
        return {...final_classes, disabled: this.disabled || is_disabled}
      }
    },
    data: function () {
      return { disabled: false }
    },
    methods: {
      run_action (e) {
        this.$emit('click', e)
        if (!this.disabled) {
          this.disabled = true
          let result = this.action()
          if (result && result.then && result.catch) {
            result.then(this.make_editable).catch(this.make_editable)
          } else {
            setTimeout(this.set_editable, this.timeout)
          }
        }
      },
      set_editable () {
        this.disabled = false
      },
      make_editable () {
        setTimeout(this.set_editable, this.debounce)
      }
    }
  }
</script>
