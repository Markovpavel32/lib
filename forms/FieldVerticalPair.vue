<template>
  <div class="row">
    <div class="col-sm-6" v-if="formEngine.get_field(right)">
      <field-vertical-wrapper :field="formEngine.get_field(left)" :model="model" :formEngine="formEngine">
        <form-field :field="formEngine.get_field(left)" :model="model" :formEngine="formEngine"></form-field>
      </field-vertical-wrapper>
    </div>
    <div class="col-sm-6" v-if="formEngine.get_field(right)">
      <field-vertical-wrapper :field="formEngine.get_field(right)" :model="model" :formEngine="formEngine">
        <form-field :field="formEngine.get_field(right)" :model="model" :formEngine="formEngine"></form-field>
      </field-vertical-wrapper>
    </div>
  </div>
</template>

<script>
  import FormField from './FormField'
  import FieldVerticalWrapper from './FieldVerticalWrapper'

  export default {
    components: {
      FieldVerticalWrapper,
      FormField},
    name: 'field-vertical-pair',
    props: {
      left: {
        required: true
      },
      right: {
        required: true
      },
      model: {
        required: true
      },
      formEngine: {
        required: true
      }
    }
  }
</script>
