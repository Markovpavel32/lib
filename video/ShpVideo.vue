<template>
  <div>
    <div class="embed-responsive embed-responsive-16by9 sticky-modal-content vjs-skin-fix">
      <a class="kek"></a>
      <video class="video-js embed-responsive-item vjs-default-skin" data-setup='{"autoplay": true}' controls ref="video">
          <source :src="source" :type='type'>
          <p class="vjs-no-js">
            To view this video please enable JavaScript, and consider upgrading to a web browser that
            <a href="http://videojs.com/html5-video-support/" target="_blank">supports HTML5 video</a>
          </p>
        </video>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'shp-video',
    props: {
      source: {
        required: true,
        type: String
      },
      type: {
        required: true,
        type: String
      }
    },
    components: {
    },
    mounted () {
      let $this = this
      window.require(['video.js/video', 'requirejs/css!video.js/video-js.min.css', 'requirejs/css!video.js/videojs-skin-twitchy.css'], function (_videojs) {
        _videojs($this.$refs.video)
      })
    },
  }
</script>
