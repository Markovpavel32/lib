<template>
  <div class="ck-editor">
    <p><textarea ref="form_field" :value="value"></textarea></p>
  </div>
</template>

<script>
  import { abstractField } from 'vue-form-generator'
  import {load_require} from '../requirejs'

  export default {
    name: 'field-ckeditor',
    mixins: [abstractField],
    mounted () {
      let $this = this
      let config = $this.schema.ckeditor
      load_require(['ckeditor/ckeditor/ckeditor']).then((CKEDITOR) => {
        let instance = window.CKEDITOR.replace($this.$refs.form_field, config)
        this.ckeditor = instance
        this.ckeditor.on('loaded', () => {
          instance.on('change', function () {
            $this.value = instance.getData()
          })
        })
        window.CKEDITOR.on('dialogDefinition', function (ev) {
          let dialogName = ev.data.name
          let dialogDefinition = ev.data.definition
          if (dialogName === 'table') {
            let info = dialogDefinition.getContents('info')
            let advanced = dialogDefinition.getContents('advanced')
            for (let field of ['txtBorder', 'txtCellSpace', 'txtCellPad']) {
              info.get(field)['controlStyle'] = 'display: none'
              info.get(field)['label'] = ''
              info.get(field)['default'] = ''
            }
            advanced.get('advCSSClasses')['default'] = 'table table-bordered'
          }
        })
        if (this.schema.ckeditor.modifier) this.ckeditor.on('loaded', () => this.schema.ckeditor.modifier(instance))
      })
    },
    beforeDestroy () {
      if (this.ckeditor) {
        this.ckeditor.removeAllListeners()
        window.CKEDITOR.remove(this.ckeditor)
        this.ckeditor = undefined
      }
    }
  }
</script>
