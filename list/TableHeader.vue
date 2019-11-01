<template>
  <tr>
    <th v-for="column in table_columns.columns"  v-if="!names_to_show.length || names_to_show.indexOf(column.column_config.name) >= 0" :class="column.column_config.css_classes">
      <slot :name="column.column_config.name">
        <slot :name="column.column_config.name + ':title'">
        {{ column.column_config.title }}
        </slot>
        <template v-if="column.column_config.is_sortable">
          <span v-if="column.order === ''" @click="table_columns.orderBy(column.column_config.name, 'ask')">
            <i class="icon-sort text-muted"></i>
          </span>
          <span v-else-if="column.order === 'ask'" @click="table_columns.orderBy(column.column_config.name, 'desc')">
            <i class="icon-sort-down text-success"></i>
          </span>
          <span v-else-if="column.order === 'desc'" @click="table_columns.orderBy(column.column_config.name, '')">
            <i class="icon-sort-up text-danger"></i>
          </span>
        </template>
      </slot>
    </th>
  </tr>
</template>

<script>
  import {AppliedTableColumns} from './table_columns'

  export default {
    name: 'table-header',
    props: {
      table_columns: {
        required: true,
        type: AppliedTableColumns
      },
      names_to_show: {
        type: Array,
        default: () => []
      }
    }
  }
</script>
x
