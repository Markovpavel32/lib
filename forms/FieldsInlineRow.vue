<template>
  <div>
    <div  v-for="field_name in fields" :class="classes" v-if="formEngine.get_field(field_name)">
      <field-inline-wrapper :field="formEngine.get_field(field_name)" :model="model" :formEngine="formEngine">
        <form-field :field="formEngine.get_field(field_name)" :model="model" :formEngine="formEngine"></form-field>
      </field-inline-wrapper>
    </div>
  </div>
</template>

<script>
  import FormField from './FormField'
  import FieldInlineWrapper from './FieldInlineWrapper'

  export default {
    components: {
      FieldInlineWrapper,
      FormField
    },
    name: 'fields-inline-row',
    props: {
      fields: {
        required: true
      },
      classes: {
        required: false,
        default: ''
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
