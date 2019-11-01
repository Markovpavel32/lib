import {Callbacks} from '../list/row_expander'
import {isRequired} from '../vuex_method'

class HotKeyHandler {
  constructor (element) {
    this.element = element
    this.on_enter = new Callbacks(this)
    this.on_ctrl_enter = new Callbacks(this)
    this.on_escape = new Callbacks(this)
    this._escape_func = (event) => {
      if (event.which === 27) this.on_escape.emit(event)
    }
    window.$(element).keyup((event) => { if (event.which === 13) this.on_enter.emit(event) })
    window.$(element).keyup((event) => { if ((event.keyCode === 10 || event.keyCode === 13) && event.ctrlKey) this.on_ctrl_enter.emit(event) })
    window.$(window.document).keyup(this._escape_func)
  }

  destroy () {
    window.$(window.document).off('keyup', this._escape_func)
  }
}

function get_editor_element (field_component = isRequired()) {
  if (field_component.ckeditor) return field_component.ckeditor.window.$
  return field_component.$el
}

function call_editor_element (field_component = isRequired(), callback = isRequired()) {
  if (field_component.ckeditor) {
    if (field_component.ckeditor.window) callback(field_component.ckeditor.window.$)
    else field_component.ckeditor.on('loaded', () => { callback(field_component.ckeditor.window.$) })
  }
  callback(field_component.$el)
}
export {
  HotKeyHandler,
  get_editor_element,
  call_editor_element
}
