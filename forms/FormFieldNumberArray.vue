<template>
  <div class="wrapper">
    <input ref="input" class="form-control" v-model="val" type="number" @keyup.108="ev" @keyup.188="ev" @keyup.13="ev"/>
    <div class="values" ref="values">
      <div class="badge badge-default" v-for="(item, index) in arr_values" :key="index">
        {{item}}
        <span @click="del(index)">X</span>
      </div>
    </div>

  </div>
</template>

<script>
  export default {
    name: 'form-field-array',
    props: {
      value: {
        type: Array,
        default () {
          return []
        }
      }
    },
    data () {
      return {
        arr_values: this.value,
        val: ''
      }
    },
    methods: {
      ev (e) {
        if (e.target.value.length > 1) {
          this.arr_values.push(this.val.replace(',', ''))
          this.val = ''
          this.$emit('input', this.arr_values)
          this.set_padding()
        } else {
          this.val = this.val.slice(0, -1)
        }
      },
      del (index) {
        this.arr_values.splice(index, 1)
        this.set_padding()
      },
      set_padding () {
        setTimeout(() => {
          this.$refs.input.style.paddingLeft = this.$refs.values.offsetWidth + 'px'
          this.$refs.input.focus()
        }, 300)
      }
    }
  }
</script>

<style lang="scss">
  .wrapper{
    position: relative;
  }
  .values{
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    padding-left: 5px;
    &__item{
      padding: 0 5px;
      background-color: #ccc;
      display: inline-block;
      margin-right: 5px;
      margin-top: 5px;
      margin-bottom: 5px;
      border-radius: 4px;
      span{
        cursor: pointer;
        background-color: #fafafa;
      }
    }
  }
</style>
