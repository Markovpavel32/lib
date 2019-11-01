<template>
  <pre class="invisible_pre monospace"><code ref="code" :class="highlighter">{{ code }}</code></pre>
</template>

<script>
  import 'highlight.js/styles/github.css'

  const types = ['cpp', 'delphi', 'python', 'ruby', 'java', 'perl', 'haskell', 'go', 'r', 'cs', 'php', 'lua', 'rust', 'brainfuck', 'bash', 'javascript', 'basic', 'excel', 'erlang']

  export default {
    name: 'high-light-code',
    props: {
      highlighter: {
        required: false,
        type: String,
        default: 'python'
      },
      code: {
        required: true,
        type: String
      }
    },
    async mounted () {
      let hljs = (await import(/* webpackChunkName: "highlightjs" */'highlight.js/lib/highlight')).default
      window.hljs = hljs
      let line_hljs = (await import(/* webpackChunkName: "highlightjs" */'highlightjs-line-numbers.js/src/highlightjs-line-numbers.js')).default
      if (types.indexOf(this.highlighter) < 0) return line_hljs
      hljs.registerLanguage(this.highlighter, (await import(/* webpackChunkName: "highlightjs" */'highlight.js/lib/languages/' + this.highlighter)).default)
      hljs.highlightBlock(this.$refs.code)
      hljs.lineNumbersBlock(this.$refs.code)
      return line_hljs
    }
  }
</script>
<style lang="scss">
  /* for block of numbers */
  .hljs-ln-numbers {
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;

    text-align: center;
    color: #ccc;
    border-right: 1px solid #CCC;
    vertical-align: top;
    padding-right: 5px;

    /* your custom style here */
  }

  /* for block of code */
  .hljs-ln .hljs-ln-code {
    padding-left: 5px;
  }
</style>
