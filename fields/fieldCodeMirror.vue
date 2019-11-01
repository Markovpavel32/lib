<template>
  <codemirror v-model="value" :options="schema.codeMirrorOptions || {}" @change="schema.onChange || null"></codemirror>
</template>

<script>
  import { abstractField } from 'vue-form-generator'
  import {COMPILER_CM_MODE_PATH} from '../../teaching_materials/runs/compilers/constants'

  export default {
    name: 'fieldCodeMirror',
    mixins: [ abstractField ],
    components: {
      codemirror: () => import(/* webpackChunkName: "codemirror" */ './CodeMirror.vue'),
    },
    data () {
      return {
        mode: COMPILER_CM_MODE_PATH[this.schema.codeMirrorOptions.mode]
      }
    }
  }
</script>
