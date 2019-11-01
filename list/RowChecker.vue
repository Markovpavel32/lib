<template>
  <div class="inline-block clickable flex flex-vertical-center" style="font-size: 14px; width: 14px">
    <span v-if="checked_rows.is_all_selected" @click="checked_rows.deselect_all()">
      <pretty-checkbox :checked="true"  name="check" color="success" class="pretty p-default"></pretty-checkbox>
    </span>
    <span v-else-if="checked_rows.is_opened" @click="checked_rows.deselect_all()">
      <pretty-checkbox :checked="true" name="check" class="pretty p-default"></pretty-checkbox>
    </span>
    <span v-else @click="checked_rows.select_all()">
      <pretty-checkbox :checked="false" name="check" class="pretty p-default"></pretty-checkbox>
    </span>
  </div>
</template>

<script>
  import PrettyCheckbox from 'pretty-checkbox-vue/check'
  import {CheckedRows} from './row_expander'

  export default {
    name: 'row-checker',
    components: {
      PrettyCheckbox
    },
    props: {
      checked_rows: {
        required: true,
        type: CheckedRows
      }
    }
  }
</script>
