
let field_wrapper_mixin = {
  computed: {
    errors: function () {
      return this.formEngine.get_errors(this.field.name)
    },
  },
  props: {
    field: {
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

export {
  field_wrapper_mixin
}
