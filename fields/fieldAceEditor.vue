<template>
  <div class="ace-editor">
    <div ref="form_field"></div>
  </div>
</template>
<script>
  import { abstractField } from 'vue-form-generator'
  import {load_require} from '../requirejs'

  export default {
    name: 'field-ace-editor',
    mixins: [abstractField],
    mounted () {
      let $this = this
      let config = this.schema.ace_editor
      let default_config = {height: '300px', width: '100%', mode: 'javascript'}
      config = {...default_config, ...config}
      window.$($this.$refs.form_field).width(config.width)
      load_require(['ace/ace', 'django_ace/ace/mode-' + config.mode]).then((ace) => {
        /* eslint-disable no-undef */
        let editor = ace.edit($this.$refs.form_field)
        this.ace_editor = editor
        editor.setOptions({
          maxLines: Infinity,
          minLines: 2
        })
        window.$($this.$refs.form_field).find('.ace_gutter').css('z-index', 1)
        window.$($this.$refs.form_field).find('.ace_cursor, .ace_cursor-layer').css('z-index', 1)

        editor.getSession().setMode('ace/mode/' + config.mode)
        editor.getSession().setValue($this.value)
        editor.getSession().on('change', () => {
          let old_value = $this.value
          $this.value = editor.getSession().getValue()
          if ($this.schema.onChange) $this.schema.onChange($this.value, old_value)
        })
        if ($this.schema.ace_editor && $this.schema.ace_editor.modifier) {
          $this.schema.ace_editor.modifier(editor)
        }
      })
    },
    destroyed () {
      if (this.ace_editor) this.ace_editor.destroy(false)
    }
  }
</script>
