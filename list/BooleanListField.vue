<template functional>
  <span v-if="props.value" class="text-success">
    {{ parent.$gettext('Да') }}
  </span>
  <span v-else class="text-danger">
    {{ parent.$gettext('Нет') }}
  </span>
</template>

<script>
  export default {
    name: 'boolean-list-field',
    functional: true,
    props: {
      value: {
        type: Boolean,
        required: true
      },
  },
  }
</script>
