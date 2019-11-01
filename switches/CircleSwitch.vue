<template>
  <div class="onoffswitch">
    <input type="checkbox" name="onoffswitch" class="onoffswitch-checkbox" :id="'switch' + id" v-model="cond">
    <label class="onoffswitch-label" :for="'switch' + id"></label>
  </div>
</template>

<script>
  import {gen_id} from './common'

  export default {
    name: 'circle-switch',
    props: {
      value: {
        type: Boolean,
        'default': false
      }
    },
    data () {
      return {
        id: '',
        cond: false
      }
    },
    created () {
      this.id = gen_id()
      this.cond = this.value
    },
    watch: {
      cond () {
        this.$emit('input', this.cond)
      }
    }
  }
</script>

<style lang="scss" scoped>
  .onoffswitch {
    position: relative;
    width: 30px;
    margin-top: 7px;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;

    &-checkbox {
      display: none;
    }

    &-label {
      display: block;
      overflow: hidden;
      cursor: pointer;
      height: 20px;
      padding: 0;
      line-height: 20px;
      border: 2px solid #E3E3E3;
      border-radius: 20px;
      background-color: #E0E0E0;
      transition: all 0.2s ease-in;
    }

    &-label:before {
      content: "";
      display: block;
      width: 20px;
      margin: 0px;
      background: #FFFFFF;
      position: absolute;
      top: 0;
      bottom: 0;
      right: 10px;
      border: 2px solid #E3E3E3;
      border-radius: 20px;
      transition: all 0.2s ease-in 0s;
    }

    &-checkbox:checked + &-label {
      background-color: #27AE60;
    }

    &-checkbox:checked + &-label,
    &-checkbox:checked + &-label:before {
      border-color: #27AE60;
    }

    &-checkbox:checked + &-label:before {
      right: 0px;
    }
  }
</style>
