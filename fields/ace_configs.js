function problem_ace (field) {
    if (!field.options.ace_editor) field.options.ace_editor = {}
    field.options.ace_editor = {height: '300px', width: '100%', mode: 'latex'}
    return field
}

function problem_light_ace (field) {
    if (!field.options.ace_editor) field.options.ace_editor = {}
    field.options.ace_editor = {height: '100px', width: '100%', mode: 'latex'}
    return field
}

export {
  problem_ace,
  problem_light_ace
}
