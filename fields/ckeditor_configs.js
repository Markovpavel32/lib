function ckeditor_light (field) {
  field.options.ckeditor = {
    'height': 60,
    'contentsCss': ['/static/ckeditor/ckeditor/contents.css'],
    skin: '../../../ckeditor2/moono-lisa',
    'toolbar_Basic': [
      ['Source', '-', 'Bold', 'Italic', 'Underline', 'Strike'],
      ['Subscript', 'Superscript', 'Image'],
    ],
    'toolbar': 'Basic',
    'removePlugins': 'elementspath',
    'width': undefined,
    'extraPlugins': 'justify,uploadimage',
    'filebrowserBrowseUrl': '/ckeditor/browse/',
    'filebrowserUploadUrl': '/ckeditor/upload/',
  }
  return field
}

function ckeditor_default (field) {
  field.options.ckeditor = {
    'contentsCss': ['/static/ckeditor/ckeditor/contents.css', '/static/inspinia/SCSS/bootstrap.css'],
    skin: '../../../ckeditor2/moono-lisa',
    'toolbar_Basic': [
        ['Source', '-', 'Bold', 'Italic']
    ],
    'toolbar_Full': [
      ['Cut', 'Copy', 'Paste', 'PasteText', 'PasteFromWord', 'Undo', 'Redo'],
      ['Bold', 'Italic', 'Underline', 'Strike', 'SpellChecker', '-', 'Subscript', 'Superscript'],
      ['Link', 'Unlink'],
      ['JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock'],
      ['NumberedList', 'BulletedList', '-', 'Outdent', 'Indent'],
      ['Image', 'image2', 'Table', 'HorizontalRule'],
      ['TextColor', 'BGColor'], ['Styles'], ['Format'],
      ['Source']
    ],
    'toolbar': 'Full',
    'filebrowserWindowWidth': 940,
    'filebrowserWindowHeight': 725,
    'extraPlugins': 'justify,uploadimage',
    'filebrowserBrowseUrl': '/ckeditor/browse/',
    'filebrowserUploadUrl': '/ckeditor/upload/',
    'width': undefined,
  }
  return field
}

export {
  ckeditor_light,
  ckeditor_default
}
