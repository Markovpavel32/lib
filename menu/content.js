import {MenuItem} from './menu'

let menu = (
  new MenuItem('root', 'root').add_children([
    new MenuItem('Методика', 'teaching_materials').add_children([
      new MenuItem('Задачи', 'problem_list').add_children([
        new MenuItem('Создание', 'problem_create').use_params(['problem_id']).hide(),
        new MenuItem('Детализация', 'problem_detail').use_params(['problem_id']).add_children([
          new MenuItem('Детализация', 'problem_detail').use_params(['problem_id']),
          new MenuItem('Редактирование', 'problem_edit').use_params(['problem_id']).hide(),
          new MenuItem('Удаление', 'problem_delete').use_params(['problem_id']).hide(),
          new MenuItem('Решение', 'problem_solve').use_params(['problem_id']).hide(),
          new MenuItem('Создание автоматической проверки', 'problem_make_auto').use_params(['problem_id']).hide(),
        ])
      ]),
      new MenuItem('Теги', 'classifier_tags_list'),
    ]),
    new MenuItem('Предметы', 'school_subjects_list_view').add_children(
      [
        new MenuItem('Предметы', 'school_subjects_list_view'),
        new MenuItem('Линейки предметов', 'subject_lines_list_view'),
        new MenuItem('Направления', 'subject_categories_list_view'),
        new MenuItem('Компетенции', 'competences_list_view'),
      ]
    ),
    new MenuItem('Учебный процесс', 'teaching_situation').add_children([
      new MenuItem('Список', 'group_programs').add_children([
        new MenuItem('Детализация', 'group_program_detail').use_params(['group_program_id']).add_children([
          new MenuItem('Редактирование', 'group_program_edit').use_params(['problem_id'])
        ])
      ])
    ])
  ])
).init()

export {
  menu
}
