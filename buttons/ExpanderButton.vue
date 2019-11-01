<template>
    <a v-if="expander.is_open(uid)" @click="expander.close(uid)" class="btn btn-info btn-icon">
      <i class="icon-angle-up bold"></i>
    </a>
    <a v-else @click="expander.open(uid)" class="btn btn-default btn-icon">
      <i class="icon-angle-down bold"></i>
    </a>
</template>

<script>
  import {CheckedRows} from '../list/row_expander'

  export default {
    name: 'expander-button',
    // functional: true,
    props: {
      uid: {
        required: true,
      },
      expander: {
        required: true,
        type: CheckedRows
      }
    }
  }
</script>
