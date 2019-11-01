<template>
  <div>
   <vue-recaptcha :sitekey="sitekey" @verify="verify" ref="captcha"></vue-recaptcha>
  </div>
</template>

<script>
  import VueRecaptcha from 'vue-recaptcha'
  import { abstractField } from 'vue-form-generator'

  export default {
    name: 'fieldRecaptcha',
    mixins: [ abstractField ],
    created: function () {
      let $script = require('scriptjs')
      $script('//www.google.com/recaptcha/api.js?onload=vueRecaptchaApiLoaded&render=explicit')
    },
    data: function () {
      return {
        'sitekey': '6LdtkiITAAAAAOsbHP9KEYBb889RRXGzOZ_t2-1B'
      }
    },
    methods: {
      verify: function (response) {
        this.value = response
      },
      reset_captcha: function () {
        this.$refs.captcha.reset()
        this.value = ''
      }
    },
    components: { VueRecaptcha }
  }
</script>
