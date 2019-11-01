<template>
    <span>{{String(props.value).replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ')}}</span>
</template>

<script>
  export default {
    name: 'fieldMoney'
  }
</script>
