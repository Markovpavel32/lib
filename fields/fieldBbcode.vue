<template>
  <div class="wysibb-editor clear">
    <p><textarea ref="editor" :value="value" @input="value = $event.target.value" @change="schema.onChange || null"></textarea></p>
  </div>
</template>

<script>
  import { abstractField } from 'vue-form-generator'
  import {load_require} from '../requirejs'

  export default {
    name: 'field-bbcode',
    mixins: [abstractField],
    mounted () {
      let $this = this
      let config = $this.schema.bbcode
      load_require(['wysibb/jquery.wysibb']).then((bbcode) => {
        let editor = window.$($this.$refs.editor).wysibb(config)
        editor.closest('.wysibb').find('.wysibb-toolbar').css('max-height', '100px')
        $this.interval_id = setInterval(() => {
          $this.value = editor.bbcode()
        }, 1000)
      })
    },
    beforeDestroy () {
      this.interval_id && clearInterval(this.interval_id)
    }
  }
</script>

<style lang="scss">
  .wysibb ins {
    background-color: unset;
  }
</style>
