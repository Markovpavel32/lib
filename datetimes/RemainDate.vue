<template>
  <div>
    {{ formatted }}
  </div>
</template>

<script>
  import moment from 'moment'

  export default {
    name: 'remain-date',
    props: {
      value: {
        required: true
      },
      period: {
        required: false,
        default: 0
      },
      formatter: {
        required: false,
        type: Function
      }
    },
    data () {
      let timerId
      if (this.period) timerId = setInterval(() => { this.formatted = this.get_formatted() }, this.period)
      return {
        timerId: timerId,
        formatted: this.get_formatted()
      }
    },
    beforeDestroy () {
      if (this.timerId) clearInterval(this.timerId)
    },
    methods: {
      get_formatted () {
        let now = moment()
        let _value = moment(this.value)
        let diff = moment.duration(_value.diff(now))
        if (this.formatter) return this.formatter(_value, diff)
        if (diff.asDays() > 1) return _value.format('L'); else return moment.utc(diff.as('milliseconds')).format('LTS')
      }
    }
  }
</script>
