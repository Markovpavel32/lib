function bbcode_light (field) {
  field.options.bbcode = {
    height: '100px',
    margin_top: '10px',
    buttons: 'bold,italic,underline,strike,fontcolor,|,sup,sub,|,link,|,bullist,numlist'
  }
  return field
}

function bbcode_default (field) {
  field.options.bbcode = {
    height: '100px',
    margin_top: '10px',
    buttons: 'bold,italic,underline,strike,fontcolor,|,sup,sub,|,link,|,bullist,numlist,|' +
             ',justifyleft,justifycenter,justifyright,|,table,|,code,quote,|,fontsize,fontfamily,|,removeformat'
  }
  return field
}

export {
  bbcode_light,
  bbcode_default
}
