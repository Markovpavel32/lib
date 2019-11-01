<template>
  <div class="vue-codemirror-wrap">
    <textarea></textarea>
  </div>
</template>

<script>
  import CodeMirror from 'codemirror/lib/codemirror'
  import 'codemirror/mode/clike/clike'
  import 'codemirror/mode/pascal/pascal'
  import 'codemirror/mode/python/python'
  import 'codemirror/mode/perl/perl'
  import 'codemirror/mode/haskell/haskell'
  import 'codemirror/mode/php/php'
  import 'codemirror/mode/lua/lua'
  import 'codemirror/mode/rust/rust'
  import 'codemirror/mode/go/go'
  import 'codemirror/mode/javascript/javascript'
  import 'codemirror/addon/hint/show-hint'
  import 'codemirror/addon/hint/javascript-hint'

  import 'codemirror/lib/codemirror.css'
  import 'codemirror/theme/darcula.css'

  export default {
    props: {
      value: {
        type: String,
        default: ''
      },
      options: {
        type: Object,
        default: function () {
          return {
            mode: 'text/javascript',
            lineNumbers: true,
            lineWrapping: true,
            indentUnit: 4
          }
        }
      },
    },
    data: function () {
      return {
        skipNextChangeEvent: false
      }
    },
    mounted: async function () {
      var _this = this
      this.editor = CodeMirror.fromTextArea(this.$el.querySelector('textarea'), this.options)
      this.editor.setValue(this.value)
      this.editor.addKeyMap({
          Tab: function (cm) {
            if (cm.somethingSelected()) {
              cm.indentSelection('add')
            } else {
              cm.replaceSelection(cm.getOption('indentWithTabs') ? '\t' : Array(cm.getOption('indentUnit') + 1).join(' '), 'end', '+input')
            }
          }
      })
      this.editor.on('change', function (cm) {
        if (_this.skipNextChangeEvent) {
          _this.skipNextChangeEvent = false
          return
        }
        if (_this.$emit) {
          _this.$emit('change', cm.getValue())
          _this.$emit('input', cm.getValue())
        }
      })
      _this.$emit('initiated', this.editor, CodeMirror)
    },
    watch: {
      'value': function (newVal, oldVal) {
        var editorValue = this.editor.getValue()
        if (newVal !== editorValue) {
          this.skipNextChangeEvent = true
          var scrollInfo = this.editor.getScrollInfo()
          this.editor.setValue(newVal)
          this.editor.scrollTo(scrollInfo.left, scrollInfo.top)
        }
      },
      'options': {
        handler (newOptions) {
          if (typeof newOptions === 'object') {
            for (var optionName in newOptions) {
              if (newOptions.hasOwnProperty(optionName)) {
                this.editor.setOption(optionName, newOptions[optionName])
              }
            }
          }
        },
        deep: true
      }
    },
    beforeDestroy: function () {
      if (this.editor) {
        this.editor.toTextArea()
      }
    }
  }
</script>

<style>
  .CodeMirror-code {
    font-family: Menlo, Monaco, Consolas, "Courier New", monospace;
  }
</style>
