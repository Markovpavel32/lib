<template>
  <div v-if="disabled">
    <input type="text" disabled="disabled" class="form-control" :value="value|moment(schema.dateTimePickerOptions.format)">
  </div>
  <div class='input-group date' v-else>
    <date-picker v-model="value" :wrap="true" :config="{...schema.dateTimePickerOptions, 'showTodayButton': true}" @change="schema.onChange || null"></date-picker>
    <span class="input-group-addon" v-if="!schema.dateTimePickerOptions.inline">
        <span class="glyphicon glyphicon-calendar"></span>
    </span>
  </div>
</template>

<script>
  import { abstractField } from 'vue-form-generator'
  import DatePicker from 'vue-bootstrap-datetimepicker'

  export default {
    components: {DatePicker},
    mixins: [ abstractField ],
  }
</script>
