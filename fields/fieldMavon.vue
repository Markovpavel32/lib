<template>
  <mavon-editor v-model="value" language="en" fontSize="14px" :toolbars="toolbars" :externalLink="externalLink" ref="mavon" class="styled-ul" :tabSize="4" @imgAdd="upload_image"></mavon-editor>
</template>

<script>
  import {abstractField} from 'vue-form-generator'
  import 'mavon-editor/dist/css/index.css'
  import {ajax_post, get_form_data} from '../ajax'
  import {django_urls} from '../django_urls/urls'

  export default {
    mixins: [abstractField],
    name: 'fieldMavon',
    components: {
      'mavon-editor': () => import(/* webpackChunkName: "mavon-editor" */ 'mavon-editor')
                            .then((mavonEditor) => mavonEditor.mavonEditor),
    },
    data () {
      return {
        externalLink: {
            hljs_js () {
              return ''
            },
            katex_css: false,
            katex_js: false,
        },
        toolbars: {
          bold: true,
          italic: true,
          header: true,
          underline: false,
          strikethrough: false,
          mark: false,
          superscript: true,
          subscript: true,
          quote: true,
          ol: true,
          ul: true,
          link: true,
          imagelink: true,
          code: true,
          table: true,
          fullscreen: false,
          readmodel: false,
          htmlcode: false,
          help: false,
          /* 1.3.5 */
          undo: true,
          redo: true,
          trash: false,
          save: false,
          /* 1.4.2 */
          navigation: false,
          /* 2.1.8 */
          alignleft: false,
          aligncenter: false,
          alignright: false,
          /* 2.2.1 */
          subfield: false,
          preview: true
      }
      }
    },
    methods: {
      upload_image (pos, $file) {
        let formdata = get_form_data(this.schema.img_params || {})
        formdata.append('files', $file)
        let headers = { headers: { 'Content-Type': 'multipart/form-data' } }
        ajax_post(django_urls['api:uploaded_file_create_api'](), formdata, headers)
        .then((data) => {
          console.log(data.data.forEach((x) => {
            this.$refs.mavon.$img2Url(pos, x.file)
          }))
        }).catch((e) => {
          console.log(e)
        })
      }
    },
  }
</script>

<style lang="scss">
  .v-note-wrapper.markdown-body {
    min-height: 50px;
    z-index: 100;
  }
  pre.auto-textarea-block {
    border: none;
  }

  pre.auto-textarea-block + textarea {
    box-shadow: none;
  }
</style>
