<template>
  <div class="inline-block" v-show="show_single || !show_single && paginator.total_pages > 1">
    <paginate
        :initial-page="paginator.page_number - 1"
        :pageCount="paginator.total_pages"
        :force-page="paginator.page_number - 1"
        :click-handler="set_page"
        :container-class="'pagination'"
        :page-range="3"
        :next-class="css_classes"
        :prev-class="css_classes"
        :page-class="css_classes"
        :prevText="'<'"
        :nextText="'>'">
    </paginate>
    <ul class="pagination">
      <li :class="css_classes" @click="set_page(paginator.page_number)">
        <a tabindex="0"><i :class="refresh_classes"></i></a>
      </li>
    </ul>
  </div>
</template>

<script>
  import Paginate from 'vuejs-paginate'

  export default {
    name: 'list-paginator',
    props: {
      paginator: {
        required: true,
        type: Object
      },
      is_active: {
        required: false,
        default: false,
      },
      set_page: {
        required: true
      },
      show_single: {
        required: false,
        default: true
      }
    },
    computed: {
      refresh_classes () {
        return this.is_active ? 'icon-refresh' : 'icon-refresh icon-spin disabled'
      },
      css_classes () {
        return this.is_active ? '' : 'disabled'
      }
    },
    components: {
      Paginate
    }
  }
</script>
