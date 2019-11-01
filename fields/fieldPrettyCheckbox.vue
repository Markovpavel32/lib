<template>
  <div class='radio-list' :disabled="disabled">
    <pretty-check-box :class="schema.fieldClasses" :name="schema.inputName"
                      :color="schema.color || 'primary'"
                      type="checkbox"
                      :disabled="disabled" v-model="value">
      <div v-html="schema.checkboxLabel"></div>
    </pretty-check-box>
  </div>
</template>

<script>
  import PrettyCheckBox from 'pretty-checkbox-vue/check'
  import { abstractField } from 'vue-form-generator'

  export default {
    mixins: [abstractField],
    components: {
      PrettyCheckBox
    },
  }
</script>
<style lang="scss">
  .form-horizontal .radio-list {
    padding-top: 7px;
  }
</style>
