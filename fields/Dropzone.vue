<template>
  <form class='dropzone col-square clear clearfix'  ref="file_input">
    <div class="shp-full-width full-height">
      <div class="dz-message">
        <slot name="name"></slot>
      </div>
      <div class="dropzone-previews m-l-xl" ref="previewsContainer"></div>
    </div>
  </form>
</template>

<script>
  import 'dropzone/dist/dropzone.css'

  export default {
    name: 'dropzone',
    props: {
      url: {
        required: true
      },
      max_size: {
        required: false
      },
      paramName: {
        required: false,
        default: 'files'
      }
    },
    async mounted () {
      let $this = this
      let Dropzone = (await import(/* webpackChunkName: "Dropzone" */'dropzone')).default
      Dropzone.autoDiscover = false
      let csrf = window.$.cookie('csrftoken')
      /* eslint-disable no-new */
      new Dropzone(this.$el, {
        maxFilesize: this.max_size,
        url: this.url,
        paramName: this.paramName,
        previewsContainer: this.$refs.previewsContainer,
        sending: function (file, xhr, formData) {
          formData.append('csrfmiddlewaretoken', csrf)
        },
        init: function () {
          // var _this = this
          this.on('queuecomplete', function (data) {
            this.removeAllFiles()
            console.log('oncomplete', data)
            $this.$emit('oncomplete')
          })
          this.on('uploadprogress', function (file, progress) {
            console.log('onprogress', progress)
            $this.$emit('onprogress', file, progress)
          })
          this.on('error', (e, data) => {
            $this.$emit('onerror', data)
          })
        }
      })
    }
  }
</script>
<style lang="scss" scoped>
  .dropzone {
    border: 1px #e7eaec solid;
  }

  .dropzone .dz-message {
    padding: 2em 0 15px 0;
    margin-left: -40px;
    text-align: center;
  }
</style>
