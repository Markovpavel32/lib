<template>
  <div>
    <slot></slot>
  </div>
</template>

<script>
  export default {
    name: 'CodeMirrorMode',
    props: {
      mode: {
        required: true
      }
    },
  }
</script>
