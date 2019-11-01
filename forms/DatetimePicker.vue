<template>
  <div class="input-group date">
    <date-picker v-model="date" :wrap="true" :config="config[type]" @dp-change="onChange">
    </date-picker>
    <div class="input-group-addon">
      <span class="icon-th"></span>
    </div>
  </div>
</template>

<script>
  import DatePicker from 'vue-bootstrap-datetimepicker'
  import moment from 'moment'

  export default {
    name: 'datetime-picker',
    components: { DatePicker },
    props: {
      value: {
        required: true
      },
      type: {
        type: String,
        'default': 'basic'
      },
      minDate: {
        'default': false
      },
      maxDate: {
        'default': false
      }
    },
    data () {
      return {
        date: '',
        config: {
          basic: {
            format: 'DD-MM-YYYY',
          },
          datetime: {
            format: 'DD-MM-YYYY HH:mm'
            // allowInputToggle: true
          },
          time: {
            format: 'LT',
            useCurrent: false
          },
          start: {
            format: 'DD-MM-YYYY HH:mm',
            allowInputToggle: true,
            maxDate: this.$props.maxDate
          },
          end: {
            format: 'DD-MM-YYYY HH:mm',
            minDate: this.$props.minDate
          }
        }
      }
    },
    created () {
      this.date = this.value
    },
    watch: {
      date (val) {
        this.$emit('input', moment(val, this.config[this.type].format).toDate())
      },
      minDate (val) {
        this.$set(this.config.end, 'minDate', val || null)
      },
      maxDate (val) {
        this.$set(this.config.start, 'maxDate', val || null)
      }
    },
    methods: {
      onChange (e) {
        this.$emit('action', e)
      }
    }
  }
</script>

<style lang="scss" scoped>
  .input-group{
    display: inline-block;
    .form-control{
      width: 140px;
    }
    &-addon{
      display: inline-block;
      width: auto;
      padding-top: 7px;
      padding-bottom: 7px;
    }
  }
</style>
