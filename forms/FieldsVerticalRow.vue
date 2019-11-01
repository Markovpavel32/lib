<template>
  <div>
    <div v-for="field_name in fields" :class="classes" v-if="formEngine.get_field(field_name)">
      <field-vertical-wrapper :field="formEngine.get_field(field_name)" :model="model" :formEngine="formEngine">
        <form-field :field="formEngine.get_field(field_name)" :model="model" :formEngine="formEngine"></form-field>

      </field-vertical-wrapper>
    </div>
  </div>
</template>

<script>
  import FormField from './FormField'
  import FieldInlineWrapper from './FieldInlineWrapper'
  import FieldVerticalWrapper from './FieldVerticalWrapper'

  export default {
    components: {
      FieldVerticalWrapper,
      FieldInlineWrapper,
      FormField
    },
    name: 'fields-vertical-row',
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
      },
      tooltip: {
        required: false
      }
    }
  }
</script>
