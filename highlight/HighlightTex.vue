<template>
  <div>
    <slot></slot>
  </div>
</template>

<script>
  export default {
    name: 'highlight-tex',
    props: {
      enable: {
        type: Boolean,
        default: true
      },
      config: {
        type: Object,
        default: () => ({
          extensions: ['tex2jax.js'],
          jax: ['input/TeX', 'output/HTML-CSS'],
          tex2jax: {inlineMath: [['$', '$'], ['\\(', '\\)']]}
        })
      }
    },
    data: () => ({
      mathjax_url: 'https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.5/MathJax.js?config=TeX-AMS-MML_HTMLorMML&amp;delayStartupUntil=configured'
    }),
    watch: {
      enable (val) {
        if (val === true) return
        this.load_mathjax()
      }
    },
    created () {
      if (this.enable) this.load_mathjax()
    },
    mounted () {
      if (window.MathJax && this.enable) this.compile_mathjax()
    },
    methods: {
      compile_mathjax () {
        window.MathJax.Hub.Config(this.config)
        window.MathJax.Hub.Queue(['Typeset', window.MathJax.Hub, this.$el])
      },
      load_mathjax () {
        if (this.enable && !window.MathJax && !document.head.querySelector('[data-mathjax-loader]')) {
          const script = document.createElement('script')
          script.src = this.mathjax_url
          script.setAttribute('data-mathjax-loader', 'true')
          script.onload = this.compile_mathjax
          document.head.appendChild(script)
        }
        if (window.MathJax) {
          this.compile_mathjax()
        }
      }
    }
  }
</script>
