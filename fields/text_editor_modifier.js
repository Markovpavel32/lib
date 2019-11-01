import {isRequired} from '../vuex_method'

class TextEditorModifier {
  constructor (formEngine = isRequired(), field_name = isRequired()) {
    this.formEngine = formEngine
    this.field = formEngine.get_field(field_name)
    this.field_name = field_name
  }

  wrap_ck_editor (func) {
    if (!this.field.options.ckeditor) return
    this.field.options.ckeditor.modifier = this.compose_func(this.field.options.ckeditor.modifier, func)
    return this
  }

  wrap_ace_editor (func) {
    if (!this.field.options.ace_editor) return
    this.field.options.ace_editor.modifier = this.compose_func(this.field.options.ace_editor.modifier, func)
    return this
  }

  wrap_text_editor (func) {
    if (this.field.type === 'ckeditor' || this.field.type === 'ace-editor') return
    this.formEngine.call_field_component(this.field_name, func)
    return this
  }

  wrap_editors (func) {
    this.wrap_ace_editor(func)
    this.wrap_ck_editor(func)
    this.wrap_text_editor(func)
    return this
  }

  compose_func (func_1, func_2) {
    return (editor) => {
      func_1(editor)
      func_2(editor)
    }
  }

  set_editor_value (value) {
    this.formEngine.call_field_component(this.field_name, (field) => {
      if (field.ace_editor) field.ace_editor.setValue(value)
      if (field.ckeditor) {
        let bookmarks = field.ckeditor.getSelection().createBookmarks()
        field.ckeditor.setData(value)
        field.ckeditor.getSelection().selectBookmarks(bookmarks)
      }
    })
  }

  insert_text (text) {
    this.formEngine.call_field_component(this.field_name, (field) => {
      if (field.ace_editor) {
        field.ace_editor.session.insert(field.ace_editor.getCursorPosition(), text)
      }
      if (field.ckeditor) return field.ckeditor.insertText(text)
    })
  }
}

export {
  TextEditorModifier
}
