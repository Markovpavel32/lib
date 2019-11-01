<template functional>
  <span class="btn btn-link text-success" v-if="props.action_info.is_success">
    {{ props.gettext('Сохранено') }}
  </span>
  <a v-else class="btn btn-primary" :class="props.action_info.disabled_dict" @click="props.save">
    <i class="icon-save"></i> {{ props.gettext('Сохранить') }}
  </a>
</template>

<script>
  import {ActionStateInfo} from '../action_states/store'

  export default {
    functional: true,
    name: 'SaveActionButton',
    props: {
      action_info: {
        type: ActionStateInfo,
        required: true
      },
      gettext: {
        type: Function,
        required: true
      },
      save: {
        type: Function,
        required: true
      }
    }
  }
</script>
