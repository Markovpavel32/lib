<template>
  <v-select :value="value"
            :reduce="value => value.code"
            :options="schema.values" :placeholder="schema.placeholder" class="style-chooser"
            @input="value = $event" @change="schema.onChange || null"/>
</template>

<script>
  import {abstractField} from 'vue-form-generator'
  import vSelect from 'vue-select'
  import 'vue-select/src/scss/vue-select.scss'

  export default {
    name: 'fieldVueSelect',
    components: {vSelect},
    mixins: [abstractField],
  }
</script>
